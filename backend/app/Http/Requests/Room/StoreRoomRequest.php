<?php

namespace App\Http\Requests\Room;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * 会議室 作成リクエスト バリデーション
 */
class StoreRoomRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255', 'unique:rooms,name'],
        ];
    }

    /**
     * 属性名の日本語化（エラーメッセージで使用）
     */
    public function attributes(): array
    {
        return [
            'name' => '会議室名',
        ];
    }
}
