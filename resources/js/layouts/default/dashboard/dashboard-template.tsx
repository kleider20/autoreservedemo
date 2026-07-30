import DashboardLayout from '@/layouts/default/dashboard/dashboard-layout';

interface DashboardTemplateProps {
    breadcrumbs?: { label: string; href?: string }[];
    children: React.ReactNode;
}

export default function DashboardTemplate({ breadcrumbs, children }: DashboardTemplateProps) {
    return <DashboardLayout breadcrumbs={breadcrumbs}>{children}</DashboardLayout>;
}
