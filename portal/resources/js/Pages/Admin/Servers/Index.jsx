import { Head, router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../components/Pagination';

const statusOptions = [
    { label: '全部状态', value: '' },
    { label: '已启用', value: 'enabled' },
    { label: '已禁用', value: 'disabled' },
];

export default function ServerIndex() {
    const { props } = usePage();
    const servers = props.servers ?? [];
    const filters = props.filters ?? {};
    const links = props.links ?? [];
    const meta = props.meta ?? {};

    const { data, setData } = useForm({
        search: filters.search ?? '',
        status: filters.status ?? '',
    });

    const submit = (event) => {
        event.preventDefault();
        router.get(
            '/admin/servers',
            {
                search: data.search,
                status: data.status,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <AdminLayout title="服务器管理">
            <Head title="服务器管理" />

            <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
                <form onSubmit={submit} className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_auto] md:items-end">
                    <label className="flex flex-col gap-2 text-sm text-slate-200">
                        搜索服务器
                        <input
                            type="text"
                            value={data.search}
                            onChange={(event) => setData('search', event.target.value)}
                            placeholder="IP 或端口"
                            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        />
                    </label>
                    <label className="flex flex-col gap-2 text-sm text-slate-200">
                        状态筛选
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
                        <h2 className="text-lg font-semibold text-white">服务器列表</h2>
                        <p className="text-xs text-slate-500">
                            共 {meta.total ?? 0} 台服务器，当前第 {meta.current_page ?? 1}/{meta.last_page ?? 1} 页
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
                            新增服务器（开发中）
                        </button>
                    </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
                    <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
                        <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">地址</th>
                                <th className="px-4 py-3">Mod</th>
                                <th className="px-4 py-3">服务器组</th>
                                <th className="px-4 py-3 text-center">状态</th>
                                <th className="px-4 py-3 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {servers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-6 text-center text-slate-500">
                                        暂无服务器数据。
                                    </td>
                                </tr>
                            ) : (
                                servers.map((server) => (
                                    <tr key={server.sid} className="hover:bg-slate-900/40">
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-white">{server.address}</span>
                                                <span className="text-xs text-slate-500">ID #{server.sid}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-col">
                                                <span>{server.mod || '未知 Mod'}</span>
                                                {server.mod_folder ? (
                                                    <span className="text-xs text-slate-500">{server.mod_folder}</span>
                                                ) : null}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            {server.server_groups.length === 0 ? (
                                                <span className="text-slate-500">未绑定</span>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {server.server_groups.map((group) => (
                                                        <span
                                                            key={`${server.sid}-${group}`}
                                                            className="inline-flex items-center rounded-full bg-slate-800/60 px-3 py-1 text-xs text-slate-200"
                                                        >
                                                            {group}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {server.enabled ? (
                                                <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                                                    已启用
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-300">
                                                    已禁用
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2 text-xs">
                                                <button
                                                    type="button"
                                                    className="rounded-lg border border-slate-700 px-3 py-1 text-slate-200 transition hover:border-cyan-400/60 hover:text-cyan-200"
                                                    disabled
                                                >
                                                    RCON（开发中）
                                                </button>
                                                <button
                                                    type="button"
                                                    className="rounded-lg border border-slate-700 px-3 py-1 text-slate-200 transition hover:border-cyan-400/60 hover:text-cyan-200"
                                                    disabled
                                                >
                                                    编辑
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
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
