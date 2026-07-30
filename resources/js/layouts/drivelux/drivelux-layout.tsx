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
        <div className="overflow-x-hidden" style={{ backgroundColor: '#050814' }}>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.0/index.min.css" />
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/playfair-display@5.0.0/index.min.css" />
            <style>{`
                html { scroll-behavior: smooth; }
                body {
                    font-family: 'Inter', sans-serif;
                    background: #050814;
                    color: #f1f5f9;
                    transition: background 0.4s ease, color 0.4s ease;
                }
                .font-serif { font-family: 'Playfair Display', serif !important; }
                body.light {
                    background: #f8fafc !important;
                    color: #0f172a !important;
                }
                .gradient-text {
                    background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #fbbf24 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                body.light .gradient-text {
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
                body.light .glass-nav {
                    background: rgba(255, 255, 255, 0.85) !important;
                    border-bottom: 1px solid rgba(15, 23, 42, 0.08) !important;
                }
                .card {
                    background: rgba(15, 23, 42, 0.6);
                    border: 1px solid rgba(59, 130, 246, 0.2);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                body.light .card {
                    background: rgba(255, 255, 255, 0.95) !important;
                    border: 1px solid rgba(15, 23, 42, 0.08) !important;
                    box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06) !important;
                }
                .card-hover:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 30px 60px rgba(59, 130, 246, 0.25);
                }
                body.light .card-hover:hover {
                    box-shadow: 0 30px 60px rgba(15, 23, 42, 0.12) !important;
                }
                .grid-bg {
                    background-image: linear-gradient(rgba(59, 130, 246, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.07) 1px, transparent 1px);
                    background-size: 60px 60px;
                }
                body.light .grid-bg {
                    background-image: linear-gradient(rgba(59, 130, 246, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.08) 1px, transparent 1px) !important;
                }
                .blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    opacity: 0.4;
                    pointer-events: none;
                }
                body.light .blob { opacity: 0.2; }
                .pulse-btn { animation: pulseGlow 2.5s ease-in-out infinite; }
                @keyframes pulseGlow {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5); }
                    50% { box-shadow: 0 0 0 18px rgba(59, 130, 246, 0); }
                }
                .divider {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent);
                }
                body.light .divider {
                    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent) !important;
                }
                .calendar-day { transition: all 0.2s ease; cursor: pointer; }
                .calendar-day:hover:not(.disabled):not(.booked) { background: rgba(59, 130, 246, 0.2); }
                .calendar-day.selected { background: #3b82f6 !important; color: white !important; }
                body.light .calendar-day.selected { background: #2563eb !important; }
                .calendar-day.in-range { background: rgba(59, 130, 246, 0.15); }
                .calendar-day.booked { background: rgba(239, 68, 68, 0.2); color: #fca5a5; text-decoration: line-through; cursor: not-allowed; }
                body.light .calendar-day.booked { color: #dc2626 !important; }
                .calendar-day.disabled { color: #475569; cursor: not-allowed; }
                body.light .calendar-day.disabled { color: #cbd5e1 !important; }
                .calendar-day.today { border: 1px solid #fbbf24; }
                .step-active { background: #3b82f6; color: white; }
                body.light .step-active { background: #2563eb !important; }
                .step-done { background: #10b981; color: white; }
                .signature-pad { touch-action: none; cursor: crosshair; }
                .vehicle-card.selected { border-color: #3b82f6 !important; box-shadow: 0 0 0 2px #3b82f6; }
                .input-dark { background: #020617; border: 1px solid rgba(59, 130, 246, 0.25); color: #f1f5f9; }
                .input-dark:focus { border-color: #3b82f6; outline: none; }
                body.light .input-dark { background: #ffffff !important; border: 1px solid rgba(15, 23, 42, 0.15) !important; color: #0f172a !important; }
                body.light .input-dark:focus { border-color: #2563eb !important; }
                .badge { background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(8px); }
                body.light .badge { background: rgba(255, 255, 255, 0.95) !important; color: #0f172a !important; }
                .btn-primary { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; }
                body.light .btn-primary { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%) !important; }
                .step-inactive { background: #1e293b; border: 1px solid #475569; }
                body.light .step-inactive { background: #e2e8f0 !important; border: 1px solid #cbd5e1 !important; color: #475569 !important; }
                .line-bg { background: #1e293b; }
                body.light .line-bg { background: #cbd5e1 !important; }
                .theme-toggle {
                    position: relative; width: 56px; height: 30px;
                    background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(59, 130, 246, 0.25);
                    border-radius: 999px; cursor: pointer; transition: all 0.3s ease;
                    display: flex; align-items: center; padding: 3px; flex-shrink: 0;
                }
                body.light .theme-toggle { background: rgba(255, 255, 255, 0.9) !important; border: 1px solid rgba(15, 23, 42, 0.1) !important; }
                .theme-toggle:hover { border-color: #fbbf24; }
                .theme-toggle-knob {
                    width: 22px; height: 22px; border-radius: 50%;
                    background: linear-gradient(135deg, #fbbf24, #f59e0b);
                    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 2px 8px rgba(251, 191, 36, 0.4);
                }
                body.light .theme-toggle-knob { transform: translateX(26px); background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important; box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4) !important; }
                .text-muted { color: #94a3b8; }
                body.light .text-muted { color: #475569 !important; }
                .text-faint { color: #64748b; }
                body.light .text-faint { color: #64748b !important; }
                .text-body { color: #cbd5e1; }
                body.light .text-body { color: #334155 !important; }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .slide-in { animation: slideIn 0.4s ease-out; }
                .faq-content { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }
                .faq-item.open .faq-content { max-height: 300px; }
                .faq-icon { transition: transform 0.3s ease; }
                .faq-item.open .faq-icon { transform: rotate(45deg); }
                input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); }
                body.light input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0) !important; }
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