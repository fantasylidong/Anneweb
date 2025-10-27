<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\SourceBans\Comm;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CommListController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $type = $request->query('type');
        $status = $request->query('status');

        $query = Comm::query()->with('admin')->orderByDesc('created');

        if ($search !== '') {
            $query->where(function ($builder) use ($search): void {
                $builder
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('authid', 'like', "%{$search}%")
                    ->orWhere('ip', 'like', "%{$search}%");
            });
        }

        if ($type === 'mute') {
            $query->where('type', 1);
        } elseif ($type === 'gag') {
            $query->where('type', 2);
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

        $comms = $query->paginate(25)->withQueryString();

        $collection = $comms->through(function (Comm $comm) {
            return [
                'bid' => $comm->bid,
                'player_name' => $comm->name,
                'steam_id' => $comm->authid,
                'ip' => $comm->ip,
                'reason' => $comm->reason,
                'length' => $comm->length,
                'length_text' => $comm->isPermanent() ? '永久' : sprintf('%d 分钟', $comm->length),
                'type' => $comm->type,
                'type_text' => $comm->type === 1 ? '禁言' : '禁麦',
                'created_at' => $comm->createdAt()?->toIso8601String(),
                'ends_at' => $comm->endsAt()?->toIso8601String(),
                'status' => $comm->isExpired() ? 'expired' : 'active',
                'admin' => $comm->admin ? [
                    'aid' => $comm->admin->aid,
                    'username' => $comm->admin->user,
                ] : null,
            ];
        })->values();

        return Inertia::render('Comms/Index', [
            'comms' => $collection,
            'links' => $comms->toArray()['links'],
            'meta' => [
                'current_page' => $comms->currentPage(),
                'per_page' => $comms->perPage(),
                'total' => $comms->total(),
                'last_page' => $comms->lastPage(),
            ],
            'filters' => [
                'search' => $search,
                'type' => $type,
                'status' => $status,
            ],
        ]);
    }
}
