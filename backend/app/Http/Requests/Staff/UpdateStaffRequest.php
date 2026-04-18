<?php

namespace App\Http\Requests\Staff;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * スタッフ 更新リクエスト バリデーション
 */
class UpdateStaffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // 更新対象の自分自身はユニークチェックから除外する
        $staffId = $this->route('staff')?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('staffs', 'name')->ignore($staffId),
            ],
            'department' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function attributes(): array
    {
        return [
            'name'       => 'スタッフ名',
            'department' => '部署',
        ];
    }
}
