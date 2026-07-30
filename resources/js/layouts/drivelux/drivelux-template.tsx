import DriveluxLayout from '@/layouts/default/drivelux/drivelux-layout';

interface DriveluxTemplateProps {
    children: React.ReactNode;
}

export default function DriveluxTemplate({ children }: DriveluxTemplateProps) {
    return <DriveluxLayout>{children}</DriveluxLayout>;
}