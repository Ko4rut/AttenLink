"use client"

import { ScanQrCode } from "lucide-react";
import Header from "../../components/SectionHeader"
import Body from "./components/ScannerBody"

export default function ScanerPage() {
    const handleLogout = () => {
        const path = window.location.pathname.split("/")
        path.pop()

        const newPath = path.join("/")
        window.location.href = newPath
    }

    return (
        <div className="flex min-h-screen flex-col justify-between bg-[#DCE3E6]">
            <Header onLogout={handleLogout} />
            <Body />
        </div>
    );
}