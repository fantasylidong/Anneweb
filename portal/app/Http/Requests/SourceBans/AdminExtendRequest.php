<?php

namespace App\Http\Requests\SourceBans;

use Illuminate\Foundation\Http\FormRequest;

class AdminExtendRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'duration_days' => ['required', 'integer', 'min:1', 'max:3650'],
            'note' => ['nullable', 'string', 'max:255'],
            'operator_id' => ['nullable', 'integer'],
        ];
    }
}
