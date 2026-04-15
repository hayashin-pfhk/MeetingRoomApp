<?php

namespace App\Http\Requests\Room;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * 会議室 更新リクエスト バリデーション
 */
class UpdateRoomRequest extends FormRequest
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
        $roomId = $this->route('room')?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('rooms', 'name')->ignore($roomId),
            ],
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => '会議室名',
        ];
    }
}
