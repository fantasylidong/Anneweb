import { Head, usePage, router } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

export default function CommShow() {
    const { props } = usePage();
    const comm = props.comm;

    if (!comm) {
        return null;
    }

    const createdText = comm.created_at ? dayjs(comm.created_at).format('YYYY-MM-DD HH:mm') : '未知';
    const endsText = comm.ends_at ? dayjs(comm.ends_at).format('YYYY-MM-DD HH:mm') : '永久';
    const removedText = comm.removed_on ? dayjs(comm.removed_on).format('YYYY-MM-DD HH:mm') : '—';

    const handleLift = () => {
        router.post(`/admin/comms/${comm.bid}/lift`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title={`禁言/禁麦详情 #${comm.bid}`}>
            <Head title={`禁言/禁麦详情 #${comm.bid}`} />
            <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="grid gap-4 md:grid-cols-2">
                    <DetailItem label="玩家" value={`${comm.player_name} (${comm.steam_id || '未知'})`} />
                    <DetailItem label="IP" value={comm.ip || '—'} />
                    <DetailItem label="类型" value={comm.type_text} />
                    <DetailItem label="开始时间" value={createdText} />
                    <DetailItem label="结束时间" value={endsText} />
                    <DetailItem label="状态" value={comm.status === 'active' ? '生效中' : '已结束'} />
                    <DetailItem label="执行管理员" value={comm.admin?.username || '控制台'} />
                    <DetailItem label="解除方式" value={comm.remove_type || '—'} />
                    <DetailItem label="解除时间" value={removedText} />
                    <DetailItem label="解除人" value={comm.removed_by || '—'} />
                </div>

                <div className="mt-6">
                    <h3 className="text-sm font-semibold text-white">限制原因</h3>
                    <p className="mt-2 whitespace-pre-wrap rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-200">
                        {comm.reason || '无'}
                    </p>
                </div>

                {comm.status === 'active' ? (
                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={handleLift}
                            className="rounded-xl border border-emerald-500/40 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:border-emerald-300/60 hover:text-emerald-100"
                        >
                            解除禁言/禁麦
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
