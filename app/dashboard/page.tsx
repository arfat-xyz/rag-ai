import Link from "next/link";
import React from "react";

const HomePage = () => {
  const allRoutes: {
    href: string;
    name: string;
  }[] = [
    {
      href: "/dashboard/one",
      name: "First chatbot",
    },
    {
      href: "/dashboard/two",
      name: "Second chatbot",
    },
    {
      href: "/dashboard/all-user",
      name: "All users chatbot",
    },
    {
      href: "/dashboard/five",
      name: "Fifth chatbot",
    },
  ];
  return (
    <div className="w-full h-[calc(100vh-40px)] flex justify-center items-center">
      <div className="min-h-24 min-w-40 bg-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8 rounded-lg ">
        {allRoutes.map((singleRoute, i) => (
          <Link
            key={i}
            href={singleRoute.href}
            className="px-4 py-2 hover:bg-red-400 transition-colors duration-300 underline rounded-lg"
          >
            {singleRoute.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
