import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../components/Pagination';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const statusOptions = [
    { label: '全部状态', value: '' },
    { label: '待处理', value: '0' },
    { label: '已归档', value: '1' },
];

export default function AdminProtestsIndex() {
    const { props } = usePage();
    const protests = props.protests ?? [];
    const filters = props.filters ?? {};
    const links = props.links ?? [];
    const meta = props.meta ?? {};

    const handleFilter = (value) => {
        router.get('/admin/protests', { archived: value }, { preserveState: true, replace: true });
    };

    const handleUpdate = (id, status) => {
        router.post(`/admin/protests/${id}`, { status }, { preserveScroll: true, preserveState: true });
    };

    return (
        <AdminLayout title="封禁申诉">
            <Head title="封禁申诉" />

            <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-white">申诉列表</h2>
                        <p className="text-xs text-slate-500">
                            共 {meta.total ?? 0} 条记录，当前第 {meta.current_page ?? 1}/{meta.last_page ?? 1} 页
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">状态筛选</span>
                        <select
                            defaultValue={filters.archived ?? ''}
                            onChange={(event) => handleFilter(event.target.value)}
                            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
                    <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
                        <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">申诉时间</th>
                                <th className="px-4 py-3">封禁编号</th>
                                <th className="px-4 py-3">申诉理由</th>
                                <th className="px-4 py-3">邮箱</th>
                                <th className="px-4 py-3 text-center">状态
                                </th>
                                <th className="px-4 py-3 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {protests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-4 py-6 text-center text-slate-500">
                                        暂无申诉记录。
                                    </td>
                                </tr>
                            ) : (
                                protests.map((protest) => {
                                    const submittedText = protest.submitted_at
                                        ? dayjs(protest.submitted_at).format('YYYY-MM-DD HH:mm')
                                        : '未知';

                                    return (
                                        <tr key={protest.id} className="hover:bg-slate-900/40">
                                            <td className="px-4 py-3 text-xs text-slate-400">{submittedText}</td>
                                            <td className="px-4 py-3 font-mono text-xs text-slate-400">BID #{protest.ban_id}</td>
                                            <td className="px-4 py-3 max-w-[320px] break-words text-slate-300">{protest.reason}</td>
                                            <td className="px-4 py-3 text-xs text-slate-400">{protest.email || '—'}</td>
                                            <td className="px-4 py-3 text-center">
                                                {protest.archived ? (
                                                    <span className="inline-flex items-center rounded-full bg-slate-800/70 px-3 py-1 text-xs font-semibold text-slate-300">
                                                        已归档
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-200">
                                                        待处理
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2 text-xs">
                                                    <button
                                                        type="button"
                                                        className="rounded-lg border border-cyan-500/40 px-3 py-1 text-cyan-200 transition hover:border-cyan-300/60 hover:text-cyan-100"
                                                        disabled={protest.archived === false}
                                                        onClick={() => handleUpdate(protest.id, 'pending')}
                                                    >
                                                        设为待处理
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="rounded-lg border border-emerald-500/40 px-3 py-1 text-emerald-200 transition hover:border-emerald-300/60 hover:text-emerald-100"
                                                        disabled={protest.archived === true}
                                                        onClick={() => handleUpdate(protest.id, 'archived')}
                                                    >
                                                        标记已处理
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
