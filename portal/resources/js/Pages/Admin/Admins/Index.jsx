import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import AdminLayout from '../../../Layouts/AdminLayout';
import Pagination from '../../../components/Pagination';

dayjs.extend(relativeTime);

dayjs.locale('zh-cn');

export default function AdminIndex() {
    const { props } = usePage();
    const admins = props.admins ?? [];
    const filters = props.filters ?? {};
    const links = props.links ?? [];
    const meta = props.meta ?? {};

    const { data, setData } = useForm({
        search: filters.search ?? '',
    });

    const submit = (event) => {
        event.preventDefault();
        router.get(
            '/admin/admins',
            {
                search: data.search,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <AdminLayout title="管理员管理">
            <Head title="管理员管理" />

            <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
                <form onSubmit={submit} className="flex flex-col gap-4 md:flex-row md:items-end">
                    <div className="flex-1">
                        <label htmlFor="search" className="text-sm font-medium text-slate-300">
                            搜索管理员
                        </label>
                        <input
                            id="search"
                            type="text"
                            value={data.search}
                            onChange={(event) => setData('search', event.target.value)}
                            placeholder="用户名 / 邮箱 / SteamID"
                            className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                        />
                    </div>
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                    >
                        搜索
                    </button>
                </form>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-white">管理员列表</h2>
                        <p className="text-xs text-slate-500">
                            共 {meta.total ?? 0} 名管理员，当前第 {meta.current_page ?? 1}/{meta.last_page ?? 1} 页
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400/60 hover:text-cyan-200"
                            disabled
                        >
                            批量操作
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
                            disabled
                        >
                            新增管理员（开发中）
                        </button>
                    </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
                    <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
                        <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">用户名</th>
                                <th className="px-4 py-3">邮箱</th>
                                <th className="px-4 py-3">SteamID</th>
                                <th className="px-4 py-3">所属组</th>
                                <th className="px-4 py-3">最后登录</th>
                                <th className="px-4 py-3">有效期</th>
                                <th className="px-4 py-3 text-center">状态</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {admins.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-4 py-6 text-center text-slate-500">
                                        暂无管理员数据。
                                    </td>
                                </tr>
                            ) : (
                                admins.map((admin) => {
                                    const lastVisitText = admin.last_visit
                                        ? dayjs(admin.last_visit).format('YYYY-MM-DD HH:mm')
                                        : '从未登录';

                                    const expiresText = admin.expires_at
                                        ? dayjs(admin.expires_at).format('YYYY-MM-DD HH:mm')
                                        : '永久';

                                    return (
                                        <tr key={admin.aid} className="hover:bg-slate-900/40">
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col">
                                                    <Link
                                                        href={`/admin/admins/${admin.aid}`}
                                                        className="font-medium text-white transition hover:text-cyan-200"
                                                    >
                                                        {admin.username}
                                                    </Link>
                                                    <span className="text-xs text-slate-500">#{admin.aid}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">{admin.email}</td>
                                            <td className="px-4 py-3 font-mono text-xs text-slate-400">{admin.steam_id || '—'}</td>
                                            <td className="px-4 py-3">{admin.group_name || '未分组'}</td>
                                            <td className="px-4 py-3 text-xs text-slate-400">{lastVisitText}</td>
                                            <td className="px-4 py-3 text-xs text-slate-400">{expiresText}</td>
                                            <td className="px-4 py-3 text-center">
                                                {admin.status === 'active' ? (
                                                    <span className="inline-flex items-center rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
                                                        正常
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-300">
                                                        已过期
                                                    </span>
                                                )}
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
