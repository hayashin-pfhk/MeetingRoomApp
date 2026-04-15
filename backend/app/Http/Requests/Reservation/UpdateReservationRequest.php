<?php

namespace App\Http\Requests\Reservation;

use App\Http\Requests\Reservation\Concerns\ChecksReservationConflicts;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

/**
 * 予約 更新リクエスト バリデーション
 */
class UpdateReservationRequest extends FormRequest
{
    use ChecksReservationConflicts;

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'room_id'      => ['required', 'integer', 'exists:rooms,id'],
            'title'        => ['required', 'string', 'max:255'],
            'start_time'   => ['required', 'date', 'after_or_equal:now'],
            'end_time'     => ['required', 'date', 'after:start_time'],
            'staff_ids'    => ['required', 'array', 'min:1'],
            'staff_ids.*'  => ['integer', 'distinct', 'exists:staffs,id'],
        ];
    }

    // 重複チェック（更新対象の予約自身は除外）
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $v) {
            $reservationId = $this->route('reservation')?->id;
            $this->validateReservationConflicts($v, $reservationId);
        });
    }

    public function attributes(): array
    {
        return [
            'room_id'     => '会議室',
            'title'       => 'タイトル',
            'start_time'  => '開始日時',
            'end_time'    => '終了日時',
            'staff_ids'   => '参加スタッフ',
            'staff_ids.*' => '参加スタッフ',
        ];
    }
}
