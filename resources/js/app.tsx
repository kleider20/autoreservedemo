import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppTemplate from '@/layouts/app/app-template';
import AuthTemplate from '@/layouts/auth/auth-template';
import SettingsLayout from '@/layouts/settings/settings-layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name.startsWith('landing/'):
                return AppTemplate;
            case name.startsWith('auth/'):
                return AuthTemplate;
            case name.startsWith('settings/'):
                return [AppTemplate, SettingsLayout];
            default:
                return AppTemplate;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();