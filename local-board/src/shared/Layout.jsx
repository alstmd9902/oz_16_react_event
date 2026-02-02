import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="mt-14 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
