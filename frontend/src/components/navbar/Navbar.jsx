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
      <PageContainer>
          <div className=" py-4">
            <div className="w-full mx-auto flex items-center justify-between px-6">

                {/* LOGO */}
                <div className="flex items-center gap-3">
                    <img src={logo} alt="logo" className="h-16 w-16 object-contain" />
                </div>

                {/* DESKTOP MENU */}
                <div className="hidden md:flex items-center gap-10 text-white text-sm">
                    <Link to="/" className="hover:text-gray-300 sm:text-xl text-lg 2xl:text-2xl">Content made Easy</Link>
                    <Link to="/" className="hover:text-gray-300 sm:text-xl text-lg 2xl:text-2xl">Why Choose Us</Link>
                    <Link to="/" className="hover:text-gray-300 sm:text-xl text-lg 2xl:text-2xl">Why love ISAI</Link>
                    <Link to="/" className="hover:text-gray-300 sm:text-xl text-lg 2xl:text-2xl">Use Cases</Link>
                    <Link to="/" className="hover:text-gray-300 sm:text-xl text-lg 2xl:text-2xl">Pricing</Link>
                    {
                        isAuthenticated ? (
                            <Link to="/user-dashboard" className="hover:text-gray-300 sm:text-xl text-lg 2xl:text-2xl">Dashboard</Link>
                        ) : null
                    }
                </div>

                {/* DESKTOP BUTTON */}
                <div className="hidden md:block">
                    <Button variant="alpha" className="max-w-36 h-11" onClick={handleAuthClick}>
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
                            className="w-32 mt-2 h-11"
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
      </PageContainer>
    );
};

export default Navbar;
