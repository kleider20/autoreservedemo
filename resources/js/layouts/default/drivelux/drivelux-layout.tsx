import { useEffect, useState } from 'react';
import DriveluxNavbar from '@/layouts/default/drivelux/components/drivelux-navbar';
import DriveluxHero from '@/layouts/default/drivelux/components/drivelux-hero';
import DriveluxStats from '@/layouts/default/drivelux/components/drivelux-stats';
import DriveluxFleet from '@/layouts/default/drivelux/components/drivelux-fleet';
import DriveluxProcess from '@/layouts/default/drivelux/components/drivelux-process';
import DriveluxBooking from '@/layouts/default/drivelux/components/drivelux-booking';
import DriveluxFeatures from '@/layouts/default/drivelux/components/drivelux-features';
import DriveluxTestimonials from '@/layouts/default/drivelux/components/drivelux-testimonials';
import DriveluxFaq from '@/layouts/default/drivelux/components/drivelux-faq';
import DriveluxCta from '@/layouts/default/drivelux/components/drivelux-cta';
import DriveluxFooter from '@/layouts/default/drivelux/components/drivelux-footer';

export default function DriveluxLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="app-wrapper overflow-x-hidden">
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.0/index.min.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/playfair-display@5.0.0/index.min.css" />
            <style>{`
                html { scroll-behavior: smooth; }
                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                    background: #050814;
                    color: #f1f5f9;
                    transition: background 0.4s ease, color 0.4s ease;
                    min-height: 100vh;
                }
                html:not(.dark) body {
                    background: #f8fafc;
                    color: #0f172a;
                }
                .app-wrapper { background: #050814; transition: background 0.4s ease; }
                html:not(.dark) .app-wrapper { background: #f8fafc; }
                .text-heading { color: #f1f5f9; transition: color 0.4s ease; }
                html:not(.dark) .text-heading { color: #0f172a; }
                .font-serif { font-family: 'Playfair Display', Georgia, serif; }

                .gradient-text {
                    background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #fbbf24 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                html:not(.dark) .gradient-text {
                    background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #d97706 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .glass-nav {
                    background: rgba(5, 8, 20, 0.8);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(59, 130, 246, 0.15);
                }
                html:not(.dark) .glass-nav {
                    background: rgba(255, 255, 255, 0.85);
                    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
                }

                .card {
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid rgba(59, 130, 246, 0.2);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                html:not(.dark) .card {
                    background: rgba(255, 255, 255, 0.95);
                    border: 1px solid rgba(15, 23, 42, 0.08);
                    box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
                }
                .card-hover:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 30px 60px rgba(59, 130, 246, 0.25);
                }
                html:not(.dark) .card-hover:hover {
                    box-shadow: 0 30px 60px rgba(15, 23, 42, 0.12);
                }

                .grid-bg {
                    background-image: linear-gradient(rgba(59, 130, 246, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.07) 1px, transparent 1px);
                    background-size: 60px 60px;
                }
                html:not(.dark) .grid-bg {
                    background-image: linear-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.08) 1px, transparent 1px);
                }

                .blob { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.4; pointer-events: none; }
                html:not(.dark) .blob { opacity: 0.2; }

                .pulse-btn { animation: pulseGlow 2.5s ease-in-out infinite; }
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
                    50% { box-shadow: 0 0 0 18px rgba(59, 130, 246, 0); }
                }

                .divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent);
                }
                html:not(.dark) .divider {
                    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent);
                }

                .calendar-day { transition: all 0.2s ease; cursor: pointer; }
                .calendar-day:hover:not(.disabled):not(.booked) { background: rgba(59, 130, 246, 0.2); }
                .calendar-day.selected { background: #3b82f6 !important; color: white !important; }
                html:not(.dark) .calendar-day.selected { background: #2563eb !important; }
                .calendar-day.in-range { background: rgba(59, 130, 246, 0.15); }
                .calendar-day.booked { background: rgba(239, 68, 68, 0.2); color: #fca5a5; text-decoration: line-through; cursor: not-allowed; }
                html:not(.dark) .calendar-day.booked { color: #dc2626; }
                .calendar-day.disabled { color: #475569; cursor: not-allowed; }
                html:not(.dark) .calendar-day.disabled { color: #cbd5e1; }
                .calendar-day.today { border: 1px solid #fbbf24; }

                .step-active { background: #3b82f6; color: white; }
                html:not(.dark) .step-active { background: #2563eb; }
                .step-done { background: #10b981; color: white; }
                .step-inactive { background: #1e293b; border: 1px solid #475569; }
                html:not(.dark) .step-inactive { background: #e2e8f0; border: 1px solid #cbd5e1; color: #475569; }

                .signature-pad { touch-action: none; cursor: crosshair; }
                .vehicle-card.selected { border-color: #3b82f6 !important; box-shadow: 0 0 0 2px #3b82f6; }

                input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); }
                html:not(.dark) input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0); }

                @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .slide-in { animation: slideIn 0.4s ease-out; }

                .faq-content { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
                .faq-item.open .faq-content { max-height: 300px; }
                .faq-item.open .faq-icon { transform: rotate(45deg); }
                .faq-icon { transition: transform 0.3s ease; }

                .theme-toggle {
                    position: relative; width: 56px; height: 30px;
                    background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(59, 130, 246, 0.25);
                    border-radius: 999px; cursor: pointer; transition: all 0.3s ease;
                    display: flex; align-items: center; padding: 3px; flex-shrink: 0;
                }
                html:not(.dark) .theme-toggle {
                    background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(15, 23, 42, 0.1);
                }
                .theme-toggle:hover { border-color: #fbbf24; }
                .theme-toggle-knob {
                    width: 22px; height: 22px; border-radius: 50%;
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 2px 8px rgba(251, 191, 36, 0.4);
                }
                html:not(.dark) .theme-toggle-knob {
                    transform: translateX(26px);
                    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
                }
                .theme-toggle-knob svg { width: 14px; height: 14px; color: white; }

                .text-muted { color: #94a3b8; }
                html:not(.dark) .text-muted { color: #475569; }
                .text-faint { color: #64748b; }
                html:not(.dark) .text-faint { color: #64748b; }
                .text-body { color: #cbd5e1; }
                html:not(.dark) .text-body { color: #334155; }

                .input-dark { background: #020617; border: 1px solid rgba(59, 130, 246, 0.25); color: #f1f5f9; }
                .input-dark:focus { border-color: #3b82f6; outline: none; }
                html:not(.dark) .input-dark { background: #ffffff; border: 1px solid rgba(15, 23, 42, 0.15); color: #0f172a; }
                html:not(.dark) .input-dark:focus { border-color: #2563eb; }

                .badge { background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); }
                html:not(.dark) .badge { background: rgba(255, 255, 255, 0.95); color: #0f172a !important; }

                .btn-primary { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; }
                html:not(.dark) .btn-primary { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); }
                .line-bg { background: #1e293b; }
                html:not(.dark) .line-bg { background: #cbd5e1; }

                .card-dark-bg { background: rgba(15, 23, 42, 0.6); transition: background 0.4s ease; }
                html:not(.dark) .card-dark-bg { background: rgba(255, 255, 255, 0.9); }

                .hero-badge { background: rgba(59, 130, 246, 0.1); }
                html:not(.dark) .hero-badge { background: rgba(59, 130, 246, 0.08); }
            `}</style>
            <DriveluxNavbar />
            <DriveluxHero />
            <DriveluxStats />
            <DriveluxFleet />
            <DriveluxProcess />
            <DriveluxBooking />
            <DriveluxFeatures />
            <DriveluxTestimonials />
            <DriveluxFaq />
            <DriveluxCta />
            <main>{children}</main>
            <DriveluxFooter />
        </div>
    );
}