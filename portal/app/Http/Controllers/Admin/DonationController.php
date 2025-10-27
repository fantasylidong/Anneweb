<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\SourceBans\Admin as SourceAdmin;
use App\Services\SourceBans\AdminExpiryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DonationController extends Controller
{
    public function __construct(private readonly AdminExpiryService $expiryService)
    {
    }

    public function index(Request $request): Response
    {
        $status = $request->query('status');

        $query = Donation::query()->orderByDesc('created_at');

        if ($status) {
            $query->where('status', $status);
        }

        $donations = $query->paginate(30)->withQueryString();

        $collection = $donations->through(function (Donation $donation) {
            return [
                'id' => $donation->id,
                'name' => $donation->name,
                'contact' => $donation->contact,
                'amount' => $donation->amount,
                'payment_method' => $donation->payment_method,
                'status' => $donation->status,
                'note' => $donation->note,
                'external_reference' => $donation->external_reference,
                'paid_at' => optional($donation->paid_at)->toIso8601String(),
                'created_at' => optional($donation->created_at)->toIso8601String(),
            ];
        })->values();

        return Inertia::render('Admin/Donations/Index', [
            'donations' => $collection,
            'links' => $donations->toArray()['links'],
            'meta' => [
                'current_page' => $donations->currentPage(),
                'per_page' => $donations->perPage(),
                'total' => $donations->total(),
                'last_page' => $donations->lastPage(),
            ],
            'filters' => [
                'status' => $status,
            ],
        ]);
    }

    public function update(Request $request, Donation $donation): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,verified,rejected'],
            'paid_at' => ['nullable', 'date'],
        ]);

        $paidAt = null;
        if ($validated['status'] === 'verified') {
            $paidAt = isset($validated['paid_at'])
                ? Carbon::parse($validated['paid_at'])
                : Carbon::now();
        } elseif (!empty($validated['paid_at'])) {
            $paidAt = Carbon::parse($validated['paid_at']);
        }

        $donation->forceFill([
            'status' => $validated['status'],
            'paid_at' => $paidAt,
        ])->save();

        return back()->with('success', '捐赠状态已更新。');
    }
}
