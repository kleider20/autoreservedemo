import DashboardSidebar from '@/layouts/default/dashboard/dashboard-sidebar';
import DashboardHeader from '@/layouts/default/dashboard/dashboard-header';
import DashboardFooter from '@/layouts/default/dashboard/dashboard-footer';

interface DashboardLayoutProps {
    breadcrumbs?: { label: string; href?: string }[];
    children: React.ReactNode;
}

export default function DashboardLayout({ breadcrumbs, children }: DashboardLayoutProps) {
    return (
        <div className="flex min-h-screen">
            <DashboardSidebar />
            <div className="flex flex-1 flex-col">
                <DashboardHeader breadcrumbs={breadcrumbs} />
                <main className="flex-1 p-6">{children}</main>
                <DashboardFooter />
            </div>
        </div>
    );
}