import { Head, Link, router, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import AdminLayout from '../../../Layouts/AdminLayout';
import { useState } from 'react';

export default function AdminShow() {
    const { props } = usePage();
    const admin = props.admin ?? {};
    const assignments = props.assignments ?? [];
    const renewals = props.renewals ?? [];

    const [showSrvPassword, setShowSrvPassword] = useState(false);

    const [extendForm, setExtendForm] = useState({
        duration_days: 30,
        note: '',
    });
    const [processing, setProcessing] = useState(false);
    const [formError, setFormError] = useState(null);
    const [formSuccess, setFormSuccess] = useState(null);

    const submitExtend = (event) => {
        event.preventDefault();
        if (!extendForm.duration_days || Number(extendForm.duration_days) <= 0) {
            setFormError('续期天数必须大于 0。');
            return;
        }
        setProcessing(true);
        setFormError(null);
        setFormSuccess(null);

        window.axios
            .post(`/api/sourcebans/admins/${admin.aid}/extend`, {
                duration_days: Number(extendForm.duration_days),
                note: extendForm.note || null,
            })
            .then(() => {
                setExtendForm({ duration_days: 30, note: '' });
                setFormSuccess('续期已提交。数据已更新。');
                router.reload({ only: ['admin', 'assignments', 'renewals'] });
            })
            .catch((error) => {
                if (error.response?.data?.message) {
                    setFormError(error.response.data.message);
                } else {
                    setFormError('续期失败，请稍后再试。');
                }
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    const expiresText = admin.expires_at ? dayjs(admin.expires_at).format('YYYY-MM-DD HH:mm') : '永久';
    const lastVisitText = admin.last_visit ? dayjs(admin.last_visit).format('YYYY-MM-DD HH:mm') : '从未登录';

    return (
        <AdminLayout title="管理员详情">
            <Head title={`管理员 ${admin.username || ''}`} />

            <div className="flex flex-col gap-6 md:flex-row">
                <section className="flex-1 rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl font-semibold text-white">{admin.username}</h2>
                        <p className="text-xs uppercase tracking-wider text-slate-500">管理员 ID #{admin.aid}</p>
                    </div>
                    <dl className="mt-6 grid grid-cols-1 gap-4 text-sm text-slate-300 md:grid-cols-2">
                        <div>
                            <dt className="text-slate-500">邮箱</dt>
                            <dd className="mt-1">{admin.email || '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-slate-500">Steam ID</dt>
                            <dd className="mt-1 font-mono text-xs text-slate-400">{admin.steam_id || '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-slate-500">所属 Web 组</dt>
                            <dd className="mt-1">{admin.group_name || '未分组'}</dd>
                        </div>
                        <div>
                            <dt className="text-slate-500">服务器组</dt>
                            <dd className="mt-1">{admin.srv_group || '未分组'}</dd>
                        </div>
                        <div>
                            <dt className="text-slate-500">免疫等级</dt>
                            <dd className="mt-1">{admin.immunity ?? 0}</dd>
                        </div>
                        <div>
                            <dt className="text-slate-500">额外权限 Flags</dt>
                            <dd className="mt-1 font-mono text-xs text-slate-400">{admin.extraflags}</dd>
                        </div>
                        <div>
                            <dt className="text-slate-500">服务器 Flags</dt>
                            <dd className="mt-1 font-mono text-xs text-slate-400">{admin.srv_flags || '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-slate-500">服务器密码</dt>
                            <dd className="mt-1 font-mono text-xs text-slate-400">
                                {admin.srv_password ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowSrvPassword((prev) => !prev)}
                                        className="underline decoration-dotted" >
                                        {showSrvPassword ? admin.srv_password : '点击显示'}
                                    </button>
                                ) : (
                                    '未设置'
                                )}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-slate-500">最后登录</dt>
                            <dd className="mt-1">{lastVisitText}</dd>
                        </div>
                        <div>
                            <dt className="text-slate-500">有效期</dt>
                            <dd className="mt-1">
                                {expiresText}{' '}
                                {admin.is_expired ? (
                                    <span className="ml-2 inline-flex items-center rounded-full bg-rose-500/20 px-2 py-0.5 text-[11px] font-semibold text-rose-200">
                                        已过期
                                    </span>
                                ) : (
                                    <span className="ml-2 inline-flex items-center rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-200">
                                        剩余 {admin.remaining_days ?? '∞'} 天
                                    </span>
                                )}
                            </dd>
                        </div>
                    </dl>
                    <div className="mt-6 text-xs text-slate-500">
                        <Link href="/admin/admins" className="hover:text-cyan-200">
                            ← 返回管理员列表
                        </Link>
                    </div>
                </section>

                <section className="w-full max-w-sm space-y-4">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                        <h3 className="text-lg font-semibold text-white">手动续期</h3>
                        <p className="mt-1 text-xs text-slate-500">
                            输入天数即可延长有效期，自动记录续期日志。
                        </p>
                        <form onSubmit={submitExtend} className="mt-4 flex flex-col gap-3">
                            <label className="flex flex-col gap-2 text-sm text-slate-200">
                                延长天数
                                <input
                                    type="number"
                                    min="1"
                                    value={extendForm.duration_days}
                                    onChange={(event) =>
                                        setExtendForm((prev) => ({
                                            ...prev,
                                            duration_days: event.target.value,
                                        }))
                                    }
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-sm text-slate-200">
                                备注（选填）
                                <textarea
                                    rows="2"
                                    value={extendForm.note}
                                    onChange={(event) =>
                                        setExtendForm((prev) => ({
                                            ...prev,
                                            note: event.target.value,
                                        }))
                                    }
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                />
                            </label>
                            {formError ? (
                                <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-200">
                                    {formError}
                                </div>
                            ) : null}
                            {formSuccess ? (
                                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-200">
                                    {formSuccess}
                                </div>
                            ) : null}
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {processing ? '续期中…' : '确认续期'}
                            </button>
                        </form>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                        <h3 className="text-lg font-semibold text-white">续期记录</h3>
                        <div className="mt-4 space-y-3 text-xs text-slate-300">
                            {renewals.length === 0 ? (
                                <p className="text-slate-500">暂无续期记录。</p>
                            ) : (
                                renewals.map((item) => (
                                    <div key={item.id} className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3">
                                        <p className="font-medium text-slate-200">
                                            {item.new_expires_at
                                                ? dayjs(item.new_expires_at).format('YYYY-MM-DD HH:mm')
                                                : '永久'}
                                        </p>
                                        <p className="text-slate-500">
                                            之前：{item.previous_expires_at ? dayjs(item.previous_expires_at).format('MM-DD HH:mm') : '永久'}
                                        </p>
                                        {item.note ? (
                                            <p className="mt-1 text-slate-400">备注：{item.note}</p>
                                        ) : null}
                                        <p className="mt-1 text-[11px] text-slate-500">
                                            更新时间：{item.created_at ? dayjs(item.created_at).fromNow() : '未知'}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>
            </div>

            <section className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="text-lg font-semibold text-white">服务器授权</h3>
                <p className="text-xs text-slate-500">列出绑定的服务器或服务器组信息，方便排查权限。</p>
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800">
                    <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
                        <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
                            <tr>
                                <th className="px-4 py-3">服务器</th>
                                <th className="px-4 py-3">服务器组</th>
                                <th className="px-4 py-3">组 Flags</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {assignments.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="px-4 py-5 text-center text-slate-500">
                                        暂未绑定服务器权限。
                                    </td>
                                </tr>
                            ) : (
                                assignments.map((item) => (
                                    <tr key={item.key} className="hover:bg-slate-900/40">
                                        <td className="px-4 py-3">{item.server || '全部服务器'}</td>
                                        <td className="px-4 py-3">{item.server_group || '—'}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-slate-400">{item.group_flags || '—'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </AdminLayout>
    );
}
