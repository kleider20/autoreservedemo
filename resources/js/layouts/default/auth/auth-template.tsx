import AuthLayout from '@/layouts/default/auth/auth-layout';

interface AuthTemplateProps {
    breadcrumbs?: { label: string; href?: string }[];
    children: React.ReactNode;
}

export default function AuthTemplate({ children }: AuthTemplateProps) {
    return <AuthLayout>{children}</AuthLayout>;
}