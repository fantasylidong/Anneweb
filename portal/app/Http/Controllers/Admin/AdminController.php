<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SourceBans\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));

        $query = Admin::query()
            ->with(['webGroup'])
            ->orderByDesc('aid');

        if ($search !== '') {
            $query->where(function ($builder) use ($search): void {
                $builder
                    ->where('user', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('authid', 'like', "%{$search}%");
            });
        }

        $admins = $query->paginate(20)->withQueryString();

        $collection = $admins->through(fn (Admin $admin) => [
            'aid' => $admin->aid,
            'username' => $admin->user,
            'email' => $admin->email,
            'steam_id' => $admin->authid,
            'group_name' => $admin->webGroup?->name,
            'immunity' => $admin->immunity,
            'expires_at' => optional($admin->expires_at)->toIso8601String(),
            'status' => $admin->isExpired() ? 'expired' : 'active',
            'remaining_days' => $admin->remainingDays(),
            'last_visit' => $admin->lastvisit ? Carbon::createFromTimestamp($admin->lastvisit)->toIso8601String() : null,
        ])->values();

        return Inertia::render('Admin/Admins/Index', [
            'admins' => $collection,
            'links' => $admins->toArray()['links'],
            'meta' => [
                'current_page' => $admins->currentPage(),
                'per_page' => $admins->perPage(),
                'total' => $admins->total(),
                'last_page' => $admins->lastPage(),
            ],
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function show(Admin $admin): Response
    {
        $admin->load(['webGroup', 'serverAssignments']);

        $renewals = $admin->renewals()->limit(10)->get()->map(function ($renewal) {
            return [
                'id' => $renewal->id,
                'previous_expires_at' => optional($renewal->previous_expires_at)->toIso8601String(),
                'new_expires_at' => optional($renewal->new_expires_at)->toIso8601String(),
                'note' => $renewal->note,
                'created_at' => optional($renewal->created_at)->toIso8601String(),
                'extended_by' => $renewal->extended_by,
            ];
        });

        $assignments = $admin->serverAssignments->map(function ($assignment) {
            $uniqueKey = implode('-', [
                $assignment->admin_id,
                $assignment->group_id,
                $assignment->srv_group_id,
                $assignment->server_id,
            ]);

            return [
                'key' => $uniqueKey,
                'server' => $assignment->server?->ip ? sprintf('%s:%s', $assignment->server->ip, $assignment->server->port) : null,
                'server_group' => $assignment->serverGroup?->name,
                'group_flags' => $assignment->serverGroup?->flags,
            ];
        })->values();

        return Inertia::render('Admin/Admins/Show', [
            'admin' => [
                'aid' => $admin->aid,
                'username' => $admin->user,
                'email' => $admin->email,
                'steam_id' => $admin->authid,
                'group_name' => $admin->webGroup?->name,
                'extraflags' => $admin->extraflags,
                'srv_group' => $admin->srv_group,
                'srv_flags' => $admin->srv_flags,
                'srv_password' => $admin->srv_password,
                'immunity' => $admin->immunity,
                'expires_at' => optional($admin->expires_at)->toIso8601String(),
                'is_expired' => $admin->isExpired(),
                'remaining_days' => $admin->remainingDays(),
                'last_visit' => $admin->lastvisit ? Carbon::createFromTimestamp($admin->lastvisit)->toIso8601String() : null,
                'created_at' => optional($admin->created_at)->toIso8601String(),
            ],
            'assignments' => $assignments,
            'renewals' => $renewals,
        ]);
    }
}
