<?php

namespace App\Http\Requests\Reservation;

/**
 * 予約 更新リクエスト バリデーション
 */
class UpdateReservationRequest extends AbstractReservationRequest
{
    // 更新対象の予約自身は重複チェックから除外
    protected function excludedReservationId(): ?int
    {
        return $this->route('reservation')?->id;
    }
}
