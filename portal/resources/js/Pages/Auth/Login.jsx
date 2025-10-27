import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('login.store'));
    };

    return (
        <div className="min-h-screen bg-slate-950">
            <Head title="管理员登录" />
            <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12 md:px-10">
                <div className="grid w-full gap-8 rounded-3xl border border-slate-800 bg-slate-900/60 p-10 shadow-[0_40px_80px_-60px_rgba(56,189,248,0.6)] backdrop-blur md:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-6">
                        <p className="inline-flex rounded-full bg-cyan-400/15 px-3 py-1 text-sm font-medium text-cyan-200">
                            Anne Control Center
                        </p>
                        <h1 className="text-3xl font-semibold text-white md:text-4xl">
                            管理员登录
                        </h1>
                        <p className="text-sm leading-relaxed text-slate-400">
                            使用 SourceBans 的管理员账号登录。我们已沿用原系统的 SHA1 + Salt 算法，支持旧密码，无需重置。
                        </p>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>· 登录后即可管理封禁、通讯、服务器、权限等模块</li>
                            <li>· 支持 SourceBans 和 L4D 插件的同步数据</li>
                            <li>· 如需新增管理员，请联系超级管理员处理</li>
                        </ul>
                    </div>
                    <form onSubmit={submit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-200" htmlFor="username">
                                管理员账号
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={data.username}
                                onChange={(event) => setData('username', event.target.value)}
                                autoFocus
                                autoComplete="username"
                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                placeholder="请输入 SourceBans 账号"
                            />
                            {errors.username && (
                                <p className="text-xs text-rose-400">{errors.username}</p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-200" htmlFor="password">
                                登录密码
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(event) => setData('password', event.target.value)}
                                autoComplete="current-password"
                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                placeholder="输入密码"
                            />
                            {errors.password && (
                                <p className="text-xs text-rose-400">{errors.password}</p>
                            )}
                        </div>
                        {errors.username && !errors.password && (
                            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">
                                {errors.username}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {processing ? '登录中…' : '登录'}
                        </button>
                        <div className="flex justify-between text-xs text-slate-500">
                            <Link href="/" className="hover:text-slate-200">
                                返回首页
                            </Link>
                            <span>忘记密码请联系超级管理员</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
