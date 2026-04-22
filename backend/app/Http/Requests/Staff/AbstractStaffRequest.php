<?php

namespace App\Http\Requests\Staff;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * スタッフ 作成/更新リクエスト バリデーション 共通基底クラス
 *
 * Store/Update の差分は「ユニークチェックから自身を除外するか」のみのため、
 * 差分を {@see excludedStaffId()} に注入させる形で集約する。
 */
abstract class AbstractStaffRequest extends FormRequest
{
    /**
     * 認可（現時点では認証未導入のため全て許可）
     */
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
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('staffs', 'name')->ignore($this->excludedStaffId()),
            ],
            'department' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * 属性名の日本語化（エラーメッセージで使用）
     */
    public function attributes(): array
    {
        return [
            'name'       => 'スタッフ名',
            'department' => '部署',
        ];
    }

    /**
     * ユニークチェックから除外する ID（更新時は自身の ID、作成時は null）
     */
    abstract protected function excludedStaffId(): ?int;
}
