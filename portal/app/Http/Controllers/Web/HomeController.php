<?php

namespace App\Http\Controllers\Web;

use Inertia\Inertia;
use Inertia\Response;

class HomeController
{
    public function __invoke(): Response
    {
        return Inertia::render('Home', [
            'hero' => [
                'title' => 'Anne 服务器控制中心',
                'subtitle' => '整合 SourceBans、战绩、插件服务，让你的社区管理更轻松。',
                'actions' => [
                    [
                        'label' => '立即进入控制台',
                        'href' => '/servers',
                        'variant' => 'primary',
                    ],
                    [
                        'label' => '查看捐赠方案',
                        'href' => '/donate',
                        'variant' => 'ghost',
                    ],
                ],
            ],
            'metrics' => [
                [
                    'label' => '在线管理员',
                    'value' => 6,
                    'trend' => '+2',
                ],
                [
                    'label' => '活跃服务器',
                    'value' => 12,
                    'trend' => '+1',
                ],
                [
                    'label' => '今日封禁',
                    'value' => 4,
                    'trend' => '-3',
                ],
                [
                    'label' => '实时在线',
                    'value' => 94,
                    'trend' => '+18',
                ],
            ],
            'featureSections' => [
                [
                    'title' => '统一后台',
                    'description' => 'SourceBans 权限管理、求生之路 2 战绩查询、插件控制台全部集合在一个界面。',
                    'icon' => 'ShieldCheck',
                ],
                [
                    'title' => '灵活扩展',
                    'description' => '提供完善的 API 与插件更新工具，兼容你现有的 Sourcemod 数据库设计。',
                    'icon' => 'Rocket',
                ],
                [
                    'title' => '捐赠闭环',
                    'description' => '内置捐赠页面，支持个人微信收款与程序化接口，自动延长管理员有效期。',
                    'icon' => 'Coins',
                ],
            ],
        ]);
    }
}
