import { Link, usePage } from '@inertiajs/react';

const navigation = [
    { label: '首页', href: '/', key: 'home' },
    { label: '封禁列表', href: '/bans', key: 'bans.index' },
    { label: '禁言禁麦', href: '/comms', key: 'comms.index' },
    { label: '服务器', href: '/servers', key: 'servers.index' },
    { label: 'L4D2 统计', href: '/stats/l4d2', key: 'stats.l4d2' },
    { label: '聊天记录', href: '/chat', key: 'chat.index' },
    { label: '提交举报', href: '/submit', key: 'submit.create' },
    { label: '封禁申诉', href: '/protest', key: 'protest.create' },
    { label: '捐赠', href: '/donate', key: 'donate' },
];

export default function MainLayout({ children }) {
    const { url, props } = usePage();
    const user = props?.auth?.user ?? null;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
                    <Link href="/" className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-500 text-base font-semibold text-slate-950">
                            AW
                        </span>
                        <div className="flex flex-col leading-tight">
                            <span className="text-sm font-semibold text-white">Anne Control</span>
                            <span className="text-xs text-slate-400">L4D2 社区后台</span>
                        </div>
                    </Link>
                    <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
                        {navigation.map((item) => {
                            const isActive = url === item.href;
                            return (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    className={
                                        isActive
                                            ? 'text-cyan-300'
                                            : 'transition hover:text-white'
                                    }
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="hidden items-center gap-3 md:flex">
                        {user ? (
                            <>
                                <Link
                                    href="/admin"
                                    className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium transition hover:border-cyan-400 hover:text-cyan-200"
                                >
                                    控制台
                                </Link>
                                <Link
                                    as="button"
                                    href="/logout"
                                    method="post"
                                    className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                                >
                                    退出 ({user.name ?? '管理员'})
                                </Link>
                            </>
                        ) : (
                            <Link
                                href="/login"
                                className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                            >
                                登录
                            </Link>
                        )}
                    </div>
                </div>
            </header>
            <main>{children}</main>
            <footer className="border-t border-slate-800/80 bg-slate-950/80">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-xs leading-relaxed text-slate-500 md:flex-row md:items-center md:justify-between md:px-10">
                    <span>© {new Date().getFullYear()} Anne Server Community. 保留所有权利。</span>
                    <div className="flex gap-4">
                        <Link href="/docs" className="transition hover:text-slate-200">
                            文档
                        </Link>
                        <Link href="/status" className="transition hover:text-slate-200">
                            状态页
                        </Link>
                        <Link href="/privacy" className="transition hover:text-slate-200">
                            隐私政策
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
