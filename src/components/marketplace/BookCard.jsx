import React from 'react';
import { Link } from 'react-router-dom';
import { formatPricePlain } from '../../utils/currency';

const BookCard = ({ book }) => (
  <div className="book-card">
    <Link to={`/books/${book._id}`}>
    <img src={book.image} alt={book.title} />
    </Link>
    <h3>{book.title}</h3>
    <p>{book.author}</p>
    <p>Rating: {book.rating}</p>
    <p>Price: {formatPricePlain(book.price)}</p>
    <button>Buy Now</button>
    
  </div>
);

export default BookCard;