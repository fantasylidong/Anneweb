<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SourceBans\Server;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServerController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));
        $status = $request->query('status');

        $query = Server::query()->with(['mod', 'groups'])->orderByDesc('sid');

        if ($search !== '') {
            $query->where(function ($builder) use ($search): void {
                $builder
                    ->where('ip', 'like', "%{$search}%")
                    ->orWhere('port', 'like', "%{$search}%");
            });
        }

        if ($status === 'enabled') {
            $query->where('enabled', 1);
        } elseif ($status === 'disabled') {
            $query->where('enabled', 0);
        }

        $servers = $query->paginate(20)->withQueryString();

        $collection = $servers->through(function (Server $server) {
            return [
                'sid' => $server->sid,
                'ip' => $server->ip,
                'port' => $server->port,
                'address' => sprintf('%s:%s', $server->ip, $server->port),
                'mod' => $server->mod?->name,
                'mod_folder' => $server->mod?->modfolder,
                'enabled' => (bool) $server->enabled,
                'server_groups' => $server->groups->pluck('name')->all(),
                'group_flags' => $server->groups->mapWithKeys(fn ($group) => [$group->name => $group->flags])->all(),
            ];
        })->values();
 
        return Inertia::render('Admin/Servers/Index', [
            'servers' => $collection,
            'links' => $servers->toArray()['links'],
            'meta' => [
                'current_page' => $servers->currentPage(),
                'per_page' => $servers->perPage(),
                'total' => $servers->total(),
                'last_page' => $servers->lastPage(),
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
        ]);
    }
}
