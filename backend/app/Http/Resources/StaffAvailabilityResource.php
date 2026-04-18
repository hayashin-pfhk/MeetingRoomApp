<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * スタッフ空き状況 APIレスポンス整形
 *
 * 期待するリソース: Staff モデル + 事前にフィルタ済みの reservations（競合する予約のみ）
 */
class StaffAvailabilityResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // 事前にロード済みの competing reservations（競合予約）
        $conflicting = $this->reservations->first();

        return [
            'id'         => $this->id,
            'name'       => $this->name,
            'department' => $this->department,
            'available'  => $conflicting === null,
            'conflicting_reservation' => $conflicting === null ? null : [
                'id'         => $conflicting->id,
                'title'      => $conflicting->title,
                'start_time' => $conflicting->start_time?->toIso8601String(),
                'end_time'   => $conflicting->end_time?->toIso8601String(),
                'room'       => $conflicting->room ? [
                    'id'   => $conflicting->room->id,
                    'name' => $conflicting->room->name,
                ] : null,
            ],
        ];
    }
}
