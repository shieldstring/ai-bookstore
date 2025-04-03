import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchBooks, fetchBookById, fetchBooksByCategory } from '../../services/bookService';

export const getBooks = createAsyncThunk(
  'books/getBooks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchBooks();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getBookById = createAsyncThunk(
  'books/getBookById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetchBookById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getBooksByCategory = createAsyncThunk(
  'books/getBooksByCategory',
  async (category, { rejectWithValue }) => {
    try {
      const response = await fetchBooksByCategory(category);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  books: [],
  filteredBooks: [],
  currentBook: null,
  featuredBooks: [],
  bestSellers: [],
  relatedBooks: [],
  status: 'idle',
  error: null,
  filters: {
    category: '',
    priceRange: [0, 100],
    format: '',
    rating: 0,
  },
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredBooks = state.books.filter(book => {
        const matchesCategory = !state.filters.category || book.category === state.filters.category;
        const matchesPriceRange = book.price >= state.filters.priceRange[0] && book.price <= state.filters.priceRange[1];
        const matchesFormat = !state.filters.format || book.format === state.filters.format;
        const matchesRating = book.rating >= state.filters.rating;
        
        return matchesCategory && matchesPriceRange && matchesFormat && matchesRating;
      });
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredBooks = state.books;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBooks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getBooks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.books = action.payload;
        state.filteredBooks = action.payload;
        state.featuredBooks = action.payload.filter(book => book.featured);
        state.bestSellers = action.payload.filter(book => book.bestSeller).sort((a, b) => b.sales - a.sales).slice(0, 10);
      })
      .addCase(getBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(getBookById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getBookById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentBook = action.payload;
        state.relatedBooks = state.books
          .filter(book => book.category === action.payload.category && book.id !== action.payload.id)
          .slice(0, 4);
      })
      .addCase(getBookById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters } = booksSlice.actions;
export default booksSlice.reducer;