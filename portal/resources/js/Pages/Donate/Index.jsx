import { Head, useForm, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

const paymentMethods = [
    { label: '微信收款码', value: 'wechat' },
    { label: '支付宝', value: 'alipay' },
];

export default function DonatePage() {
    const { props } = usePage();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        contact: '',
        amount: '',
        payment_method: 'wechat',
        note: '',
        external_reference: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/donate');
    };

    return (
        <MainLayout>
            <Head title="支持服务器" />
            <div className="bg-slate-950">
                <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-16 md:px-10">
                    <header className="space-y-4">
                        <h1 className="text-4xl font-semibold text-white">支持我们的服务器</h1>
                        <p className="text-sm leading-relaxed text-slate-400">
                            你的捐赠会用于服务器维护、插件开发与社区活动。付款后请及时备注，以便后台自动为你的管理员身份续期。
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
                                称呼（可选）
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(event) => setData('name', event.target.value)}
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                />
                                {errors.name ? <span className="text-xs text-rose-400">{errors.name}</span> : null}
                            </label>
                            <label className="flex flex-col gap-2 text-sm text-slate-200">
                                联系方式（可选）
                                <input
                                    type="text"
                                    value={data.contact}
                                    onChange={(event) => setData('contact', event.target.value)}
                                    className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                    placeholder="邮箱 / QQ / Discord"
                                />
                                {errors.contact ? <span className="text-xs text-rose-400">{errors.contact}</span> : null}
                            </label>
                        </div>

                        <label className="flex flex-col gap-2 text-sm text-slate-200">
                            捐赠金额（元）
                            <input
                                type="number"
                                min="1"
                                step="1"
                                value={data.amount}
                                onChange={(event) => setData('amount', event.target.value)}
                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                placeholder="例如 10"
                            />
                            {errors.amount ? <span className="text-xs text-rose-400">{errors.amount}</span> : null}
                        </label>

                        <label className="flex flex-col gap-2 text-sm text-slate-200">
                            支付方式
                            <select
                                value={data.payment_method}
                                onChange={(event) => setData('payment_method', event.target.value)}
                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                            >
                                {paymentMethods.map((method) => (
                                    <option key={method.value} value={method.value}>
                                        {method.label}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label className="flex flex-col gap-2 text-sm text-slate-200">
                            备注 / 留言（可选）
                            <textarea
                                rows={4}
                                value={data.note}
                                onChange={(event) => setData('note', event.target.value)}
                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                placeholder="可注明支付截图、想要续期的管理员 ID 等信息"
                            />
                            {errors.note ? <span className="text-xs text-rose-400">{errors.note}</span> : null}
                        </label>

                        <label className="flex flex-col gap-2 text-sm text-slate-200">
                            额外备注（可选）
                            <input
                                type="text"
                                value={data.external_reference}
                                onChange={(event) => setData('external_reference', event.target.value)}
                                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                                placeholder="可以填付款流水号等信息"
                            />
                            {errors.external_reference ? <span className="text-xs text-rose-400">{errors.external_reference}</span> : null}
                        </label>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {processing ? '提交中…' : '提交捐赠信息'}
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
