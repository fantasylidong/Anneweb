<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\SourceBans\L4DPlayerStat;
use App\Models\SourceBans\L4DMapStat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class L4DStatsController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $limit = (int) $request->query('limit', 50);
        $limit = $limit > 0 && $limit <= 100 ? $limit : 50;

        $players = Cache::remember("l4d_top_players_{$limit}", 300, function () use ($limit) {
            return L4DPlayerStat::query()
                ->orderByDesc(DB::raw('points + points_survivors + points_infected'))
                ->limit($limit)
                ->get(['steamid', 'name', 'points', 'points_survivors', 'points_infected', 'lastontime'])
                ->map(function ($player) {
                    return [
                        'steamid' => $player->steamid,
                        'name' => $player->name ? utf8_encode($player->name) : '未知玩家',
                        'points_total' => (int) $player->points + (int) $player->points_survivors + (int) $player->points_infected,
                        'last_online' => (int) $player->lastontime,
                    ];
                });
        });

        $maps = Cache::remember('l4d_top_maps', 300, function () {
            return L4DMapStat::query()
                ->orderByDesc('playtime_nor')
                ->limit(20)
                ->get(['name', 'playtime_nor', 'kills_nor', 'points_nor'])
                ->map(function ($map) {
                    return [
                        'name' => $map->name,
                        'playtime' => (int) $map->playtime_nor,
                        'points' => (int) $map->points_nor,
                        'kills' => (int) $map->kills_nor,
                    ];
                });
        });

        return Inertia::render('Stats/L4D2', [
            'players' => $players,
            'maps' => $maps,
            'limit' => $limit,
        ]);
    }
}
