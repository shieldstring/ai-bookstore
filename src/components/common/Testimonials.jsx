import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Steve Henry',
    title: 'Book Lover',
    quote: 'Shopping book in Clevr is very easy. Quick delivery and fast respon. Their service is awesome!',
    image: 'https://placehold.co/100x100/E07A5F/fff?text=SH&font=Montserrat',
    rating: 5
  },
  {
    id: 2,
    name: 'Jane Smith',
    title: 'Avid Reader',
    quote: 'I love the variety of books available on Clevr. The website is user-friendly, and the delivery is always on time.',
    image: 'https://placehold.co/100x100/81B29A/fff?text=JS&font=Montserrat',
    rating: 4
  },
  {
    id: 3,
    name: 'David Johnson',
    title: 'Book Enthusiast',
    quote: 'Clevr has made buying books online a delightful experience. The customer service is exceptional.',
    image: 'https://placehold.co/100x100/F2CC8F/fff?text=DJ&font=Montserrat',
    rating: 5
  },
  {
    id: 4,
    name: 'Sarah Williams',
    title: 'Casual Reader',
    quote: "I'm impressed with the speed and efficiency of Clevr's delivery.  Great selection too!",
    image: 'https://placehold.co/100x100/3D405B/fff?text=SW&font=Montserrat',
    rating: 4
  },
];

const TestimonialCard = ({ testimonial, isActive }) => (
  <div
    className={`transition-all duration-500 transform bg-white/5 backdrop-blur-md border border-white/10 shadow-lg p-6 rounded-lg ${
      isActive ? 'scale-100 opacity-100 z-10' : 'scale-90 opacity-50'
    }`}
  >
    <div className="flex items-center gap-2 mb-4">
      {Array.from({ length: testimonial.rating }).map((_, index) => (
        <Star key={index} className="w-4 h-4 text-yellow-400" />
      ))}
    </div>
    <p className="text-gray-200 text-sm italic mb-4">
      &ldquo;{testimonial.quote}&rdquo;
    </p>
    <div className="flex items-center gap-4">
      <img
        src={testimonial.image}
        alt={testimonial.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <h4 className="text-white font-semibold">{testimonial.name}</h4>
        <p className="text-gray-400 text-sm">{testimonial.title}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const getSlide = (offset) => {
    return testimonials[(activeIndex + offset + testimonials.length) % testimonials.length];
  };

  // Autoplay effect
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // 5 seconds
    return () => clearInterval(interval); // Cleanup
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
            Testimonials
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            What our readers say about their experience with Clevr.
          </p>
        </div>

        <div className="relative flex items-center justify-center space-x-4 max-w-5xl mx-auto">
          <button
            onClick={prevSlide}
            className="absolute -left-6 z-20 p-2 bg-white/10 text-white hover:bg-white/20 rounded-full"
          >
     <ChevronLeft className="w-4 h-4 text-gray-100" />
          </button>

          <div className="flex items-center justify-center w-full overflow-hidden">
            <div className="flex space-x-4 transition-transform duration-500">
              {[getSlide(-1), getSlide(0), getSlide(1)].map((testimonial, index) => (
                <div
                key={testimonial.id}
                className={`transition-all duration-500
                  ${index === 1 ? 'w-full sm:w-[55%] scale-100 z-10' : 'hidden sm:block sm:w-[30%] scale-95 opacity-50'}
                `}
              >
                <TestimonialCard testimonial={testimonial} isActive={index === 1} />
              </div>
              ))}
            </div>
          </div>

          <button
            onClick={nextSlide}
            className="absolute -right-6 z-20 p-2 bg-white/10 text-white hover:bg-white/20 rounded-full"
          >
           <ChevronRight className="w-4 h-4 text-gray-100" />
          </button>
        </div>

        <div className="flex justify-center items-center mt-8">
          <div className="flex -space-x-3">
            {testimonials.slice(0, 4).map((t, index) => (
              <img
                key={index}
                className="w-10 h-10 rounded-full border-2 border-white"
                src={t.image}
                alt={`User ${index + 1}`}
              />
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-purple-500 text-white flex items-center justify-center">
              24+
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
