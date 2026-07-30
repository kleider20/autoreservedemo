import LandingTopmenu from '@/layouts/default/landing/landing-topmenu';
import LandingHeader from '@/layouts/default/landing/landing-header';
import LandingFooter from '@/layouts/default/landing/landing-footer';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <LandingTopmenu />
            <LandingHeader />
            <main className="flex-1">{children}</main>
            <LandingFooter />
        </div>
    );
}