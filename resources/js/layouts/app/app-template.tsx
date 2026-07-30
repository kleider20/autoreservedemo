import { Suspense } from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app/app-layout';
import BlankLayout from '@/layouts/default/blank-layout';
import { getPageTypeFromUrl, resolveActiveTemplate } from '@/lib/template-resolver';
import type { BreadcrumbItem } from '@/types';

export default function AppTemplate({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const page = usePage<{
        activeTemplates: Record<string, { id: number; name: string; slug: string }>;
    }>();

    const activeTemplates = page.props.activeTemplates;
    const url = page.url;

    const pageType = getPageTypeFromUrl(url || '/');
    const activeSlug = activeTemplates?.[pageType]?.slug;
    const ActiveTemplate = resolveActiveTemplate(activeSlug);

    if (ActiveTemplate) {
        return (
            <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-muted-foreground">Cargando template...</div>}>
                <ActiveTemplate breadcrumbs={breadcrumbs}>{children}</ActiveTemplate>
            </Suspense>
        );
    }

    if (pageType === 'landing') {
        return <BlankLayout>{children}</BlankLayout>;
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            {children}
        </AppLayout>
    );
}
