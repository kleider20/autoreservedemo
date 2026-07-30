import { Suspense } from 'react';
import { usePage } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth/auth-layout';
import { resolveActiveTemplate } from '@/lib/template-resolver';

export default function AuthTemplate({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    const page = usePage<{
        activeTemplates: Record<string, { id: number; name: string; slug: string }>;
    }>();

    const activeTemplates = page.props.activeTemplates;
    const activeSlug = activeTemplates?.auth?.slug;
    const ActiveTemplate = resolveActiveTemplate(activeSlug);

    if (ActiveTemplate) {
        return (
            <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-muted-foreground">Cargando template...</div>}>
                <ActiveTemplate>{children}</ActiveTemplate>
            </Suspense>
        );
    }

    return (
        <AuthLayout title={title} description={description}>
            {children}
        </AuthLayout>
    );
}
