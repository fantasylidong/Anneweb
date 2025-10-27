<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SourceBans\Submission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SubmissionController extends Controller
{
    public function index(Request $request): Response
    {
        $archived = $request->query('archived');

        $query = Submission::query()->with('admin')->orderByDesc('submitted');

        if ($archived === '0') {
            $query->where('archiv', 0);
        } elseif ($archived === '1') {
            $query->where('archiv', 1);
        }

        $submissions = $query->paginate(30)->withQueryString();

        $collection = $submissions->through(function (Submission $submission) {
            return [
                'id' => $submission->subid,
                'submitted_at' => $submission->submitted ? date('c', $submission->submitted) : null,
                'suspect' => [
                    'name' => $submission->name,
                    'steam_id' => $submission->SteamId,
                ],
                'reporter' => [
                    'name' => $submission->subname,
                    'steam_id' => $submission->sip,
                    'email' => $submission->email,
                ],
                'reason' => $submission->reason,
                'mod_id' => $submission->ModID,
                'archived' => (bool) $submission->archiv,
                'archived_by' => $submission->admin ? $submission->admin->user : null,
            ];
        })->values();

        return Inertia::render('Admin/Submissions/Index', [
            'submissions' => $collection,
            'links' => $submissions->toArray()['links'],
            'meta' => [
                'current_page' => $submissions->currentPage(),
                'per_page' => $submissions->perPage(),
                'total' => $submissions->total(),
                'last_page' => $submissions->lastPage(),
            ],
            'filters' => [
                'archived' => $archived,
            ],
        ]);
    }

    public function update(Request $request, Submission $submission): RedirectResponse
    {
        $validated = $request->validate(['status' => ['required', 'in:pending,archived']]);

        $submission->forceFill([
            'archiv' => $validated['status'] === 'archived' ? 1 : 0,
            'archivedby' => $validated['status'] === 'archived' ? optional($request->user())->aid : null,
        ])->save();

        return back()->with('success', '举报状态已更新。');
    }
}
