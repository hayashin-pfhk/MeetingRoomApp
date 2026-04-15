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
            'room'       => new RoomResource($this->whenLoaded('room')),
            'staffs'     => StaffResource::collection($this->whenLoaded('staffs')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
