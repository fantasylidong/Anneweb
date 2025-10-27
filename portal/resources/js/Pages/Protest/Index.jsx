import { Head, useForm, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function ProtestIndex() {
    const { props } = usePage();
    const { data, setData, post, processing, errors } = useForm({
        ban_id: '',
        player_name: '',
        player_email: '',
        reason: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/protest');
    };

    return (
        <MainLayout>
            <Head title="封禁申诉" />
            <div className="bg-slate-950">
                <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16 md:px-10">
                    <header>
                        <h1 className="text-4xl font-semibold text-white">封禁申诉</h1>
                        <p className="mt-3 text-sm leading-relaxed text-slate-400">
                            如果你认为自己被误封，请提交申诉，我们的管理员会尽快复核。请务必填写准确的封禁编号或 SteamID。
                        </p>
                    </header>

                    {props.flash?.success ? (
                        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">
                            {props.flash.success}
                        </div>
                    ) : null}

                    <form onSubmit={submit} className="grid gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="flex flex-col gap-2 text-sm text-slate-200">
                                封禁编号 (BID)
                                <input
                                    type="number"
                                    value={data.ban_id}
                                    onChange={(event) => setData('ban_id', event.target.value)}
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                    placeholder="可在封禁列表中查看"
                                />
                                {errors.ban_id ? <span className="text-xs text-rose-400">{errors.ban_id}</span> : null}
                            </label>
                            <label className="flex flex-col gap-2 text-sm text-slate-200">
                                玩家昵称
                                <input
                                    type="text"
                                    value={data.player_name}
                                    onChange={(event) => setData('player_name', event.target.value)}
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                />
                                {errors.player_name ? <span className="text-xs text-rose-400">{errors.player_name}</span> : null}
                            </label>
                        </div>
                        <label className="flex flex-col gap-2 text-sm text-slate-200">
                            联系邮箱（可选）
                            <input
                                type="email"
                                value={data.player_email}
                                onChange={(event) => setData('player_email', event.target.value)}
                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                            />
                            {errors.player_email ? <span className="text-xs text-rose-400">{errors.player_email}</span> : null}
                        </label>
                        <label className="flex flex-col gap-2 text-sm text-slate-200">
                            申诉理由
                            <textarea
                                rows={5}
                                value={data.reason}
                                onChange={(event) => setData('reason', event.target.value)}
                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                placeholder="请说明被封原因、希望管理员了解的情况及佐证。"
                            />
                            {errors.reason ? <span className="text-xs text-rose-400">{errors.reason}</span> : null}
                        </label>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {processing ? '提交中…' : '提交申诉'}
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
