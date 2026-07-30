import { lazy } from 'react';

const templateFiles = import.meta.glob<{ default: React.ComponentType<any> }>(
    '../layouts/**/*-template.tsx',
);

const templateMap: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {};
for (const [path, loader] of Object.entries(templateFiles)) {
    const match = path.match(/\/layouts\/(?:default\/)?([^/]+)\/\1-template\.tsx$/);
    if (match) {
        templateMap[match[1]] = lazy(loader);
    }
}

export function getPageTypeFromUrl(url: string): string {
    if (url === '/' || url === '' || url.startsWith('/#')) return 'landing';
    if (url.startsWith('/auth/')) return 'auth';
    if (url.startsWith('/admin/') || url.startsWith('/dashboard')) return 'dashboard';

    return 'landing';
}

export function resolveActiveTemplate(
    activeSlug: string | null | undefined,
): React.LazyExoticComponent<React.ComponentType<any>> | null {
    if (!activeSlug) return null;
    return templateMap[activeSlug] ?? null;
}

export { templateMap };