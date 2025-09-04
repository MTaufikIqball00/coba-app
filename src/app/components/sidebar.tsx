"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton"; // Import LogoutButton

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [activeItem, setActiveItem] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false); // State for profile menu

  // Menu items data
  const mainMenuItems = [
    { name: "Dashboard", icon: "📊", href: "/" },
    { name: "Mata Pelajaran", icon: "📚", href: "/mapel" },
    { name: "Tugas", icon: "📝", href: "/tugas" },
    { name: "Jadwal Pelajaran", icon: "📅", href: "/jadwal" },
    { name: "Nilai", icon: "📊", href: "/nilai" },
  ];

  const subMenuItems = [
    { name: "Absensi", icon: "🔔", href: "/absensi" },
    { name: "Forum Diskusi", icon: "💬", href: "/forum" },
    { name: "Try-Out", icon: "🎯", href: "/tryout" },
  ];

  // Sinkronisasi activeItem berdasarkan pathname
  useEffect(() => {
    if (pathname === "/") setActiveItem("Dashboard");
    else if (pathname.startsWith("/mapel")) setActiveItem("Mata Pelajaran");
    else if (pathname.startsWith("/tugas")) setActiveItem("Tugas");
    else if (pathname.startsWith("/jadwal")) setActiveItem("Jadwal Pelajaran");
    else if (pathname.startsWith("/nilai")) setActiveItem("Nilai");
    else if (pathname.startsWith("/absensi")) setActiveItem("Absensi");
    else if (pathname.startsWith("/forum")) setActiveItem("Forum Diskusi");
    else if (pathname.startsWith("/tryout")) setActiveItem("Try-Out");
    else setActiveItem("");
  }, [pathname]);

  const handleMenuClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    itemName: string,
    href: string
  ) => {
    setActiveItem(itemName);
    router.push(href);

    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-white shadow-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
          type="button"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-[#2366d1] text-white fixed h-full overflow-y-auto hide-scrollbar rounded-r-md z-30">
        <div className="flex flex-col justify-between min-h-full">
          <div className="flex-1">
            {/* Logo section */}
            <div className="p-6 flex items-start justify-baseline h-32 flex-shrink-0">
              <Image
                src="/assets/logo.png"
                alt="Logo Dinas Pendidikan"
                width={100}
                height={100}
                className="object-contain"
                priority
              />
            </div>

            {/* Main menu */}
            <nav className="mt-2 px-2">
              <ul className="space-y-1">
                {mainMenuItems.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={(e) => handleMenuClick(e, item.name, item.href)}
                      className={`w-full flex items-center px-4 py-2 mt-1 rounded-full transition-all duration-200 ease-in-out text-left focus:outline-none focus:ring-1 focus:ring-white focus:ring-opacity-10 ${
                        activeItem === item.name
                          ? "bg-blue-800 text-white shadow-lg"
                          : "text-gray-200 hover:bg-white hover:text-black"
                      }`}
                    >
                      <span className="mr-3 flex-shrink-0 w-5 h-5 flex items-center justify-center text-lg">
                        {item.icon}
                      </span>
                      <span className="whitespace-nowrap">{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Divider */}
              <div className="border-t border-white/30 my-4 w-full"></div>

              {/* Sub menu */}
              <ul className="space-y-1">
                {subMenuItems.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={(e) => handleMenuClick(e, item.name, item.href)}
                      className={`w-full flex items-center px-4 py-2 mt-1 rounded-full transition-all duration-200 ease-in-out text-left focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
                        activeItem === item.name
                          ? "bg-blue-800 text-white shadow-lg"
                          : "text-gray-200 hover:bg-white hover:text-black"
                      }`}
                    >
                      <span className="mr-3 flex-shrink-0 w-5 h-5 flex items-center justify-center text-lg">
                        {item.icon}
                      </span>
                      <span className="whitespace-nowrap">{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Bottom Sidebar */}
          <div className="flex-shrink-0 px-6 py-4 bg-[#2366d1]">
            <div className="w-full h-24 flex items-center justify-center mb-4">
              <Image
                src="/assets/ilustrasiUpdate.png"
                alt="Upgrade illustration"
                width={180}
                height={100}
                className="object-contain"
                loading="lazy"
              />
            </div>

            <div className="border-t border-white/30 my-4 w-full"></div>

            <div className="relative">
              {isProfileMenuOpen && (
                <div className="absolute bottom-full mb-2 w-full">
                  <LogoutButton />
                </div>
              )}
              <button
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center mt-4 h-16 w-full text-left"
              >
                <div className="flex-shrink-0">
                  <Image
                    src="/assets/Avatar.png"
                    alt="Avatar"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="ml-3 flex flex-col min-w-0 flex-1">
                  <p className="text-sm text-gray-300 whitespace-nowrap">
                    Welcome back 👋
                  </p>
                  <p className="text-lg font-bold text-white whitespace-nowrap truncate">
                    Johnathan
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#2366d1] text-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col justify-between min-h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/20 h-16">
            <div className="flex items-center space-x-3">
              <Image
                src="/assets/logo.png"
                alt="Logo Dinas Pendidikan"
                width={40}
                height={40}
                className="object-contain"
              />
              <h1 className="text-lg font-bold text-white">Disdik Jabar</h1>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-md text-white hover:bg-white/20 transition-colors duration-200"
              type="button"
              aria-label="Close menu"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="mt-4 px-2">
              <ul className="space-y-1">
                {mainMenuItems.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={(e) => handleMenuClick(e, item.name, item.href)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out text-left focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
                        activeItem === item.name
                          ? "bg-blue-800 text-white shadow-lg"
                          : "text-gray-200 hover:bg-blue-800 hover:text-white"
                      }`}
                    >
                      <span className="mr-3 flex-shrink-0 w-6 h-6 flex items-center justify-center text-xl">
                        {item.icon}
                      </span>
                      <span className="whitespace-nowrap">{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/30 my-4 w-full"></div>

              <ul className="space-y-1">
                {subMenuItems.map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={(e) => handleMenuClick(e, item.name, item.href)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ease-in-out text-left focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
                        activeItem === item.name
                          ? "bg-blue-800 text-white shadow-lg"
                          : "text-gray-200 hover:bg-blue-800 hover:text-white"
                      }`}
                    >
                      <span className="mr-3 flex-shrink-0 w-6 h-6 flex items-center justify-center text-xl">
                        {item.icon}
                      </span>
                      <span className="whitespace-nowrap">{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Mobile Footer */}
          <div className="flex-shrink-0 p-4 border-t border-white/20">
            <LogoutButton />
            <div className="flex items-center h-12 mt-2">
              <div className="flex-shrink-0">
                <Image
                  src="/assets/Avatar.png"
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="ml-3 flex flex-col min-w-0 flex-1">
                <p className="text-xs text-gray-300">Welcome back 👋</p>
                <p className="text-sm font-bold text-white truncate">
                  Johnathan
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
