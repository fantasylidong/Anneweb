<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\SourceBans\Ban;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class BanListController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $status = $request->query('status');

        $query = Ban::query()
            ->with('admin')
            ->orderByDesc('created');

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

        $bans = $query->paginate(25)->withQueryString();

        $collection = $bans->through(function (Ban $ban) {
            return [
                'bid' => $ban->bid,
                'player_name' => $ban->name,
                'steam_id' => $ban->authid,
                'ip' => $ban->ip,
                'reason' => $ban->reason,
                'length' => $ban->length,
                'length_text' => $ban->isPermanent() ? '永久封禁' : sprintf('%d 分钟', $ban->length),
                'created_at' => $ban->createdAt()?->toIso8601String(),
                'ends_at' => $ban->endsAt()?->toIso8601String(),
                'status' => $ban->isExpired() ? 'expired' : 'active',
                'admin' => $ban->admin ? [
                    'aid' => $ban->admin->aid,
                    'username' => $ban->admin->user,
                ] : null,
            ];
        })->values();

        return Inertia::render('Bans/Index', [
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
            ],
        ]);
    }
}
