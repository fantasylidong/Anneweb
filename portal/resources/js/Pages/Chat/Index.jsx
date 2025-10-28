import { Head, router, useForm, usePage } from '@inertiajs/react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import MainLayout from '../../Layouts/MainLayout';
import Pagination from '../../components/Pagination';

dayjs.locale('zh-cn');

const perPageOptions = [
    { label: '每页 25 条', value: 25 },
    { label: '每页 50 条', value: 50 },
    { label: '每页 100 条', value: 100 },
    { label: '每页 200 条', value: 200 },
];

const toCommunityId = (steamId) => {
    if (!steamId) {
        return null;
    }

    if (steamId.startsWith('7656')) {
        return steamId;
    }

    if (steamId.startsWith('STEAM_')) {
        const parts = steamId.split(':');
        if (parts.length === 3) {
            const universe = BigInt(parts[2]);
            const auth = BigInt(parts[1]);
            return (universe * 2n + auth + 76561197960265728n).toString();
        }
    }

    if (/^\d+$/.test(steamId) && steamId.length < 16) {
        return (BigInt(steamId) + 76561197960265728n).toString();
    }

    return steamId;
};

export default function ChatIndex() {
    const { props } = usePage();
    const messages = props.messages ?? [];
    const filters = props.filters ?? {};
    const links = props.links ?? [];
    const meta = props.meta ?? {};
    const servers = props.servers ?? [];

    const { data, setData } = useForm({
        search: filters.search ?? '',
        server: filters.server ?? '',
        steamid: filters.steamid ?? '',
        date_from: filters.date_from ?? '',
        date_to: filters.date_to ?? '',
        per_page: filters.per_page ?? 50,
    });

    const submit = (event) => {
        event.preventDefault();
        router.get('/chat', data, {
            preserveState: true,
            replace: true,
        });
    };

    const resetFilters = () => {
        setData({
            search: '',
            server: '',
            steamid: '',
            date_from: '',
            date_to: '',
            per_page: 50,
        });
        router.get(
            '/chat',
            {},
            {
                preserveState: false,
                replace: true,
            }
        );
    };

    return (
        <MainLayout>
            <Head title="聊天记录" />
            <div className="bg-slate-950">
                <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:px-10">
                    <header className="flex flex-col gap-4">
                        <h1 className="text-4xl font-semibold text-white">聊天记录</h1>
                        <p className="text-sm leading-relaxed text-slate-400">
                            记录 Anne 服务器中玩家的聊天内容，支持按关键字、服务器、SteamID 以及时间范围查询。内容均来自游戏内日志，方便快速追溯历史对话。
                        </p>
                    </header>

                    <section className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6">
                        <form
                            onSubmit={submit}
                            className="grid gap-4 md:grid-cols-[1.1fr_0.9fr_0.8fr_0.8fr_0.8fr_auto] md:items-end"
                        >
                            <label className="flex flex-col gap-2 text-sm text-slate-200">
                                关键字
                                <input
                                    type="text"
                                    value={data.search}
                                    onChange={(event) => setData('search', event.target.value)}
                                    placeholder="玩家名 / 内容 / 服务器"
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-sm text-slate-200">
                                SteamID
                                <input
                                    type="text"
                                    value={data.steamid}
                                    onChange={(event) => setData('steamid', event.target.value)}
                                    placeholder="STEAM_1:1:XXXX / 7656..."
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-sm text-slate-200">
                                服务器
                                <select
                                    value={data.server}
                                    onChange={(event) => setData('server', event.target.value)}
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                >
                                    <option value="">全部服务器</option>
                                    {servers.map((server) => (
                                        <option key={server} value={server}>
                                            {server}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="flex flex-col gap-2 text-sm text-slate-200">
                                开始日期
                                <input
                                    type="date"
                                    value={data.date_from ?? ''}
                                    onChange={(event) => setData('date_from', event.target.value)}
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-sm text-slate-200">
                                结束日期
                                <input
                                    type="date"
                                    value={data.date_to ?? ''}
                                    onChange={(event) => setData('date_to', event.target.value)}
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                />
                            </label>
                            <label className="flex flex-col gap-2 text-sm text-slate-200">
                                每页条数
                                <select
                                    value={data.per_page}
                                    onChange={(event) => setData('per_page', Number(event.target.value))}
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                >
                                    {perPageOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <div className="flex items-center gap-2">
                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                                >
                                    筛选
                                </button>
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-200"
                                >
                                    重置
                                </button>
                            </div>
                        </form>
                    </section>

                    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-white">聊天记录</h2>
                                <p className="text-xs text-slate-500">
                                    共 {meta.total ?? 0} 条，当前 {meta.current_page ?? 1}/{meta.last_page ?? 1} 页
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-800">
                            <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
                                <thead className="bg-slate-900/60 text-xs uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">玩家</th>
                                        <th className="px-4 py-3">SteamID</th>
                                        <th className="px-4 py-3">发言时间</th>
                                        <th className="px-4 py-3">消息内容</th>
                                        <th className="px-4 py-3">所在服务器</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {messages.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-6 text-center text-slate-500">
                                                暂无聊天记录。
                                            </td>
                                        </tr>
                                    ) : (
                                        messages.map((message) => {
                                            const steamProfile = toCommunityId(message.steamid);
                                            const formattedDate = message.date
                                                ? dayjs(message.date).format('YYYY-MM-DD HH:mm:ss')
                                                : '未知时间';

                                            return (
                                                <tr key={message.id} className="hover:bg-slate-900/40">
                                                    <td className="px-4 py-3">
                                                        <span className="font-medium text-white">
                                                            {message.name || '匿名玩家'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {message.steamid ? (
                                                            <a
                                                                href={`https://steamcommunity.com/profiles/${steamProfile}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="font-mono text-xs text-cyan-300 transition hover:text-cyan-200"
                                                            >
                                                                {message.steamid}
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs text-slate-500">未知</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-slate-400">{formattedDate}</td>
                                                    <td className="px-4 py-3 text-sm text-slate-200">
                                                        {message.message || '（空）'}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-slate-400">{message.server || '未知'}</td>
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
                </div>
            </div>
        </MainLayout>
    );
}
