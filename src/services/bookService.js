import api from './api';

export const fetchBooks = () => api.get('/books');
export const fetchBookById = (id) => api.get(`/books/${id}`);
export const fetchBooksByCategory = (id) => api.get(`/books/${id}`);
export const purchaseBook = (id) => api.post(`/books/${id}/purchase`);