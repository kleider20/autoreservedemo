import { type FormEvent, useRef, useState } from 'react';
import { Upload, File, X } from 'lucide-react';

interface TemplateUploaderProps {
    onUpload: (file: File) => void;
    isProcessing?: boolean;
}

export default function TemplateUploader({ onUpload, isProcessing }: TemplateUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    function handleFile(file: File) {
        if (!file.name.endsWith('.zip')) {
            return;
        }
        setSelectedFile(file);
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (selectedFile) {
            onUpload(selectedFile);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
                    dragOver
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept=".zip"
                    className="hidden"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                    }}
                />

                {selectedFile ? (
                    <div className="flex items-center gap-3">
                        <File className="size-8 text-primary" />
                        <div className="text-left">
                            <p className="text-sm font-medium">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFile(null);
                            }}
                            className="rounded-full p-1 hover:bg-muted"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                ) : (
                    <>
                        <Upload className="mb-4 size-10 text-muted-foreground/60" />
                        <p className="text-sm font-medium">
                            Arrastra tu archivo ZIP aquí o haz clic para seleccionar
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Solo archivos .zip — Máximo 10MB
                        </p>
                    </>
                )}
            </div>

            {selectedFile && (
                <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                    {isProcessing ? 'Instalando...' : 'Instalar Template'}
                </button>
            )}
        </form>
    );
}