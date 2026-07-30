import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Car,
    CalendarRange,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Vehículos', href: '/admin/vehiculos', icon: Car },
    { label: 'Reservas', href: '/admin/reservas', icon: CalendarRange },
    { label: 'Clientes', href: '/admin/clientes', icon: Users },
    { label: 'Configuración', href: '/settings/profile', icon: Settings },
];

export default function DashboardSidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const { url } = usePage();

    return (
        <aside
            className={cn(
                'flex flex-col border-r border-border bg-sidebar transition-all duration-300',
                collapsed ? 'w-16' : 'w-64',
            )}
        >
            <div className="flex h-16 items-center justify-between border-b border-border px-4">
                {!collapsed && (
                    <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
                        AutoReserve
                    </Link>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="rounded-md p-1.5 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                    {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
                </button>
            </div>

            <nav className="flex-1 space-y-1 p-3">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = url === item.href || url.startsWith(item.href + '/');

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                            )}
                        >
                            <Icon className="size-5 shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-border p-3">
                {!collapsed && (
                    <p className="px-3 text-xs text-sidebar-foreground/40">AutoReserve v1.0</p>
                )}
            </div>
        </aside>
    );
}