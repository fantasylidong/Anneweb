<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\DonationRequest;
use App\Models\Donation;
use Inertia\Inertia;
use Inertia\Response;

class DonationController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Donate/Index');
    }

    public function store(DonationRequest $request)
    {
        $data = $request->validated();

        $amountInCents = (int) round((float) $data['amount'] * 100);

        Donation::create([
            'name' => $data['name'] ?? null,
            'contact' => $data['contact'] ?? null,
            'amount' => $amountInCents,
            'payment_method' => $data['payment_method'],
            'note' => $data['note'] ?? null,
            'external_reference' => $data['external_reference'] ?? null,
            'status' => 'pending',
            'paid_at' => null,
        ]);

        return redirect()->route('donate.create')->with('success', '感谢你的支持，我们将在后台确认支付后自动续期。');
    }
}
