<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SourceBans\Protest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProtestController extends Controller
{
    public function index(Request $request): Response
    {
        $archived = $request->query('archived');

        $query = Protest::query()->with('admin')->orderByDesc('datesubmitted');

        if ($archived === '0') {
            $query->where('archiv', 0);
        } elseif ($archived === '1') {
            $query->where('archiv', 1);
        }

        $protests = $query->paginate(30)->withQueryString();

        $collection = $protests->through(function (Protest $protest) {
            return [
                'id' => $protest->pid,
                'ban_id' => $protest->bid,
                'submitted_at' => $protest->datesubmitted ? date('c', $protest->datesubmitted) : null,
                'reason' => $protest->reason,
                'email' => $protest->email,
                'archived' => (bool) $protest->archiv,
                'archived_by' => $protest->admin ? $protest->admin->user : null,
            ];
        })->values();

        return Inertia::render('Admin/Protests/Index', [
            'protests' => $collection,
            'links' => $protests->toArray()['links'],
            'meta' => [
                'current_page' => $protests->currentPage(),
                'per_page' => $protests->perPage(),
                'total' => $protests->total(),
                'last_page' => $protests->lastPage(),
            ],
            'filters' => [
                'archived' => $archived,
            ],
        ]);
    }

    public function update(Request $request, Protest $protest): RedirectResponse
    {
        $validated = $request->validate(['status' => ['required', 'in:pending,archived']]);

        $protest->forceFill([
            'archiv' => $validated['status'] === 'archived' ? 1 : 0,
            'archivedby' => $validated['status'] === 'archived' ? optional($request->user())->aid : null,
        ])->save();

        return back()->with('success', '申诉状态已更新。');
    }
}
