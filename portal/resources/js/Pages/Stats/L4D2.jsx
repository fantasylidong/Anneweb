import { Head, router, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const limitOptions = [10, 25, 50, 100];

export default function L4D2Stats() {
    const { props } = usePage();
    const players = props.players ?? [];
    const maps = props.maps ?? [];
    const limit = props.limit ?? 50;

    const handleLimitChange = (event) => {
        router.visit('/stats/l4d2', {
            method: 'get',
            data: { limit: event.target.value },
            preserveState: true,
            replace: true,
        });
    };

    return (
        <MainLayout>
            <Head title="求生之路 2 统计" />
            <div className="bg-slate-950">
                <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:px-10">
                    <header className="flex flex-col gap-4">
                        <h1 className="text-4xl font-semibold text-white">求生之路 2 统计</h1>
                        <p className="text-sm leading-relaxed text-slate-400">
                            数据由 SourceMod 插件实时统计，展示活跃玩家排名、地图热度等信息。
                        </p>
                    </header>

                    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-white">玩家排行榜</h2>
                                <p className="text-xs text-slate-500">
                                    前 {limit} 名玩家，积分统计包含生还者、感染者综合得分。
                                </p>
                            </div>
                            <label className="flex items-center gap-3 text-sm text-slate-300">
                                显示数量
                                <select
                                    value={limit}
                                    onChange={handleLimitChange}
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                >
                                    {limitOptions.map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
                            <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
                                <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">排名</th>
                                        <th className="px-4 py-3">玩家</th>
                                        <th className="px-4 py-3">积分</th>
                                        <th className="px-4 py-3">最后在线</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {players.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-4 py-6 text-center text-slate-500">
                                                暂无排行榜数据。
                                            </td>
                                        </tr>
                                    ) : (
                                        players.map((player, index) => {
                                            const lastOnline = player.last_online
                                                ? dayjs.unix(player.last_online).fromNow()
                                                : '未知';

                                            return (
                                                <tr key={player.steamid} className="hover:bg-slate-900/40">
                                                    <td className="px-4 py-3 text-sm text-slate-400">#{index + 1}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="font-medium text-white">{player.name}</span>
                                                        <span className="block font-mono text-xs text-slate-500">{player.steamid}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-slate-300">{player.points_total}</td>
                                                    <td className="px-4 py-3 text-xs text-slate-400">{lastOnline}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-white">热门地图</h2>
                                <p className="text-xs text-slate-500">按照普通难度的累计游戏时长排序。</p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {maps.length === 0 ? (
                                <p className="col-span-2 text-center text-slate-500">暂无地图数据。</p>
                            ) : (
                                maps.map((map) => (
                                    <div key={map.name} className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                                        <h3 className="text-sm font-semibold text-white">{map.name}</h3>
                                        <div className="mt-3 flex gap-4 text-xs text-slate-400">
                                            <span>时长: {Math.round(map.playtime / 60)} 小时</span>
                                            <span>积分: {map.points}</span>
                                            <span>击杀: {map.kills}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </MainLayout>
    );
}
