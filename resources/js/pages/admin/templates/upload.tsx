import { Head, router } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import TemplateUploader from '@/components/template-uploader';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Upload() {
    const [isProcessing, setIsProcessing] = useState(false);

    function handleUpload(file: File) {
        setIsProcessing(true);

        const formData = new FormData();
        formData.append('template', file);

        router.post('/admin/templates', formData, {
            onFinish: () => setIsProcessing(false),
        });
    }

    return (
        <>
            <Head title="Subir Template" />

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.visit('/admin/templates')}>
                        <ArrowLeft className="size-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Subir Template</h1>
                        <p className="text-sm text-muted-foreground">
                            Instala un nuevo layout desde un archivo ZIP
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-border p-6">
                    <TemplateUploader onUpload={handleUpload} isProcessing={isProcessing} />
                </div>

                <div className="rounded-xl border border-border p-6">
                    <h2 className="mb-3 font-semibold">Estructura esperada del ZIP</h2>
                    <p className="mb-3 text-sm text-muted-foreground">
                        El ZIP debe contener una carpeta raíz con el nombre del template. Dentro de ella:
                    </p>
                    <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs text-muted-foreground">
{`aurora.zip
└── aurora/                      # Carpeta raíz (nombre = slug del template)
    ├── aurora.json              # Manifiesto (obligatorio)
    ├── aurora-template.tsx      # Entry point (obligatorio)
    ├── aurora-layout.tsx        # Layout principal
    ├── aurora-header.tsx        # Componentes adicionales
    ├── aurora-footer.tsx
    └── thumbnails/
        └── preview.png          # Screenshot (opcional)`}
                    </pre>
                    <h3 className="mt-4 mb-2 text-sm font-medium">aurora.json</h3>
                    <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs text-muted-foreground">
{`{
    "name": "Aurora",
    "slug": "aurora",
    "type": "full",
    "version": "1.0.0",
    "author": "Tu Nombre",
    "description": "Descripción del template",
    "components": {
        "layout": "aurora-layout.tsx",
        "header": "aurora-header.tsx",
        "footer": "aurora-footer.tsx"
    }
}`}
                    </pre>
                    <h3 className="mt-4 mb-2 text-sm font-medium">aurora-template.tsx</h3>
                    <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs text-muted-foreground">
{`import AuroraLayout from '@/layouts/aurora/aurora-layout';

export default function AuroraTemplate({ children }) {
    return <AuroraLayout>{children}</AuroraLayout>;
}`}
                    </pre>
                </div>
            </div>
        </>
    );
}