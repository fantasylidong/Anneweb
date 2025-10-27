<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SourceBans\Comm;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CommController extends Controller
{
    public function index(Request $request): Response
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

        $comms = $query->paginate(30)->withQueryString();

        $collection = $comms->through(function (Comm $comm) {
            return [
                'bid' => $comm->bid,
                'player_name' => $comm->name,
                'steam_id' => $comm->authid,
                'ip' => $comm->ip,
                'reason' => Str::limit($comm->reason, 120),
                'length' => $comm->length,
                'type' => $comm->type,
                'created_at' => $comm->createdAt()?->toIso8601String(),
                'ends_at' => $comm->endsAt()?->toIso8601String(),
                'status' => $comm->isExpired() ? 'expired' : 'active',
                'type_text' => $comm->type === 1 ? '禁言' : '禁麦',
                'is_permanent' => $comm->isPermanent(),
                'admin' => $comm->admin ? [
                    'aid' => $comm->admin->aid,
                    'username' => $comm->admin->user,
                ] : null,
            ];
        })->values();

        return Inertia::render('Admin/Comms/Index', [
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
    

    public function show(Comm $comm): Response
    {
        $comm->load('admin');

        return Inertia::render('Admin/Comms/Show', [
            'comm' => [
                'bid' => $comm->bid,
                'player_name' => $comm->name,
                'steam_id' => $comm->authid,
                'ip' => $comm->ip,
                'reason' => $comm->reason,
                'type' => $comm->type,
                'type_text' => $comm->type === 1 ? '禁言' : '禁麦',
                'created_at' => $comm->createdAt()?->toIso8601String(),
                'ends_at' => $comm->endsAt()?->toIso8601String(),
                'status' => $comm->isExpired() ? 'expired' : 'active',
                'admin' => $comm->admin ? [
                    'aid' => $comm->admin->aid,
                    'username' => $comm->admin->user,
                ] : null,
                'removed_by' => $comm->RemovedBy,
                'remove_type' => $comm->RemoveType,
                'removed_on' => $comm->RemovedOn ? Carbon::createFromTimestamp($comm->RemovedOn)->toIso8601String() : null,
            ],
        ]);
    }

    public function lift(Request $request, Comm $comm): RedirectResponse
    {
        if ($comm->isExpired()) {
            return back()->with('success', '该限制已失效。');
        }

        $admin = $request->user();

        $comm->forceFill([
            'RemoveType' => 'U',
            'RemovedBy' => $admin?->aid ?? 0,
            'RemovedOn' => time(),
            'ends' => time(),
        ])->save();

        return back()->with('success', '禁言/禁麦已解除。');
    }
}
