import Link from "next/link";
import React from "react";

const product = () => {
  return (
    <>
      <h1>Product list</h1>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
        <li>
          <Link
            href={"products/1"}
            className="block rounded-lg bg-white p-4 shadow hover:shadow-lg hover:bg-gray-50 transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">Product 1</h3>
            <p className="text-sm text-gray-500">Lihat Produk 1</p>
          </Link>
        </li>
                <li>
          <Link
            href={"products/2"}
            className="block rounded-lg bg-white p-4 shadow hover:shadow-lg hover:bg-gray-50 transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">Product 2</h3>
            <p className="text-sm text-gray-500">Lihat Produk 2</p>
          </Link>
        </li>
                <li>
          <Link
            href={"products/3"}
            className="block rounded-lg bg-white p-4 shadow hover:shadow-lg hover:bg-gray-50 transition"
          >
            <h3 className="text-lg font-semibold text-gray-800">Product 3</h3>
            <p className="text-sm text-gray-500">Lihat Produk 3</p>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default product;
