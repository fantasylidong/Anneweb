import './bootstrap';
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { InertiaAppProgress } from './components/InertiaAppProgress';

const appName = import.meta.env.VITE_APP_NAME ?? 'Anne Control Center';

createInertiaApp({
    title: (title) => (title ? `${title} • ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx')
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <>
                <InertiaAppProgress />
                <App {...props} />
            </>
        );
    },
    progress: {
        color: '#38bdf8',
    },
});
