import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logo } from "../../images";
import { Button } from "../layout/button";
import { useAuthSession } from "../../hooks/useAuthSession";
import { clearAuthSession } from "../../utils/authStorage";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../layout/sheet";

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
    <div className="absolute top-4 left-1/2 -translate-x-1/2 py-4 z-10 sm:w-[90%] w-[95%]">
      <div className="w-full mx-auto flex items-center justify-between px-6">

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="h-16 w-16 object-contain" />
        </div>

        {/* DESKTOP MENU (lg only) */}
        <div className="hidden lg:flex items-center gap-10 text-white text-lg 2xl:text-xl">
          <Link to="/" className="hover:text-gray-300">Content made Easy</Link>
          <Link to="/" className="hover:text-gray-300">Why Choose Us</Link>
          <Link to="/" className="hover:text-gray-300">Why love ISAI</Link>
          <Link to="/" className="hover:text-gray-300">Use Cases</Link>
          <Link to="/" className="hover:text-gray-300">Pricing</Link>

          {isAuthenticated && (
            <Link to="/user-dashboard" className="hover:text-gray-300">
              Dashboard
            </Link>
          )}
        </div>

        {/* DESKTOP BUTTON (lg only) */}
        <div className="hidden lg:block">
          <Button
            variant="alpha"
            className="px-12 h-13 text-black text-xl"
            onClick={handleAuthClick}
          >
            {isAuthenticated ? "Logout" : "Sign In"}
          </Button>
        </div>

        {/* HAMBURGER (sm + md) */}
        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>
              <Menu className="text-white text-3xl cursor-pointer" />
            </SheetTrigger>

            <SheetContent side="right" className="bg-black text-white p-6">
              <SheetHeader>
                <SheetTitle className="text-white text-xl">Menu</SheetTitle>
              </SheetHeader>

              <div className="flex flex-col gap-5 mt-6 text-lg">
                <Link to="/" onClick={() => setOpen(false)}>Content made Easy</Link>
                <Link to="/" onClick={() => setOpen(false)}>Why Choose Us</Link>
                <Link to="/" onClick={() => setOpen(false)}>Why love ISAI</Link>
                <Link to="/" onClick={() => setOpen(false)}>Use Cases</Link>
                <Link to="/" onClick={() => setOpen(false)}>Pricing</Link>

                <Button
                  variant="alpha"
                  className="w-[120px] h-11 mt-4 text-black"
                  onClick={() => {
                    handleAuthClick();
                    setOpen(false);
                  }}
                >
                  {isAuthenticated ? "Logout" : "Sign In"}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </div>
  );
};

export default Navbar;
