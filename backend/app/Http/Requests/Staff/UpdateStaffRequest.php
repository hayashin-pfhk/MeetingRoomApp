<?php

namespace App\Http\Requests\Staff;

/**
 * スタッフ 更新リクエスト バリデーション
 */
class UpdateStaffRequest extends AbstractStaffRequest
{
    // 更新対象のスタッフ自身はユニークチェックから除外
    protected function excludedStaffId(): ?int
    {
        return $this->route('staff')?->id;
    }
}
