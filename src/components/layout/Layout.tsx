import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
    return (
        <div className="flex min-h-screen w-full min-w-0 flex-col overflow-x-hidden bg-[#101116]">
            <Navbar processCount={0} />

            <main className="min-h-0 w-full min-w-0 flex-1 overflow-x-auto overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}