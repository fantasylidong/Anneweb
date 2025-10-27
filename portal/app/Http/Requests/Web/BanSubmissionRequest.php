<?php

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;

class BanSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'suspect_name' => ['required', 'string', 'max:128'],
            'suspect_steam_id' => ['nullable', 'string', 'max:64'],
            'server' => ['nullable', 'string', 'max:128'],
            'evidence' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'evidence' => ['nullable', 'string', 'max:255'],
            'mod_id' => ['nullable', 'integer', 'min:0'],
            'reporter_name' => ['nullable', 'string', 'max:128'],
            'reporter_email' => ['nullable', 'string', 'email', 'max:128'],
            'reporter_steam_id' => ['nullable', 'string', 'max:64'],
        ];
    }
}
