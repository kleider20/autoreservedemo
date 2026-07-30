import FullLayout from '@/layouts/default/full/full-layout';

interface FullTemplateProps {
    breadcrumbs?: { label: string; href?: string }[];
    children: React.ReactNode;
}

export default function FullTemplate({ children }: FullTemplateProps) {
    return <FullLayout>{children}</FullLayout>;
}