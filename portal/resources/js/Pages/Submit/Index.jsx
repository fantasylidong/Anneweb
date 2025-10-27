import { Head, useForm, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function SubmitIndex() {
    const { props } = usePage();
    const mods = props.mods ?? [];
    const { data, setData, post, processing, errors } = useForm({
        suspect_name: '',
        suspect_steam_id: '',
        server: '',
        mod_id: null,
        description: '',
        evidence: '',
        reporter_name: '',
        reporter_email: '',
        reporter_steam_id: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/submit');
    };

    return (
        <MainLayout>
            <Head title="举报玩家" />
            <div className="bg-slate-950">
                <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16 md:px-10">
                    <header>
                        <h1 className="text-4xl font-semibold text-white">提交封禁请求</h1>
                        <p className="mt-3 text-sm leading-relaxed text-slate-400">
                            请尽可能提供完整的信息，以便管理员快速核实并处理举报。所有数据会同步至 SourceBans 数据库。
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
                                被举报玩家昵称
                                <input
                                    type="text"
                                    value={data.suspect_name}
                                    onChange={(event) => setData('suspect_name', event.target.value)}
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                    placeholder="玩家昵称"
                                />
                                {errors.suspect_name ? <span className="text-xs text-rose-400">{errors.suspect_name}</span> : null}
                            </label>
                            <label className="flex flex-col gap-2 text-sm text-slate-200">
                                被举报玩家 SteamID
                                <input
                                    type="text"
                                    value={data.suspect_steam_id}
                                    onChange={(event) => setData('suspect_steam_id', event.target.value)}
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                    placeholder="STEAM_0:1:XXXX"
                                />
                                {errors.suspect_steam_id ? <span className="text-xs text-rose-400">{errors.suspect_steam_id}</span> : null}
                            </label>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="flex flex-col gap-2 text-sm text-slate-200">
                                发生服务器 / 房间
                                <input
                                    type="text"
                                    value={data.server}
                                    onChange={(event) => setData('server', event.target.value)}
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                    placeholder="示例：Anne 对抗 #1"
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-sm text-slate-200">
                                游戏 Mod
                                <select
                                    value={data.mod_id}
                                    onChange={(event) => setData('mod_id', event.target.value === '' ? null : event.target.value)}
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                >
                                    <option value="">未指定</option>
                                    {mods.map((mod) => (
                                        <option key={mod.id} value={mod.id}>
                                            {mod.name}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <label className="flex flex-col gap-2 text-sm text-slate-200">
                            详细描述
                            <textarea
                                rows={5}
                                value={data.description}
                                onChange={(event) => setData('description', event.target.value)}
                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                placeholder="描述事件经过，例如时间、违规行为细节。"
                            />
                            {errors.description ? <span className="text-xs text-rose-400">{errors.description}</span> : null}
                        </label>
                        <label className="flex flex-col gap-2 text-sm text-slate-200">
                            证据链接（可选）
                            <input
                                type="text"
                                value={data.evidence}
                                onChange={(event) => setData('evidence', event.target.value)}
                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                placeholder="例如 Demo 下载链接 / 视频地址"
                            />
                            {errors.evidence ? <span className="text-xs text-rose-400">{errors.evidence}</span> : null}
                        </label>
                        <div className="grid gap-4 md:grid-cols-2">
                            <label className="flex flex-col gap-2 text-sm text-slate-200">
                                举报人昵称（可选）
                                <input
                                    type="text"
                                    value={data.reporter_name}
                                    onChange={(event) => setData('reporter_name', event.target.value)}
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-sm text-slate-200">
                                联系邮箱（可选）
                                <input
                                    type="email"
                                    value={data.reporter_email}
                                    onChange={(event) => setData('reporter_email', event.target.value)}
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                    placeholder="example@email.com"
                                />
                                {errors.reporter_email ? <span className="text-xs text-rose-400">{errors.reporter_email}</span> : null}
                            </label>
                        </div>
                        <label className="flex flex-col gap-2 text-sm text-slate-200">
                            举报人 SteamID（可选）
                            <input
                                type="text"
                                value={data.reporter_steam_id}
                                onChange={(event) => setData('reporter_steam_id', event.target.value)}
                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                            />
                        </label>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {processing ? '提交中…' : '提交举报'}
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
