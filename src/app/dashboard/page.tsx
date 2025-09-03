import Image from "next/image";

// components/Dashboard.js
export default function Dashboard() {
  return (
    <div className="bg-white min-h-screen p-6">
      {/* Jadwal Masuk */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/3 bg-white shadow rounded p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-black text-lg">Jadwal Masuk</h2>
            <button className="border border-blue-700 text-blue-700 rounded-xl px-4 py-1 text-sm hover:bg-blue-100">
              <a href="#">View All</a>
            </button>
          </div>
          <ul>
            {["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map((day) => (
              <li key={day} className="flex justify-between text-black py-1">
                <span>{day}</span>
                <span className="text-black">08.00</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dashboard & Bantuan Card */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="bg-white shadow rounded p-4 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-black text-lg mb-1">
                Dashboard LMS Disdik Jabar
              </h2>
              <p className="text-gray-500 text-sm max-w-md">
                From colors, cards, typography to complex elements,
                <br />
                you will find the full documentation.
              </p>
              <a href="#" className="text-blue-500 text-xs mt-2 inline-block">
                Read more
              </a>
            </div>
            <div>
              <div className="w-32 h-24 bg-blue-500 flex items-center justify-center rounded">
                <Image
                  src="/assets/logo.png"
                  alt="logodinaspendidikan"
                  width={120}
                  height={120}
                />
              </div>
            </div>
          </div>
          <div className="bg-blue-100  shadow rounded p-4 flex items-center justify-between">
            <div>
              <div className="bg-blue-500 w-8 h-8 rounded-full flex items-center justify-center text-white text-xl">
                ?
              </div>
              <p className="font-bold text-gray-700 mt-2 mb-1 text-sm">
                Butuh Bantuan?
              </p>
              <a href="#" className="text-blue-600 text-xs">
                Klik disini
              </a>
            </div>
            <button className="bg-white px-4 py-1 rounded-xl text-black font-bold  hover:bg-blue-200">
              <a href="#">Bantuan</a>
            </button>
          </div>
        </div>
      </div>

      {/* Course Overview */}
      <div className="mt-8">
        <h2 className="font-bold text-black text-lg mb-4">Course Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Matematika */}
          <div className="bg-white shadow rounded overflow-hidden">
            <div className="relative h-32 bg-gray-100">
              <Image
                src="/assets/mtk.jpg"
                alt="logodinaspendidikan"
                fill
                className="object-cover"
              />
            </div>

            <div className="p-4">
              <h3 className="font-bold text-black text-lg">Matematika</h3>
              <p className="text-gray-500 text-sm mb-4">
                Music is something that every person has his or her specific
                opinion about.
              </p>

              <button className="border border-blue-700 text-blue-700 rounded-xl px-4 py-1 text-sm hover:bg-blue-100">
                <a href="#">View All</a>
              </button>
            </div>
          </div>
          {/* Bahasa Inggris */}
          <div className="bg-white shadow rounded overflow-hidden">
            <div className="relative h-32 bg-gray-100">
              <Image
                src="/assets/inggris.jpg"
                alt="logodinaspendidikan"
                fill
                className="object-cover"
              />
            </div>

            <div className="p-4">
              <h3 className="font-bold text-black text-lg">Bahasa Inggris</h3>
              <p className="text-gray-500 text-sm mb-4">
                Music is something that every person has his or her specific
                opinion about.
              </p>
              <button className="border border-blue-700 text-blue-700 rounded-xl px-4 py-1 text-sm hover:bg-blue-100">
                <a href="#">View All</a>
              </button>
            </div>
          </div>
          {/* Kimia */}
          <div className="bg-white shadow rounded overflow-hidden">
            <div className="relative h-32 bg-gray-100">
              <Image
                src="/assets/kimia.jpg"
                alt="logodinaspendidikan"
                fill
                className="object-cover"
              />
            </div>

            <div className="p-4">
              <h3 className="font-bold text-black text-lg">Kimia</h3>
              <p className="text-gray-500 text-sm mb-4">
                Music is something that every person has his or her specific
                opinion about.
              </p>
              <button className="border border-blue-700 text-blue-700 rounded-xl px-4 py-1 text-sm hover:bg-blue-100">
                <a href="#">View All</a>
              </button>
            </div>
          </div>
          {/* Fisika */}
          <div className="bg-white shadow rounded overflow-hidden">
            <div className="relative h-32 bg-gray-100">
              <Image
                src="/assets/fisika.jpg"
                alt="logodinaspendidikan"
                fill
                className="object-cover"
              />
            </div>

            <div className="p-4">
              <h3 className="font-bold text-black text-lg">Fisika</h3>
              <p className="text-gray-500 text-sm mb-4">
                Music is something that every person has his or her specific
                opinion about.
              </p>
              <button className="border border-blue-700 text-blue-700 rounded-xl px-4 py-1 text-sm hover:bg-blue-100">
                <a href="#">View All</a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
