import { Head, Link } from '@inertiajs/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import MainLayout from '../Layouts/MainLayout';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

const statusBadgeStyles = {
    online: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
    offline: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    maintenance: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
};

function ServerCard({ server }) {
    const badgeClass = statusBadgeStyles[server.status] ?? statusBadgeStyles.offline;

    return (
        <article className="relative rounded-3xl border border-slate-800 bg-slate-900/40 p-6 shadow-[0_40px_80px_-60px_rgba(45,212,191,0.35)] transition hover:border-cyan-400/40 hover:bg-slate-900/70">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h3 className="text-xl font-semibold text-white">{server.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">
                        {server.region} · {server.ip}
                    </p>
                </div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badgeClass}`}>
                    {server.status === 'online' && '运行中'}
                    {server.status === 'offline' && '离线'}
                    {server.status === 'maintenance' && '维护中'}
                </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">在线玩家</p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                        {server.players.current}
                        <span className="text-sm text-slate-500"> / {server.players.max}</span>
                    </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">延迟</p>
                    <p className="mt-2 text-2xl font-semibold text-white">
                        {server.latency ? `${server.latency} ms` : '—'}
                    </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                    <p className="text-xs uppercase tracking-wide text-slate-400">下张地图</p>
                    <p className="mt-2 text-xl font-semibold text-white">
                        {server.nextMap}
                    </p>
                </div>
            </div>

            {server.maintenanceNote ? (
                <div className="mt-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
                    {server.maintenanceNote}
                </div>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <Link
                    href={`/servers/${server.id}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400/60 hover:text-cyan-200"
                >
                    查看详情
                </Link>
                <div className="text-xs text-slate-500">
                    最后心跳{' '}
                    <span className="font-medium text-slate-300">
                        {server.lastHeartbeat ? dayjs(server.lastHeartbeat).fromNow() : '未知'}
                    </span>
                </div>
            </div>
        </article>
    );
}

export default function Servers({ servers, filters, lastUpdated }) {
    return (
        <MainLayout>
            <Head title="服务器" />
            <div className="bg-slate-950">
                <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 md:px-10">
                    <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-4xl font-semibold text-white">服务器监控</h1>
                            <p className="mt-2 text-sm text-slate-400">
                                实时同步 SourceBans、游戏心跳与插件数据，快速定位异常。
                            </p>
                        </div>
                        <p className="text-xs text-slate-500">
                            刷新时间：{dayjs(lastUpdated).format('YYYY-MM-DD HH:mm:ss')}
                        </p>
                    </header>

                    <div className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
                        <div className="grid gap-4 sm:grid-cols-3">
                            <label className="flex flex-col gap-2 text-sm text-slate-300">
                                区域
                                <input
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                    defaultValue={filters.region ?? ''}
                                    placeholder="全部"
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-sm text-slate-300">
                                状态
                                <select
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                    defaultValue={filters.status ?? ''}
                                >
                                    <option value="">全部</option>
                                    <option value="online">运行中</option>
                                    <option value="maintenance">维护中</option>
                                    <option value="offline">离线</option>
                                </select>
                            </label>
                            <label className="flex flex-col gap-2 text-sm text-slate-300">
                                关键字
                                <input
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                    defaultValue={filters.keyword ?? ''}
                                    placeholder="服务器名称 / IP"
                                />
                            </label>
                        </div>
                        <div className="flex justify-end">
                            <button className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-300">
                                快速筛选
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {servers.map((server) => (
                            <ServerCard key={server.id} server={server} />
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
