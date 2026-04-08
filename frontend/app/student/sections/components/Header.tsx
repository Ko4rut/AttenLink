import { LogOut } from 'lucide-react';
type HeaderProps = {
    title?: string;
    onLogout?: () => void;
};

export default function Header({
    title = 'AttenLink',
    onLogout,
}: HeaderProps) {
    return (
        <header className="w-full bg-[#0F8A9D] px-4 py-3 flex items-center justify-between shadow-sm">
            {/* Logout */}
            <button
                onClick={onLogout}
                className="text-white hover:opacity-80 transition"
                aria-label="Logout"
            >
                <LogOut size={28} strokeWidth={2.2} />
            </button>

            {/* Logo + Brand */}
            <div className="flex items-center justify-center">
                <img
                    src="/img/paper-plane.png"
                    alt="paper plane"
                    className="w-1/5 h-1/5 m-0"
                />
                <h1 className="text-white text-[24px] flex font-bold tracking-tight">

                    {title}
                </h1>
            </div>

            {/* Spacer cho cân layout */}
            <div className="w-1/3" />
        </header>
    );
}