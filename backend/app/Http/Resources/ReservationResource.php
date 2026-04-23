<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * 予約 APIレスポンス整形
 */
class ReservationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'title'      => $this->title,
            'start_time' => $this->start_time?->toIso8601String(),
            'end_time'   => $this->end_time?->toIso8601String(),
            'memo'       => $this->memo,
            'room'       => new RoomResource($this->whenLoaded('room')),
            'staffs'     => StaffResource::collection($this->whenLoaded('staffs')),
        ];
    }
}
