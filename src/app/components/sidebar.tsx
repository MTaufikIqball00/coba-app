import React from "react";
import Image from "next/image";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#2366d1] text-white fixed h-full overflow-y-auto hide-scrollbar rounded-r-md flex flex-col justify-between">
      {/* Bagian atas logo dan menu */}
      <div>
        <div className="p-6 flex items-start justify-baseline">
          <Image
            src="/assets/logo.png"
            alt="logodinaspendidikan"
            width={100}
            height={100}
          />
        </div>
        {/* Menu utama */}
        <nav className="mt-2">
          <ul>
            <li>
              <a
                href="/mapel"
                className="flex items-center px-6 py-2 mt-1 rounded-lg text-gray-200 hover:bg-blue-800 hover:text-white transition"
              >
                <span className="mr-3">📚</span> Mata Pelajaran
              </a>
            </li>
            <li>
              <a
                href="/tugas"
                className="flex items-center px-6 py-2 mt-1 rounded-lg text-gray-200 hover:bg-blue-800 hover:text-white transition"
              >
                <span className="mr-3">📝</span> Tugas
              </a>
            </li>
            <li>
              <a
                href="/jadwal"
                className="flex items-center px-6 py-2 mt-1 rounded-lg text-gray-200 hover:bg-blue-800 hover:text-white transition"
              >
                <span className="mr-3">📅</span> Jadwal Pelajaran
              </a>
            </li>
            <li>
              <a
                href="/nilai"
                className="flex items-center px-6 py-2 mt-1 rounded-lg text-gray-200 hover:bg-blue-800 hover:text-white transition"
              >
                <span className="mr-3">📊</span> Nilai
              </a>
            </li>
          </ul>
          {/* Garis pemisah atas dengan lebar penuh */}
          <div className="border-t border-white my-4 w-full"></div>
          {/* Sub menu styling lebih kecil dan ikon */}
          <ul>
            <li>
              <a
                href="/absensi"
                className="flex items-center px-6 py-2 mt-2 rounded-lg text-gray-200 hover:bg-blue-800 hover:text-white transition"
              >
                <span className="mr-3">🔔</span> Absensi
              </a>
            </li>
            <li>
              <a
                href="/forum"
                className="flex items-center px-6 py-2 mt-1 rounded-lg text-gray-200 hover:bg-blue-800 hover:text-white transition"
              >
                <span className="mr-3">💬</span> Forum Diskusi
              </a>
            </li>
            <li>
              <a
                href="/tryout"
                className="flex items-center px-6 py-2 mt-1 rounded-lg text-gray-200 hover:bg-blue-800 hover:text-white transition"
              >
                <span className="mr-3">🎯</span> Try-Out
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bagian bawah sidebar */}
      <div className="px-6 py-4 bg-[#2366d1]">
        <Image
          src="/assets/ilustrasiUpdate.png"
          alt="Upgrade illustration"
          width={180}
          height={100}
        />
        {/* Garis pemisah bawah dengan lebar penuh */}
        <div className="border-t border-white my-4 w-full"></div>
        <div className="flex items-center mt-4">
          <Image
            src="/assets/Avatar.png"
            alt="Avatar"
            width={64}
            height={64}
            className="rounded-full"
          />
          <div className="ml-3 flex flex-col">
            <p className="text-sm text-gray-300">Welcome back 👋</p>
            <p className="text-lg font-bold text-white">Johnathan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
