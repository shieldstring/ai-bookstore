import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white pt-10">
      <div className="px-4 mx-auto lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-purple-750">
                Wisdom Peters
              </span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Renowned as a{" "}
              <strong className="text-gray-800">top-tier</strong>{" "}
              Bible Teacher · Pastor · Psychology Coach · Life Strategist · Business Mentor · Author —
              empowering individuals and organizations with teachings, mentorship, and strategic consultations for over two decades.
            </p>
            <div className="mt-4 space-y-1 text-sm text-gray-500">
              <a href="tel:+447518576657" className="hover:text-purple-600 transition block">
                +44 7518 576657
              </a>
              <a href="mailto:contact@wisdompeters.com" className="hover:text-purple-600 transition block">
                contact@wisdompeters.com
              </a>
              <p>Manchester, United Kingdom</p>
            </div>
          </div>

          <div>
            <h3 className="text-gray-800 font-medium mb-4">Quick Links</h3>
            <div className="flex gap-12">
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/about"
                    className="text-gray-600 hover:text-purple-600 text-sm"
                  >
                    About us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-600 hover:text-purple-600 text-sm"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faq"
                    className="text-gray-600 hover:text-purple-600 text-sm"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>

              <ul className="space-y-2">
                <li>
                  <Link
                    to="/terms"
                    className="text-gray-600 hover:text-purple-600 text-sm"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="text-gray-600 hover:text-purple-600 text-sm"
                  >
                    Privacy Policy
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to="/mlm-terms"
                    className="text-gray-600 hover:text-purple-600 text-sm"
                  >
                    MLM Terms
                  </Link>
                </li> */}
                <li>
                  <Link
                    to="/refund"
                    className="text-gray-600 hover:text-purple-600 text-sm"
                  >
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-gray-800 font-medium mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/books"
                  className="text-gray-600 hover:text-purple-600 text-sm"
                >
                  Books
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="text-gray-600 hover:text-purple-600 text-sm"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/login?redirect=/feeds"
                  className="text-gray-600 hover:text-purple-600 text-sm"
                >
                  Social
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/login?redirect=/dashboard/mlm"
                  className="text-gray-600 hover:text-purple-600 text-sm"
                >
                  Earn Rewards
                </Link>
              </li> */}
              <li>
                <Link
                  to="/login?redirect=/dashboard/groups"
                  className="text-gray-600 hover:text-purple-600 text-sm"
                >
                  Groups
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-800 font-medium mb-4">
              Don't miss the newest books
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Join our newsletter to stay updated on new releases, bestsellers,
              and special offers.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow rounded-l border border-gray-300 py-2 px-3 text-sm"
              />
              <button className="bg-purple-700 text-white px-4 py-2 rounded-r text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="py-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2026 Wisdom Peters. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a
                href="https://x.com/LightWithin365"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-purple-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@wisdom.peters2?_t=ZN-8z0PDjEKEQp&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-purple-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.03-.49-.03-.98-.01-1.47.18-1.92 1.12-3.66 2.58-4.78 1.29-1.01 3-1.58 4.68-1.49.04 1.34.02 2.69.04 4.04-1.74-.27-3.53.37-4.58 1.83-.23.32-.36.71-.36 1.11.02 2.42 2.48 3.9 4.9 3.55 1.26-.18 2.27-.99 2.75-2.14.28-.66.36-1.38.36-2.09V.02Z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@pastorwisdompeters"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-purple-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100063770981845&mibextid=wwXIfr&mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-purple-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
