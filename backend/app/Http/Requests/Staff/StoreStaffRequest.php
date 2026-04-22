<?php

namespace App\Http\Requests\Staff;

/**
 * スタッフ 作成リクエスト バリデーション
 */
class StoreStaffRequest extends AbstractStaffRequest
{
    protected function excludedStaffId(): ?int
    {
        return null;
    }
}
