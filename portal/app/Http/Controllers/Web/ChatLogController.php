<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\SourceBans\ChatMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class ChatLogController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'server' => ['nullable', 'string', 'max:255'],
            'steamid' => ['nullable', 'string', 'max:64'],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date'],
            'per_page' => ['nullable', 'integer', 'min:10', 'max:200'],
        ]);

        $perPage = $filters['per_page'] ?? 50;

        $query = ChatMessage::query();

        if (! empty($filters['search'])) {
            $query->where(function ($subQuery) use ($filters): void {
                $keyword = $filters['search'];

                $subQuery->where('name', 'like', "%{$keyword}%")
                    ->orWhere('steamid', 'like', "%{$keyword}%")
                    ->orWhere('message', 'like', "%{$keyword}%")
                    ->orWhere('server', 'like', "%{$keyword}%");
            });
        }

        if (! empty($filters['steamid'])) {
            $query->where('steamid', 'like', "%{$filters['steamid']}%");
        }

        if (! empty($filters['server'])) {
            $query->where('server', $filters['server']);
        }

        if (! empty($filters['date_from'])) {
            $query->where('date', '>=', Carbon::parse($filters['date_from'])->startOfDay());
        }

        if (! empty($filters['date_to'])) {
            $query->where('date', '<=', Carbon::parse($filters['date_to'])->endOfDay());
        }

        $messages = $query
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();

        $servers = ChatMessage::query()
            ->whereNotNull('server')
            ->where('server', '!=', '')
            ->select('server')
            ->distinct()
            ->orderBy('server')
            ->pluck('server');

        $collection = $messages->through(function (ChatMessage $message) {
            return [
                'id' => $message->id,
                'name' => $message->name,
                'steamid' => $message->steamid,
                'message' => $message->message,
                'server' => $message->server,
                'date' => optional($message->date)->toIso8601String(),
            ];
        });

        return Inertia::render('Chat/Index', [
            'messages' => $collection,
            'filters' => [
                'search' => $filters['search'] ?? null,
                'server' => $filters['server'] ?? null,
                'steamid' => $filters['steamid'] ?? null,
                'date_from' => $filters['date_from'] ?? null,
                'date_to' => $filters['date_to'] ?? null,
                'per_page' => $perPage,
            ],
            'links' => $messages->toArray()['links'],
            'meta' => [
                'current_page' => $messages->currentPage(),
                'per_page' => $messages->perPage(),
                'total' => $messages->total(),
                'last_page' => $messages->lastPage(),
            ],
            'servers' => $servers,
        ]);
    }
}
