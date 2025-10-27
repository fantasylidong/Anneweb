<?php

namespace App\Http\Controllers\Web;

use Inertia\Inertia;
use Inertia\Response;

class ServerIndexController
{
    public function __invoke(): Response
    {
        $servers = [
            [
                'id' => 1,
                'name' => 'Anne 对抗 #1',
                'region' => '上海',
                'ip' => '123.56.78.90:27015',
                'status' => 'online',
                'players' => [
                    'current' => 12,
                    'max' => 16,
                ],
                'latency' => 24,
                'nextMap' => 'c9m1_alleys',
                'lastHeartbeat' => now()->subMinutes(1)->toIso8601String(),
            ],
            [
                'id' => 2,
                'name' => 'Anne 战役 #2',
                'region' => '广州',
                'ip' => '23.45.67.101:27015',
                'status' => 'maintenance',
                'maintenanceNote' => '插件更新中，预计 10 分钟恢复',
                'players' => [
                    'current' => 0,
                    'max' => 16,
                ],
                'latency' => null,
                'nextMap' => 'c12m2_traintunnel',
                'lastHeartbeat' => now()->subMinutes(12)->toIso8601String(),
            ],
            [
                'id' => 3,
                'name' => 'Anne RPG #7',
                'region' => '香港',
                'ip' => '45.92.16.9:27016',
                'status' => 'online',
                'players' => [
                    'current' => 8,
                    'max' => 16,
                ],
                'latency' => 46,
                'nextMap' => 'c5m5_bridge',
                'lastHeartbeat' => now()->subMinutes(4)->toIso8601String(),
            ],
        ];

        return Inertia::render('Servers', [
            'servers' => $servers,
            'filters' => [
                'region' => null,
                'keyword' => null,
                'status' => null,
            ],
            'lastUpdated' => now()->toIso8601String(),
        ]);
    }
}
