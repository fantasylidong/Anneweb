import { Head, router, useForm, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../components/Pagination';

dayjs.locale('zh-cn');

const statusOptions = [
    { label: '全部状态', value: '' },
    { label: '生效中', value: 'active' },
    { label: '已结束', value: 'expired' },
];

const lengthOptions = [
    { label: '全部时长', value: '' },
    { label: '永久封禁', value: 'permanent' },
    { label: '临时封禁', value: 'temporary' },
];

export default function AdminBanIndex() {
    const { props } = usePage();
    const bans = props.bans ?? [];
    const filters = props.filters ?? {};
    const links = props.links ?? [];
    const meta = props.meta ?? {};
    const mods = props.mods ?? [];

    const { data, setData } = useForm({
        search: filters.search ?? '',
        status: filters.status ?? '',
        length: filters.length ?? '',
        mod: filters.mod ?? '',
    });

    const submit = (event) => {
        event.preventDefault();
        router.get(
            '/admin/bans',
            {
                search: data.search,
                status: data.status,
                length: data.length,
                mod: data.mod,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleUnban = (bid) => {
        router.post(`/admin/bans/${bid}/unban`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title="封禁管理">
            <Head title="封禁管理" />

            <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
                <form
                    onSubmit={submit}
                    className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto] md:items-end"
                >
                    <label className="flex flex-col gap-2 text-sm text-slate-200">
                        搜索玩家
                        <input
                            type="text"
                            value={data.search}
                            onChange={(event) => setData('search', event.target.value)}
                            placeholder="玩家名 / SteamID / IP"
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        />
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-slate-200">
                        状态
                        <select
                            value={data.status}
                            onChange={(event) => setData('status', event.target.value)}
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-slate-200">
                        时长类型
                        <select
                            value={data.length}
                            onChange={(event) => setData('length', event.target.value)}
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        >
                            {lengthOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-slate-200">
                        Mod 过滤
                        <select
                            value={data.mod}
                            onChange={(event) => setData('mod', event.target.value)}
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        >
                            <option value="">全部 Mod</option>
                            {mods.map((mod) => (
                                <option key={mod.id} value={mod.id}>
                                    {mod.name}
                                </option>
                            ))}
                        </select>
                    </label>
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                    >
                        筛选
                    </button>
                </form>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-white">封禁记录</h2>
                        <p className="text-xs text-slate-500">
                            共 {meta.total ?? 0} 条记录，当前第 {meta.current_page ?? 1}/{meta.last_page ?? 1} 页
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400/60 hover:text-cyan-200"
                            disabled
                        >
                            批量操作（开发中）
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
                            disabled
                        >
                            新增封禁（开发中）
                        </button>
                    </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
                    <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
                        <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">玩家信息</th>
                                <th className="px-4 py-3">封禁理由</th>
                                <th className="px-4 py-3">开始</th>
                                <th className="px-4 py-3">结束</th>
                                <th className="px-4 py-3">时长</th>
                                <th className="px-4 py-3">管理员</th>
                                <th className="px-4 py-3 text-center">状态</th>
                                <th className="px-4 py-3 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {bans.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-6 text-center text-slate-500">
                                        暂无封禁记录。
                                    </td>
                                </tr>
                            ) : (
                                bans.map((ban) => {
                                    const createdText = ban.created_at
                                        ? dayjs(ban.created_at).format('YYYY-MM-DD HH:mm')
                                        : '未知';
                                    const endsText = ban.ends_at
                                        ? dayjs(ban.ends_at).format('YYYY-MM-DD HH:mm')
                                        : '永久';

                                    return (
                                        <tr key={ban.bid} className="hover:bg-slate-900/40">
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-white">{ban.player_name}</span>
                                                    <span className="font-mono text-xs text-slate-500">
                                                        {ban.steam_id || ban.ip || '—'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 max-w-[260px] break-words text-slate-300">
                                                {ban.reason}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-slate-400">{createdText}</td>
                                            <td className="px-4 py-3 text-xs text-slate-400">{endsText}</td>
                                            <td className="px-4 py-3 text-xs text-slate-400">
                                                {ban.is_permanent ? '永久封禁' : `${ban.length} 分钟`}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-slate-400">
                                                {ban.admin ? ban.admin.username : '控制台'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {ban.status === 'active' ? (
                                                    <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                                                        生效中
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-300">
                                                        已结束
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2 text-xs">
                                                    <button
                                                        type="button"
                                                        className="rounded-lg border border-slate-700 px-3 py-1 text-slate-200 transition hover:border-cyan-400/60 hover:text-cyan-200"
                                                        onClick={() => router.visit(`/admin/bans/${ban.bid}`)}
                                                    >
                                                        查看详情
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="rounded-lg border border-emerald-500/40 px-3 py-1 text-emerald-200 transition hover:border-emerald-300/60 hover:text-emerald-100"
                                                        disabled={ban.status !== 'active'}
                                                        onClick={() => handleUnban(ban.bid)}
                                                    >
                                                        解除封禁
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6">
                    <Pagination links={links} />
                </div>
            </section>
        </AdminLayout>
    );
}
