import { apiOne } from "./apiSlice";

export const bookApiSlice = apiOne.injectEndpoints({
  endpoints: (builder) => ({
    // getBooks: builder.query({
    //   query: ({ page = 1, limit = 10, genre = "", sortBy = "", search = "" }) =>
    //   `books?page=${page}&limit=${limit}&genre=${genre}&sort=${sortBy}&search=${search}`,
    //   providesTags: ["Book"],
    // }),
    getBooks: builder.query({
      query: () => `books`,
      providesTags: ["Book"],
    }),
    getBookDetails: builder.query({
      query: (bookId) => `books/${bookId}`,
      providesTags: (result, error, arg) => [{ type: "Book", id: arg }],
    }),
    addReview: builder.mutation({
      query: ({ bookId, ...review }) => ({
        url: `books/${bookId}/reviews`,
        method: "POST",
        body: review,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Book", id: arg.bookId },
        "Review",
      ],
    }),
    // Add other book-related endpoints
  }),
});

export const {
  useGetBooksQuery,
  useGetBookDetailsQuery,
  useAddReviewMutation,
} = bookApiSlice;
