<?php

namespace App\Http\Requests\Staff;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * スタッフ空き状況 取得リクエスト バリデーション
 */
class StaffAvailabilityRequest extends FormRequest
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
        return [
            'start_time'             => ['required', 'date'],
            'end_time'               => ['required', 'date', 'after:start_time'],
            'exclude_reservation_id' => ['nullable', 'integer', 'exists:reservations,id'],
        ];
    }

    public function attributes(): array
    {
        return [
            'start_time'             => '開始日時',
            'end_time'               => '終了日時',
            'exclude_reservation_id' => '除外する予約ID',
        ];
    }
}
