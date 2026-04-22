<?php

namespace App\Http\Requests\Reservation;

/**
 * 予約 作成リクエスト バリデーション
 */
class StoreReservationRequest extends AbstractReservationRequest
{
    protected function excludedReservationId(): ?int
    {
        return null;
    }
}
