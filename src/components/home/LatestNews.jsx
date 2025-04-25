import React from "react";

function LatestNews() {
  const blogPosts = [
    {
      id: 1,
      title: "10 things you should know to improve your reading skills",
      author: "James Wong",
      date: "March 10, 2025",
      image:
        "https://topthreeguide.com/wp-content/uploads/2022/09/Reading-Skills-TTG.png",
    },
    {
      id: 2,
      title: "Benefits of reading: From Origins to Modern Days",
      author: "Maria Smith",
      date: "March 14, 2025",
      image:
        "https://www.arabnews.com/sites/default/files/styles/n_670_395/public/main-image/2023/04/22/3783681-1705369951.jpg?itok=hH-0_oGY",
    },
    {
      id: 3,
      title: "What books you should read in 2025",
      author: "David Chang",
      date: "March 18, 2025",
      image:
        "https://images.lifestyleasia.com/wp-content/uploads/sites/7/2023/05/18102455/The-Best-Fiction-Books-1600x900.jpg",
    },
    {
      id: 4,
      title: "Why reading is important for our mental health",
      author: "James Wong",
      date: "March 22, 2025",
      image: "https://www.truegossiper.com/wp-content/uploads/2021/11/3-2.jpg",
    },
  ];
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Latest News</h2>
          <a href="#" className="text-sm text-purple-700">
            View All →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="font-medium text-sm line-clamp-2 mb-3">
                  {post.title}
                </h3>
                <div className="flex items-center">
                  <img
                    src={post.image}
                    alt={post.author}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <span className="text-xs text-gray-600">{post.author}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium">
            View All Articles
          </button>
        </div>
      </div>
    </section>
  );
}

export default LatestNews;
