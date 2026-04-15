<?php

namespace App\Http\Requests\Reservation\Concerns;

use App\Models\Reservation;
use Illuminate\Validation\Validator;

/**
 * 予約の重複チェック（会議室・スタッフ）を行う共通処理
 *
 * 時間帯の重複判定（パターンB / end_time は排他的）:
 *   既存.start_time < 新規.end_time AND 既存.end_time > 新規.start_time
 */
trait ChecksReservationConflicts
{
    /**
     * withValidator で呼び出して重複チェックを実施する
     *
     * @param int|null $excludeReservationId 更新時に自分自身を除外するための予約ID
     */
    protected function validateReservationConflicts(Validator $validator, ?int $excludeReservationId = null): void
    {
        // 基本バリデーション（required, date 等）が通っていなければスキップ
        if ($validator->errors()->isNotEmpty()) {
            return;
        }

        $roomId    = $this->input('room_id');
        $startTime = $this->input('start_time');
        $endTime   = $this->input('end_time');
        $staffIds  = $this->input('staff_ids', []);

        $this->checkRoomConflict($validator, $roomId, $startTime, $endTime, $excludeReservationId);
        $this->checkStaffConflict($validator, $staffIds, $startTime, $endTime, $excludeReservationId);
    }

    /**
     * 同じ会議室で時間帯が重なる予約が存在するか
     */
    private function checkRoomConflict(
        Validator $validator,
        int $roomId,
        string $startTime,
        string $endTime,
        ?int $excludeReservationId
    ): void {
        $query = Reservation::where('room_id', $roomId)
            ->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime);

        if ($excludeReservationId !== null) {
            $query->where('id', '!=', $excludeReservationId);
        }

        if ($query->exists()) {
            $validator->errors()->add(
                'room_id',
                'この会議室は指定された時間帯で既に予約されています。'
            );
        }
    }

    /**
     * 指定スタッフが同時間帯に別の予約に参加していないか
     */
    private function checkStaffConflict(
        Validator $validator,
        array $staffIds,
        string $startTime,
        string $endTime,
        ?int $excludeReservationId
    ): void {
        if (empty($staffIds)) {
            return;
        }

        $conflictStaffs = Reservation::query()
            ->where('start_time', '<', $endTime)
            ->where('end_time', '>', $startTime)
            ->when($excludeReservationId, fn ($q) => $q->where('id', '!=', $excludeReservationId))
            ->whereHas('staffs', fn ($q) => $q->whereIn('staffs.id', $staffIds))
            ->with(['staffs' => fn ($q) => $q->whereIn('staffs.id', $staffIds)])
            ->get()
            ->pluck('staffs')
            ->flatten()
            ->pluck('name')
            ->unique()
            ->values();

        if ($conflictStaffs->isNotEmpty()) {
            $validator->errors()->add(
                'staff_ids',
                sprintf(
                    '次のスタッフは指定時間帯に別の予約に参加しています: %s',
                    $conflictStaffs->join(', ')
                )
            );
        }
    }
}
