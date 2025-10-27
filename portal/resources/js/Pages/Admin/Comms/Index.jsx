import { Head, router, useForm, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../components/Pagination';

dayjs.locale('zh-cn');

const typeOptions = [
    { label: '全部类型', value: '' },
    { label: '禁言 (Mute)', value: 'mute' },
    { label: '禁麦 (Gag)', value: 'gag' },
];

const statusOptions = [
    { label: '全部状态', value: '' },
    { label: '生效中', value: 'active' },
    { label: '已结束', value: 'expired' },
];

export default function AdminCommsIndex() {
    const { props } = usePage();
    const comms = props.comms ?? [];
    const filters = props.filters ?? {};
    const links = props.links ?? [];
    const meta = props.meta ?? {};

    const { data, setData } = useForm({
        search: filters.search ?? '',
        type: filters.type ?? '',
        status: filters.status ?? '',
    });

    const submit = (event) => {
        event.preventDefault();
        router.get(
            '/admin/comms',
            {
                search: data.search,
                type: data.type,
                status: data.status,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleLift = (bid) => {
        router.post(`/admin/comms/${bid}/lift`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title="禁言 / 禁麦管理">
            <Head title="禁言/禁麦管理" />

            <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
                <form
                    onSubmit={submit}
                    className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_0.8fr_auto] md:items-end"
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
                        类型
                        <select
                            value={data.type}
                            onChange={(event) => setData('type', event.target.value)}
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        >
                            {typeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
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
                        <h2 className="text-lg font-semibold text-white">禁言 / 禁麦记录</h2>
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
                            新增禁言/禁麦（开发中）
                        </button>
                    </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
                    <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
                        <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">玩家信息</th>
                                <th className="px-4 py-3">类型</th>
                                <th className="px-4 py-3">理由</th>
                                <th className="px-4 py-3">开始</th>
                                <th className="px-4 py-3">结束</th>
                                <th className="px-4 py-3">时长</th>
                                <th className="px-4 py-3">管理员</th>
                                <th className="px-4 py-3 text-center">状态</th>
                                <th className="px-4 py-3 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {comms.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="px-4 py-6 text-center text-slate-500">
                                        暂无禁言/禁麦记录。
                                    </td>
                                </tr>
                            ) : (
                                comms.map((comm) => {
                                    const createdText = comm.created_at
                                        ? dayjs(comm.created_at).format('YYYY-MM-DD HH:mm')
                                        : '未知';
                                    const endsText = comm.ends_at
                                        ? dayjs(comm.ends_at).format('YYYY-MM-DD HH:mm')
                                        : '永久';

                                    return (
                                        <tr key={comm.bid} className="hover:bg-slate-900/40">
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-white">{comm.player_name}</span>
                                                    <span className="font-mono text-xs text-slate-500">
                                                        {comm.steam_id || comm.ip || '—'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-slate-400">{comm.type_text}</td>
                                            <td className="px-4 py-3 max-w-[240px] break-words text-slate-300">
                                                {comm.reason}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-slate-400">{createdText}</td>
                                            <td className="px-4 py-3 text-xs text-slate-400">{endsText}</td>
                                            <td className="px-4 py-3 text-xs text-slate-400">
                                                {comm.is_permanent ? '永久' : `${comm.length} 分钟`}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-slate-400">
                                                {comm.admin ? comm.admin.username : '控制台'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {comm.status === 'active' ? (
                                                    <span className="inline-flex items-center rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-200">
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
                                                        onClick={() => router.visit(`/admin/comms/${comm.bid}`)}
                                                    >
                                                        查看详情
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="rounded-lg border border-emerald-500/40 px-3 py-1 text-emerald-200 transition hover:border-emerald-300/60 hover:text-emerald-100"
                                                        disabled={comm.status !== 'active'}
                                                        onClick={() => handleLift(comm.bid)}
                                                    >
                                                        解除限制
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
