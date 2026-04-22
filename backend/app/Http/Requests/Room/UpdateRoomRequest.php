<?php

namespace App\Http\Requests\Room;

/**
 * 会議室 更新リクエスト バリデーション
 */
class UpdateRoomRequest extends AbstractRoomRequest
{
    // 更新対象の会議室自身はユニークチェックから除外
    protected function excludedRoomId(): ?int
    {
        return $this->route('room')?->id;
    }
}
