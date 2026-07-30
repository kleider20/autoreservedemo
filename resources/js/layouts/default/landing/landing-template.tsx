import LandingLayout from '@/layouts/default/landing/landing-layout';

interface LandingTemplateProps {
    breadcrumbs?: { label: string; href?: string }[];
    children: React.ReactNode;
}

export default function LandingTemplate({ children }: LandingTemplateProps) {
    return <LandingLayout>{children}</LandingLayout>;
}