<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\BanProtestRequest;
use App\Models\SourceBans\Protest;
use Inertia\Inertia;
use Inertia\Response;

class BanProtestController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Protest/Index');
    }

    public function store(BanProtestRequest $request)
    {
        $data = $request->validated();

        Protest::create([
            'bid' => $data['ban_id'],
            'datesubmitted' => time(),
            'reason' => $data['reason'],
            'email' => $data['player_email'] ?? '',
            'archiv' => 0,
            'archivedby' => null,
            'pip' => $request->ip(),
        ]);

        return redirect()->route('protest.create')->with('success', '申诉已提交，请等待管理员回复。');
    }
}
