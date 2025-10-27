import { Head, Link } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';

const iconMap = {
    ShieldCheck: (
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden>
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3c3.25 0 6.75-1.5 8.25-2.25a1 1 0 0 1 1.45.89C21.5 14 15.75 21 12 21S2.5 14 2.3 1.64a1 1 0 0 1 1.46-.9C5.25 2 8.75 3 12 3Z" />
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m9.5 12 1.75 1.75L15 10" />
        </svg>
    ),
    Rocket: (
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden>
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7.5 13.5C12 9 14.25 4.25 12.75 2.75S7 4 2.5 8.5C2.18 8.84 2 9.3 2 9.78v3.44c0 .74.6 1.35 1.35 1.35H6M16.5 13.5C12 9 9.75 4.25 11.25 2.75s5.75 1.25 10.25 5.75c.32.34.5.8.5 1.28v3.44c0 .74-.6 1.35-1.35 1.35H18M9 15l2.5 2.5M15 15l-2.5 2.5M5 21a2 2 0 0 0 2.12-1.88c.02-.38-.3-.7-.68-.66A2 2 0 0 0 5 20a2 2 0 0 0-.45.05c-.37.09-.6.47-.45.83A2 2 0 0 0 5 21Zm14 0a2 2 0 0 0 2.12-1.88c.02-.38-.3-.7-.68-.66A2 2 0 0 0 19 20a2 2 0 0 0-.45.05c-.37.09-.6.47-.45.83A2 2 0 0 0 19 21Z" />
        </svg>
    ),
    Coins: (
        <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden>
            <ellipse cx="12" cy="7" rx="9" ry="4" stroke="currentColor" strokeWidth="1.5" />
            <path stroke="currentColor" strokeWidth="1.5" d="M3 7v5c0 2.21 4.03 4 9 4s9-1.79 9-4V7" />
            <path stroke="currentColor" strokeWidth="1.5" d="M3 12v5c0 2.21 4.03 4 9 4s9-1.79 9-4v-5" />
        </svg>
    ),
};

export default function Home({ hero, metrics, featureSections }) {
    return (
        <MainLayout>
            <Head title="首页" />
            <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
                <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 md:px-10">
                    <section className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
                        <div className="space-y-6">
                            <p className="inline-flex rounded-full bg-slate-800/60 px-3 py-1 text-sm text-cyan-300/90 ring-1 ring-inset ring-cyan-400/40">
                                左4社区一体化后台
                            </p>
                            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
                                {hero.title}
                            </h1>
                            <p className="text-base leading-relaxed text-slate-300 md:text-lg">
                                {hero.subtitle}
                            </p>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                {hero.actions.map((action) => (
                                    <Link
                                        key={action.label}
                                        href={action.href}
                                        className={
                                            action.variant === 'primary'
                                                ? 'inline-flex items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 font-medium text-slate-950 shadow-[0_20px_45px_-20px_rgba(34,211,238,0.8)] transition hover:bg-cyan-300'
                                                : 'inline-flex items-center justify-center rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-800/40'
                                        }
                                    >
                                        {action.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div className="relative isolate flex flex-col gap-4 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40 p-6 shadow-[0_40px_80px_-60px_rgba(59,130,246,0.75)] backdrop-blur">
                            <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-cyan-500/15 via-transparent to-purple-500/15" />
                            <h2 className="text-sm uppercase tracking-[0.35em] text-slate-400">实时监控</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {metrics.map((metric) => (
                                    <div
                                        key={metric.label}
                                        className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4"
                                    >
                                        <p className="text-xs uppercase tracking-wide text-slate-400">
                                            {metric.label}
                                        </p>
                                        <div className="mt-2 flex items-end gap-2">
                                            <span className="text-3xl font-semibold text-white">
                                                {metric.value}
                                            </span>
                                            <span className="text-xs font-medium text-emerald-400">
                                                {metric.trend}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-2 text-sm text-slate-400">
                                数据源自 SourceBans 与插件实时推送，可直接在面板内处理封禁、续期与公告。
                            </p>
                        </div>
                    </section>

                    <section className="grid gap-6 md:grid-cols-3">
                        {featureSections.map((section) => (
                            <article
                                key={section.title}
                                className="group rounded-3xl border border-slate-800 bg-slate-900/30 p-6 transition hover:border-cyan-400/40 hover:bg-slate-900/60"
                            >
                                <div className="mb-4 inline-flex rounded-2xl border border-cyan-400/25 bg-cyan-400/10 p-3 text-cyan-300 group-hover:border-cyan-300/40 group-hover:text-cyan-200">
                                    {iconMap[section.icon] ?? null}
                                </div>
                                <h3 className="text-lg font-semibold text-white">
                                    {section.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                                    {section.description}
                                </p>
                            </article>
                        ))}
                    </section>
                </div>
            </div>
        </MainLayout>
    );
}
