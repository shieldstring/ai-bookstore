import React, { useMemo } from "react";

const allBooks = [
  { title: "Be your self & Never Surrender", img: "/images/book1.jpg" },
  { title: "The Adventure", img: "/images/book2.jpg" },
  { title: "Life of Wilds", img: "/images/book3.jpg" },
  { title: "Luster a Novel", img: "/images/book4.jpg" },
  { title: "Such a Fun Age", img: "/images/book5.jpg" },
  { title: "The ORYX: Is Alien Real", img: "/images/book6.jpg" },
  { title: "REAL LIFE", img: "/images/book7.jpg" },
];

export default function TrendingBooks() {
  // Only runs once on mount/reload
  const trendingBooks = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * allBooks.length);
    const randomBook = { ...allBooks[randomIndex], large: true };

    const remaining = allBooks.filter((_, i) => i !== randomIndex);
    return [randomBook, ...remaining];
  }, []);

  return (
    <section className="text-center py-10 px-5">
      <h2 className="text-2xl md:text-3xl font-semibold">Trending this week</h2>
      <p className="text-gray-500 max-w-lg mx-auto mt-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8 lg:px-28 mx-auto">
        {trendingBooks.map((book, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-lg shadow-md cursor-pointer transform transition-all duration-300 hover:scale-105 ${
              book.large ? "md:col-span-2 row-span-2" : ""
            }`}
          >
            <img
              src={book.img}
              alt={book.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4 text-white">
              <h3 className="text-lg md:text-xl font-bold">{book.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
