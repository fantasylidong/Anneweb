<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\BanSubmissionRequest;
use App\Models\SourceBans\Submission;
use App\Models\SourceBans\Mod;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BanSubmissionController extends Controller
{
    public function create(Request $request): Response
    {
        $mods = Mod::query()->orderBy('name')->get(['mid', 'name']);

        return Inertia::render('Submit/Index', [
            'mods' => $mods->map(fn ($mod) => [
                'id' => $mod->mid,
                'name' => $mod->name,
            ])->values()->all(),
        ]);
    }

    public function store(BanSubmissionRequest $request)
    {
        $data = $request->validated();

        $description = trim($data['description']);
        if (!empty($data['evidence'])) {
            $description .= "

证据: " . $data['evidence'];
        }

        Submission::create([
            'submitted' => time(),
            'ModID' => (int) ($data['mod_id'] ?? 0),
            'SteamId' => $data['suspect_steam_id'] ?? '',
            'name' => $data['suspect_name'],
            'email' => $data['reporter_email'] ?? '',
            'reason' => $description,
            'ip' => $request->ip(),
            'subname' => $data['reporter_name'] ?? '',
            'sip' => $data['reporter_steam_id'] ?? '',
            'archiv' => 0,
            'archivedby' => null,
            'server' => null,
        ]);

        return redirect()->route('submit.create')->with('success', '举报已提交，我们会尽快处理。');
    }
}
