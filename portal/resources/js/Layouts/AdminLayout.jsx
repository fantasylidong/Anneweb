import { Link, usePage } from '@inertiajs/react';
import MainLayout from './MainLayout';

const navigation = [
    {
        label: '仪表盘',
        href: '/admin',
        key: 'admin.dashboard',
    },
    {
        label: '管理员管理',
        href: '/admin/admins',
        key: 'admin.admins.index',
    },
    {
        label: '服务器管理',
        href: '/admin/servers',
        key: 'admin.servers.index',
    },
    {
        label: '封禁管理',
        href: '/admin/bans',
        key: 'admin.bans.index',
    },
    {
        label: '禁言管理',
        href: '/admin/comms',
        key: 'admin.comms.index',
    },
    {
        label: '玩家举报',
        href: '/admin/submissions',
        key: 'admin.submissions.index',
    },
    {
        label: '封禁申诉',
        href: '/admin/protests',
        key: 'admin.protests.index',
    },
    {
        label: '捐赠记录',
        href: '/admin/donations',
        key: 'admin.donations.index',
    },
    // 预留：服务器管理、封禁管理等
];

export default function AdminLayout({ title, children }) {
    const { url } = usePage();

    return (
        <MainLayout>
            <div className="bg-slate-950">
                <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 md:flex-row md:gap-8 md:px-10">
                    <div className="flex gap-3 md:hidden">
                        {navigation.map((item) => {
                            const isActive = url.startsWith(item.href);
                            return (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    className={
                                        'flex-1 rounded-xl px-3 py-2 text-center text-sm font-medium transition ' +
                                        (isActive
                                            ? 'bg-cyan-400/20 text-cyan-200 ring-1 ring-inset ring-cyan-400/40'
                                            : 'border border-slate-800 text-slate-300 hover:border-cyan-400/40 hover:text-cyan-200')
                                    }
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>

                    <aside className="sticky top-24 hidden min-w-[220px] flex-col gap-2 md:flex">
                        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            后台导航
                        </p>
                        {navigation.map((item) => {
                            const isActive = url.startsWith(item.href);
                            return (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    className={
                                        'rounded-xl px-3 py-2 text-sm font-medium transition ' +
                                        (isActive
                                            ? 'bg-cyan-400/20 text-cyan-200 ring-1 ring-inset ring-cyan-400/40'
                                            : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200')
                                    }
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </aside>
                    <main className="flex-1">
                        {title ? (
                            <header className="mb-8 flex flex-col gap-2">
                                <h1 className="text-3xl font-semibold text-white">{title}</h1>
                                <p className="text-sm text-slate-400">
                                    Anne Control Center · SourceBans 综合后台
                                </p>
                            </header>
                        ) : null}
                        <div className="space-y-6">{children}</div>
                    </main>
                </div>
            </div>
        </MainLayout>
    );
}
