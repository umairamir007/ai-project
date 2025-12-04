import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logo } from "../../images";
import { Button } from "../layout/button";
import { useAuthSession } from "../../hooks/useAuthSession";
import { clearAuthSession } from "../../utils/authStorage";
import { CircleX, Menu } from "lucide-react";
import PageContainer from "../layout/page-container";

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthSession();
    const [open, setOpen] = useState(false);

    const handleAuthClick = () => {
        if (!isAuthenticated) {
            navigate("/sign-in");
            return;
        }
        clearAuthSession();
        navigate("/sign-in", { replace: true });
    };

    return (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 py-4 z-10 w-[80%]">
            <div className="w-full mx-auto flex items-center justify-between px-6">

                {/* LOGO */}
                <div className="flex items-center gap-3">
                    <img src={logo} alt="logo" className="h-16 w-16 object-contain" />
                </div>

                {/* DESKTOP MENU */}
                <div className="hidden md:flex items-center gap-10 text-white text-lg 2xl:text-xl">
                    <Link to="/" className="hover:text-gray-300 ">Content made Easy</Link>
                    <Link to="/" className="hover:text-gray-300 ">Why Choose Us</Link>
                    <Link to="/" className="hover:text-gray-300 ">Why love ISAI</Link>
                    <Link to="/" className="hover:text-gray-300 ">Use Cases</Link>
                    <Link to="/" className="hover:text-gray-300 ">Pricing</Link>
                    {
                        isAuthenticated ? (
                            <Link to="/user-dashboard" className="hover:text-gray-300 ">Dashboard</Link>
                        ) : null
                    }
                </div>

                {/* DESKTOP BUTTON */}
                <div className="hidden md:block">
                    <Button variant="alpha" className="px-12 h-13 text-black text-xl" onClick={handleAuthClick}>
                        {isAuthenticated ? "Logout" : "Sign In"}
                    </Button>
                </div>

                {/* MOBILE HAMBURGER */}
                <button
                    className="md:hidden text-white text-3xl"
                    onClick={() => setOpen(!open)}
                >
                    {open ? <CircleX /> : <Menu />}
                </button>
            </div>

            {/* MOBILE MENU DROPDOWN */}
            {open && (
                <div className="md:hidden w-full bg-black px-6 pb-4 animate-slideDown">
                    <div className="flex flex-col gap-4 text-white text-lg mt-4">

                        <Link to="/" onClick={() => setOpen(false)}>Content made Easy</Link>
                        <Link to="/" onClick={() => setOpen(false)}>Why Choose Us</Link>
                        <Link to="/" onClick={() => setOpen(false)}>Why love ISAI</Link>
                        <Link to="/" onClick={() => setOpen(false)}>Use Cases</Link>
                        <Link to="/" onClick={() => setOpen(false)}>Pricing</Link>

                        <Button
                            variant="alpha"
                            className=" w-[100px] mt-2 h-11"
                            onClick={() => {
                                handleAuthClick();
                                setOpen(false);
                            }}
                        >
                            {isAuthenticated ? "Logout" : "Sign In"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
