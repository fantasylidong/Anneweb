<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SourceBans\Ban;
use App\Models\SourceBans\Mod;
use App\Models\SourceBans\Server;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BanController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $status = $request->query('status');
        $length = $request->query('length');
        $modId = $request->query('mod');

        $query = Ban::query()->with(['admin'])->orderByDesc('created');

        if ($search !== '') {
            $query->where(function ($builder) use ($search): void {
                $builder
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('authid', 'like', "%{$search}%")
                    ->orWhere('ip', 'like', "%{$search}%");
            });
        }

        if ($status === 'active') {
            $query->where(function ($builder): void {
                $builder
                    ->where('length', 0)
                    ->orWhere('ends', '>', time());
            });
        } elseif ($status === 'expired') {
            $query->where(function ($builder): void {
                $builder
                    ->where('length', '>', 0)
                    ->where('ends', '<=', time());
            });
        }

        if ($length === 'permanent') {
            $query->where('length', 0);
        } elseif ($length === 'temporary') {
            $query->where('length', '>', 0);
        }

        if ($modId) {
            $query->where('sid', function ($sub) use ($modId) {
                $sub->select('sid')
                    ->from('sb_servers')
                    ->where('modid', (int) $modId);
            });
        }

        $bans = $query->paginate(30)->withQueryString();

        $collection = $bans->through(function (Ban $ban) {
            $admin = $ban->admin;

            return [
                'bid' => $ban->bid,
                'player_name' => $ban->name,
                'steam_id' => $ban->authid,
                'ip' => $ban->ip,
                'reason' => Str::limit($ban->reason, 120),
                'length' => $ban->length,
                'created_at' => $ban->createdAt()?->toIso8601String(),
                'ends_at' => $ban->endsAt()?->toIso8601String(),
                'status' => $ban->isExpired() ? 'expired' : 'active',
                'is_permanent' => $ban->isPermanent(),
                'admin' => $admin ? [
                    'aid' => $admin->aid,
                    'username' => $admin->user,
                ] : null,
            ];
        })->values();

        $mods = Mod::query()->orderBy('name')->get(['mid', 'name']);

        return Inertia::render('Admin/Bans/Index', [
            'bans' => $collection,
            'links' => $bans->toArray()['links'],
            'meta' => [
                'current_page' => $bans->currentPage(),
                'per_page' => $bans->perPage(),
                'total' => $bans->total(),
                'last_page' => $bans->lastPage(),
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
                'length' => $length,
                'mod' => $modId,
            ],
            'mods' => $mods->map(fn ($mod) => [
                'id' => $mod->mid,
                'name' => $mod->name,
            ]),
        ]);
    

    public function show(Ban $ban): Response
    {
        $ban->load('admin');

        return Inertia::render('Admin/Bans/Show', [
            'ban' => [
                'bid' => $ban->bid,
                'player_name' => $ban->name,
                'steam_id' => $ban->authid,
                'ip' => $ban->ip,
                'reason' => $ban->reason,
                'created_at' => $ban->createdAt()?->toIso8601String(),
                'ends_at' => $ban->endsAt()?->toIso8601String(),
                'length' => $ban->length,
                'is_permanent' => $ban->isPermanent(),
                'status' => $ban->isExpired() ? 'expired' : 'active',
                'admin' => $ban->admin ? [
                    'aid' => $ban->admin->aid,
                    'username' => $ban->admin->user,
                ] : null,
                'removed_by' => $ban->RemovedBy,
                'remove_type' => $ban->RemoveType,
                'removed_on' => $ban->RemovedOn ? Carbon::createFromTimestamp($ban->RemovedOn)->toIso8601String() : null,
            ],
        ]);
    }

    public function unban(Request $request, Ban $ban): RedirectResponse
    {
        if ($ban->isExpired()) {
            return back()->with('success', '该封禁已失效。');
        }

        $admin = $request->user();

        $ban->forceFill([
            'RemoveType' => 'U',
            'RemovedBy' => $admin?->aid ?? 0,
            'RemovedOn' => time(),
            'ends' => time(),
        ])->save();

        return back()->with('success', '封禁已解除。');
    }
}
