"use client";
import { useState } from "react";
import { GrClose } from "react-icons/gr";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { ArrowRight, LogInIcon } from "lucide-react";

function Header() {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const nav = [
    {
      name: "Dashboard",
      route: "/dashboard",
    },
  ];

  return (
    <div className="  p-2 border-b-2 bg-gray-100">
      <div className="container">
        <header className="flex flex-row items-center justify-between sm:justify-between px-4">
          <Link
            href="/"
            className="flex items-center h-10 px-10 bg-gradient-to-r from-gray-900 via-gray-600 to-gray-500 rounded-tl-full rounded-br-full font-bold uppercase italic text-white hover:opacity-90"
          >
            Arfat AI
          </Link>
          <nav className="hidden sm:flex justify-between items-center gap-4 font-semibold dark:text-black">
            {nav.map((n, i) => (
              <Link href={n.route} key={i} className="hover:text-gray-500">
                {n.name}
              </Link>
            ))}{" "}
            {session?.user?.email ? (
              <Button
                onClick={() =>
                  signOut({ redirect: true, callbackUrl: "/login" })
                }
                className="hover:text-gray-500"
              >
                Logout <ArrowRight />
              </Button>
            ) : (
              <Link
                href="login"
                className="hover:text-gray-500 text-nowrap  w-full flex"
              >
                Login <LogInIcon />
              </Link>
            )}
          </nav>
          <nav className="sm:hidden flex flex-col items-end gap-1 font-semibold">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="sm:hidden font-bold text-xl hover:text-gray-500"
            >
              {showMenu ? <GrClose /> : <GiHamburgerMenu />}
            </button>
            {showMenu && (
              <>
                {nav.map((n, i) => (
                  <Link href={n.route} key={i} className="hover:text-gray-500">
                    {n.name}
                  </Link>
                ))}
                {session?.user?.email ? (
                  <Button
                    onClick={() =>
                      signOut({ redirect: true, callbackUrl: "/login" })
                    }
                    className="hover:text-gray-500"
                  >
                    Logout <ArrowRight />
                  </Button>
                ) : (
                  <Link href="login" className="hover:text-gray-500 flex">
                    Login <LogInIcon />
                  </Link>
                )}
              </>
            )}
          </nav>
        </header>
      </div>
    </div>
  );
}

export default Header;
