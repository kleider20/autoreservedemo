export default function DashboardFooter() {
    return (
        <footer className="border-t border-border bg-background px-6 py-3">
            <p className="text-center text-xs text-muted-foreground">
                &copy; {new Date().getFullYear()} AutoReserve. Todos los derechos reservados.
            </p>
        </footer>
    );
}