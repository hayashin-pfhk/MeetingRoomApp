<?php

namespace App\Http\Requests\Staff;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * スタッフ 作成リクエスト バリデーション
 */
class StoreStaffRequest extends FormRequest
{
    // 認可（現時点では認証未導入のため全て許可）
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
            'name'       => ['required', 'string', 'max:255', 'unique:staffs,name'],
            'department' => ['nullable', 'string', 'max:255'],
        ];
    }

    // 属性名の日本語化（エラーメッセージで使用）
    public function attributes(): array
    {
        return [
            'name'       => 'スタッフ名',
            'department' => '部署',
        ];
    }
}
