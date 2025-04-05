// components/common/Newsletter.jsx
import React, { useState } from 'react';
import Button from './Button';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribe email:', email);
    setEmail('');
  };

  return (
    <div className="bg-[#380B46] py-8 lg:py-16 px-4">
      <div className="lg:px-24 mx-auto">
        <div className="flex flex-col md:flex-row justify-center gap-x-36 items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-white text-xl lg:text-3xl font-semibold mb-1">Subscribe our newsletter </h3>
            <p className="text-purple-200 text-xl lg:text-2xl">for newest books updates</p>
          </div>
          

          <form onSubmit={handleSubmit} className="sm:flex">
            <div className="flex-1 min-w-0 sm:mr-2">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
                placeholder="Type your email here ..."
                className="block w-full px-5 py-3 rounded-md border-0 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <Button 
              type="submit" 
              variant="secondary" 
              className="rounded-l-none"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;