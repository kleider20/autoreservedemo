import { useState } from 'react';
import { faqs } from '@/layouts/default/drivelux/data/drivelux-data';

export default function DriveluxFaq() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <section id="faq" className="py-24">
            <div className="mx-auto max-w-3xl px-6">
                <div className="mb-12 text-center">
                    <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#fbbf24' }}>FAQ</span>
                    <h2 className="font-serif mt-3 text-4xl font-bold md:text-5xl text-heading">
                        Preguntas frecuentes
                    </h2>
                </div>
                <div className="space-y-3">
                    {faqs.map((f, i) => (
                        <div key={i} className={`faq-item card overflow-hidden rounded-xl ${openFaq === i ? 'open' : ''}`}>
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="flex w-full items-center justify-between p-6 text-left"
                            >
                                <span className="font-semibold text-heading">{f.q}</span>
                                <span className="faq-icon text-2xl" style={{ color: '#fbbf24' }}>+</span>
                            </button>
                            <div className="faq-content px-6">
                                <p className="pb-6 text-muted">{f.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}