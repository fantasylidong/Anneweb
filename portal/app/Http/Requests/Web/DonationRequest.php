<?php

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;

class DonationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:128'],
            'contact' => ['nullable', 'string', 'max:128'],
            'amount' => ['required', 'numeric', 'min:1', 'max:500000'],
            'payment_method' => ['required', 'string', 'max:64'],
            'note' => ['nullable', 'string', 'max:500'],
            'external_reference' => ['nullable', 'string', 'max:128'],
        ];
    }
}
