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
    <div className="bg-purple-600 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-white text-xl font-medium mb-1">Subscribe our newsletter</h3>
            <p className="text-purple-200">for newest books updates</p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Type your email here..."
              className="flex-grow px-4 py-2 rounded-l outline-none"
              required
            />
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