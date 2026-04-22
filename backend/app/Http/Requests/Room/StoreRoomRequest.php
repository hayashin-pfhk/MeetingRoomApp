<?php

namespace App\Http\Requests\Room;

/**
 * 会議室 作成リクエスト バリデーション
 */
class StoreRoomRequest extends AbstractRoomRequest
{
    protected function excludedRoomId(): ?int
    {
        return null;
    }
}
