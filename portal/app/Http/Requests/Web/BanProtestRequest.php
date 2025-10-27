<?php

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;

class BanProtestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'ban_id' => ['required', 'integer', 'min:1'],
            'player_name' => ['required', 'string', 'max:128'],
            'player_email' => ['nullable', 'string', 'email', 'max:128'],
            'reason' => ['required', 'string'],
        ];
    }
}
