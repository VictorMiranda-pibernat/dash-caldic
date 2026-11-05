
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#101116]">
      <Navbar processCount={0} />

      <main className="min-h-0 w-full flex-1">
        <Outlet />
      </main>
    </div>
  );
}
