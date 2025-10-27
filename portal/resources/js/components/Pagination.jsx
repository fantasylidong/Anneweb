import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) {
        return null;
    }

    return (
        <nav className="flex items-center justify-end gap-2 text-sm" aria-label="分页导航">
            {links.map((link, index) => {
                if (!link.url) {
                    return (
                        <span
                            key={`pagination-${index}`}
                            className="inline-flex min-w-[34px] items-center justify-center rounded-lg border border-transparent px-2 py-1 text-slate-600"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                const isActive = link.active;

                return (
                    <Link
                        key={`pagination-${index}`}
                        href={link.url}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        className={
                            'inline-flex min-w-[34px] items-center justify-center rounded-lg px-3 py-1 transition ' +
                            (isActive
                                ? 'bg-cyan-400/20 text-cyan-200 ring-1 ring-inset ring-cyan-400/30'
                                : 'border border-slate-700 text-slate-300 hover:border-cyan-400/60 hover:text-cyan-200')
                        }
                    />
                );
            })}
        </nav>
    );
}
