import React, { useState } from 'react';
import { Star } from "lucide-react";

// Dummy data for testimonials
const testimonials = [
    {
        id: 1,
        name: 'Steve Henry',
        title: 'Book Lover',
        quote: 'Shopping book in Clevr is very easy. Quick delivery and fast respon. Their service is awesome!',
        image: 'https://placehold.co/100x100/E07A5F/fff?text=SH&font=Montserrat', // Placeholder image
        rating: 5
    },
    {
        id: 2,
        name: 'Jane Smith',
        title: 'Avid Reader',
        quote: 'I love the variety of books available on Clevr. The website is user-friendly, and the delivery is always on time.',
        image: 'https://placehold.co/100x100/81B29A/fff?text=JS&font=Montserrat', // Placeholder image
        rating: 4
    },
    {
        id: 3,
        name: 'David Johnson',
        title: 'Book Enthusiast',
        quote: 'Clevr has made buying books online a delightful experience. The customer service is exceptional.',
        image: 'https://placehold.co/100x100/F2CC8F/fff?text=DJ&font=Montserrat',  // Placeholder
        rating: 5
    },
    {
        id: 4,
        name: 'Sarah Williams',
        title: 'Casual Reader',
        quote: "I'm impressed with the speed and efficiency of Clevr's delivery.  Great selection too!",
        image: 'https://placehold.co/100x100/3D405B/fff?text=SW&font=Montserrat',  // Placeholder
        rating: 4
    }
];

const TestimonialCard = ({ testimonial }) => {
    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-lg p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    {Array.from({ length: testimonial.rating }).map((_, index) => (
                        <Star key={index} className="w-4 h-4 text-yellow-400" />
                    ))}
                </div>
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
};

const Testimonials = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section className="py-16 bg-gradient-to-br from-gray-900 via-purple-900 to-black">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">
                        Testimonials
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        What our readers say about their experience with Clevr.
                    </p>
                </div>

                <div className="relative w-full max-w-4xl mx-auto">
                    <div className="flex justify-between">
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 bg-white/10 text-white hover:bg-white/20 border-white/20 rounded-full p-2"
                        >
                            &lt;
                        </button>

                        <div className="flex items-center justify-center">
                            <TestimonialCard testimonial={testimonials[currentSlide]} />
                        </div>

                        <button
                            onClick={nextSlide}
                            className="absolute right-4 bg-white/10 text-white hover:bg-white/20 border-white/20 rounded-full p-2"
                        >
                            &gt;
                        </button>
                    </div>
                </div>

                <div className="flex justify-center items-center mt-8">
                    <div className="flex -space-x-3">
                        {testimonials.slice(0, 4).map((testimonial, index) => (
                            <img
                                key={index}
                                className="w-10 h-10 rounded-full border-2 border-white"
                                src={testimonial.image}
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
