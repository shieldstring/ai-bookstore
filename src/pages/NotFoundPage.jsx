import React, { useState, useEffect } from "react";
import { Home, ArrowLeft, Search, Zap, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Go back one step in the browser history
  };

  useEffect(() => {
    setIsVisible(true);

    // Create floating elements
    const elements = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 60 + 20,
      left: Math.random() * 100,
      animationDelay: Math.random() * 5,
      duration: Math.random() * 10 + 15,
    }));
    setFloatingElements(elements);
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full bg-gradient-to-r from-indigo-200/30 to-purple-200/30 animate-bounce"
            style={{
              width: `${element.size}px`,
              height: `${element.size}px`,
              left: `${element.left}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${element.animationDelay}s`,
              animationDuration: `${element.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `radial-gradient(circle, #6366f1 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container flex items-center justify-center min-h-screen px-6 mx-auto relative z-10">
        <div
          className={`flex flex-col items-center max-w-2xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* 404 Large Number */}
          <div className="relative mb-8">
            <h1 className="text-9xl md:text-[12rem] font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none animate-pulse">
              404
            </h1>
            <div className="absolute -top-4 -right-4 animate-spin-slow">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Error Icon with Animation */}
          <div className="relative mb-6">
            <div className="p-6 bg-gradient-to-r from-red-100 to-orange-100 rounded-full shadow-xl animate-bounce">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-200 to-orange-200 rounded-full animate-ping opacity-75"></div>
          </div>

          {/* Main Content */}
          <div className="space-y-6 mb-10">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Oops! Page Not Found
            </h2>

            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              The page you're looking for seems to have vanished into the
              digital void. Don't worry, even the best explorers sometimes take
              a wrong turn!
            </p>

            {/* Fun animated message */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-700">
                  Did you know?
                </span>
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-sm text-blue-600">
                The first 404 error was discovered at CERN in 1992. You're now
                part of internet history! 🚀
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
            <button
              onClick={handleGoBack}
              className="group flex items-center justify-center w-full sm:w-auto px-8 py-4 text-gray-700 bg-white border-2 border-gray-300 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-semibold">Go Back</span>
            </button>

            <button
              onClick={() => navigate("/")}
              className="group flex items-center justify-center w-full sm:w-auto px-8 py-4 text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
            >
              <Home className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              <span>Take Me Home</span>
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-12 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Still lost? Try these:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-colors border border-green-200">
                <Search className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 font-medium">
                  Search
                </span>
              </button>
              <button className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl hover:from-blue-100 hover:to-sky-100 transition-colors border border-blue-200">
                <Home className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">
                  Homepage
                </span>
              </button>
              <button className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-colors border border-purple-200">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-700 font-medium">
                  Contact
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </section>
  );
}

export default NotFoundPage;
