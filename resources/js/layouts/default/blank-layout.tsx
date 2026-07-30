import type { ReactNode } from 'react';

interface BlankLayoutProps {
    children: ReactNode;
}

export default function BlankLayout({ children }: BlankLayoutProps) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {children}
        </div>
    );
}
