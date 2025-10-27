import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../components/Pagination';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const statusOptions = [
    { label: '全部状态', value: '' },
    { label: '待确认', value: 'pending' },
    { label: '已确认', value: 'verified' },
    { label: '已拒绝', value: 'rejected' },
];

export default function AdminDonationsIndex() {
    const { props } = usePage();
    const donations = props.donations ?? [];
    const filters = props.filters ?? {};
    const links = props.links ?? [];
    const meta = props.meta ?? {};

    const handleFilter = (value) => {
        router.get('/admin/donations', { status: value }, { preserveState: true, replace: true });
    };

    const handleUpdate = (id, status) => {
        const payload = { status };

        if (status === 'verified') {
            const aid = window.prompt('输入需要续期的管理员 AID（可选）');
            if (aid) {
                payload.extend_aid = aid;
                const days = window.prompt('续期天数（默认 30 天，可选）', '30');
                if (days) {
                    payload.extend_days = days;
                }
            }
        }

        router.post(`/admin/donations/${id}`, payload, { preserveScroll: true, preserveState: true });
    };

    return (
        <AdminLayout title="捐赠记录">
            <Head title="捐赠记录" />

            <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-white">捐赠列表</h2>
                        <p className="text-xs text-slate-500">
                            共 {meta.total ?? 0} 条记录，当前第 {meta.current_page ?? 1} / {meta.last_page ?? 1} 页
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">状态筛选</span>
                        <select
                            defaultValue={filters.status ?? ''}
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
                                <th className="px-4 py-3">时间</th>
                                <th className="px-4 py-3">捐赠人</th>
                                <th className="px-4 py-3">联系方式</th>
                                <th className="px-4 py-3">金额</th>
                                <th className="px-4 py-3">方式</th>
                                <th className="px-4 py-3">备注</th>
                                <th className="px-4 py-3 text-center">状态</th>
                                <th className="px-4 py-3 text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {donations.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-4 py-6 text-center text-slate-500">
                                        暂无捐赠记录。
                                    </td>
                                </tr>
                            ) : (
                                donations.map((donation) => {
                                    const createdText = donation.created_at
                                        ? dayjs(donation.created_at).format('YYYY-MM-DD HH:mm')
                                        : '未知';

                                    const statusBadge = (
                                        <span
                                            className={
                                                'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ' +
                                                (donation.status === 'verified'
                                                    ? 'bg-emerald-500/20 text-emerald-200'
                                                    : donation.status === 'pending'
                                                    ? 'bg-cyan-500/20 text-cyan-200'
                                                    : 'bg-rose-500/20 text-rose-200')
                                            }
                                        >
                                            {donation.status === 'verified'
                                                ? '已确认'
                                                : donation.status === 'pending'
                                                ? '待确认'
                                                : '已拒绝'}
                                        </span>
                                    );

                                    return (
                                        <tr key={donation.id} className="hover:bg-slate-900/40">
                                            <td className="px-4 py-3 text-xs text-slate-400">{createdText}</td>
                                            <td className="px-4 py-3">{donation.name || '匿名'}</td>
                                            <td className="px-4 py-3 text-xs text-slate-400">{donation.contact || '—'}</td>
                                            <td className="px-4 py-3 text-sm text-white">¥ {(donation.amount / 100).toFixed(2)}</td>
                                            <td className="px-4 py-3 text-xs text-slate-400">{donation.payment_method}</td>
                                            <td className="px-4 py-3 max-w-[240px] break-words text-slate-300">{donation.note || '—'}</td>
                                            <td className="px-4 py-3 text-center">{statusBadge}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2 text-xs">
                                                    <button
                                                        type="button"
                                                        className="rounded-lg border border-emerald-500/40 px-3 py-1 text-emerald-200 transition hover:border-emerald-300/60 hover:text-emerald-100"
                                                        disabled={donation.status === 'verified'}
                                                        onClick={() => handleUpdate(donation.id, 'verified')}
                                                    >
                                                        标记已确认
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="rounded-lg border border-rose-500/40 px-3 py-1 text-rose-200 transition hover:border-rose-300/60 hover:text-rose-100"
                                                        disabled={donation.status === 'rejected'}
                                                        onClick={() => handleUpdate(donation.id, 'rejected')}
                                                    >
                                                        拒绝
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
