"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/register", name: "Register" },
  { href: "/login", name: "Login" },
  { href: "/forgot-password", name: "Forgot Password" },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      {navLinks.map((link) => {
        const isActive =
          pathname === link.href ||
          (pathname.startsWith(link.href) && link.href !== "/");

        return (
          <Link
            key={link.name}
            href={link.href}
            className={`inline-block px-4 py-2 m-2 rounded hover:bg-blue-600 transition ${
              isActive ? "bg-blue-700 font-bold" : "bg-blue-500 text-white"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
      <div className="p-4">{children}</div>
    </div>
  );
}
