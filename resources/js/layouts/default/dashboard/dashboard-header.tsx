import { Link, usePage } from '@inertiajs/react';
import { Bell, LogOut, User } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';

interface DashboardHeaderProps {
    breadcrumbs?: { label: string; href?: string }[];
}

export default function DashboardHeader({ breadcrumbs }: DashboardHeaderProps) {
    const { auth } = usePage().props;
    const getInitials = useInitials();

    return (
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
            <div className="flex items-center gap-2">
                {breadcrumbs?.map((crumb, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                        {i > 0 && <span className="text-muted-foreground">/</span>}
                        {crumb.href ? (
                            <Link
                                href={crumb.href}
                                className="text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {crumb.label}
                            </Link>
                        ) : (
                            <span className="font-medium">{crumb.label}</span>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-3">
                <button className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                    <Bell className="size-5" />
                </button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 rounded-md p-1.5 hover:bg-accent">
                            <Avatar className="size-8">
                                <AvatarFallback className="text-xs">
                                    {getInitials(auth.user?.name ?? 'U')}
                                </AvatarFallback>
                            </Avatar>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col">
                                <span>{auth.user?.name}</span>
                                <span className="text-xs font-normal text-muted-foreground">
                                    {auth.user?.email}
                                </span>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/settings/profile" className="flex items-center gap-2">
                                <User className="size-4" />
                                Perfil
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/logout" method="post" className="flex items-center gap-2">
                                <LogOut className="size-4" />
                                Cerrar sesión
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}