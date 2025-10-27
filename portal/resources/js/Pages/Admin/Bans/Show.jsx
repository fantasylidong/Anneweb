import { Head, usePage, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

export default function BanShow() {
    const { props } = usePage();
    const ban = props.ban;

    if (!ban) {
        return null;
    }

    const createdText = ban.created_at ? dayjs(ban.created_at).format('YYYY-MM-DD HH:mm') : '未知';
    const endsText = ban.ends_at ? dayjs(ban.ends_at).format('YYYY-MM-DD HH:mm') : '永久';
    const removedText = ban.removed_on ? dayjs(ban.removed_on).format('YYYY-MM-DD HH:mm') : '—';

    const handleUnban = () => {
        router.post(`/admin/bans/${ban.bid}/unban`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title={`封禁详情 #${ban.bid}`}>
            <Head title={`封禁详情 #${ban.bid}`} />
            <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <DetailItem label="玩家" value={`${ban.player_name} (${ban.steam_id || '未知'})`} />
                    <DetailItem label="IP" value={ban.ip || '—'} />
                    <DetailItem label="封禁开始" value={createdText} />
                    <DetailItem label="封禁结束" value={endsText} />
                    <DetailItem
                        label="封禁时长"
                        value={ban.is_permanent ? '永久封禁' : `${ban.length} 分钟`}
                    />
                    <DetailItem
                        label="封禁状态"
                        value={ban.status === 'active' ? '生效中' : '已结束'}
                    />
                    <DetailItem label="执行管理员" value={ban.admin?.username || '控制台'} />
                    <DetailItem label="解除方式" value={ban.remove_type || '—'} />
                    <DetailItem label="解除时间" value={removedText} />
                    <DetailItem label="解除人" value={ban.removed_by || '—'} />
                </div>

                <div className="mt-6">
                    <h3 className="text-sm font-semibold text-white">封禁理由</h3>
                    <p className="mt-2 whitespace-pre-wrap rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200">
                        {ban.reason || '无'}
                    </p>
                </div>

                {ban.status === 'active' ? (
                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={handleUnban}
                            className="rounded-xl border border-emerald-500/40 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:border-emerald-300/60 hover:text-emerald-100"
                        >
                            立即解除封禁
                        </button>
                    </div>
                ) : null}
            </section>
        </AdminLayout>
    );
}

function DetailItem({ label, value }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs text-slate-500">{label}</span>
            <span className="text-sm text-slate-200">{value}</span>
        </div>
    );
}
