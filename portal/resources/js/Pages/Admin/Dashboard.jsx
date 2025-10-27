import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function Dashboard() {
    return (
        <MainLayout>
            <Head title="控制台" />
            <div className="bg-slate-950">
                <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
                    <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-10 text-slate-200">
                        <h1 className="text-3xl font-semibold text-white">控制台首页</h1>
                        <p className="mt-4 text-sm leading-relaxed text-slate-400">
                            这里将展示管理员快速入口、最近封禁、待处理申诉等信息。后续会逐步迁移 SourceBans 的全部后台功能。
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
