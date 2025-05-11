import { apiOne, apiTwo } from "./apiSlice";

export const bookApiSlice = apiOne.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: () => `books`,
    }),

    getBookLists: builder.query({
      query: ({
        page = 1,
        limit = 8,
        category = "",
        format = "",
        minPrice = 0,
        maxPrice = 100,
        search = "",
        sort = "newest",
      }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        if (category) params.append("category", category);
        if (format) params.append("format", format);
        if (minPrice > 0) params.append("minPrice", minPrice.toString());
        if (maxPrice < 100) params.append("maxPrice", maxPrice.toString());
        if (search) params.append("keyword", search); // Changed from 'search' to 'keyword' to match your backend
        if (sort) params.append("sort", sort);

        return `/books?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Book", id: _id })),
              { type: "Book", id: "LIST" },
            ]
          : [{ type: "Book", id: "LIST" }],
      transformResponse: (response) => ({
        data: response.data,
        total: response.total,
        page: response.page,
        pages: response.pages,
      }),
    }),

    getBookDetails: builder.query({
      query: (bookId) => `books/${bookId}`,
      providesTags: (result, error, arg) => [{ type: "Book", id: arg }],
    }),
  }),
});

export const { useGetBooksQuery, useGetBookListsQuery, useGetBookDetailsQuery } = bookApiSlice;

export const bookAuthApiSlice = apiTwo.injectEndpoints({
  endpoints: (builder) => ({
    getRecommendations: builder.query({
      query: () => `books/recommendations`,
      providesTags: ["Book"], // Assuming recommendations might change frequently
    }),
    addBook: builder.mutation({
      query: (newBook) => ({
        url: `books`,
        method: "POST",
        body: newBook,
      }),
      invalidatesTags: [{ type: "Book", id: "LIST" }], // Invalidate the book list cache
    }),
    updateBook: builder.mutation({
      query: ({ bookId, updatedBook }) => ({
        url: `books/${bookId}`,
        method: "PUT",
        body: updatedBook,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Book", id: arg.bookId },
      ], // Invalidate the specific book cache
    }),
    deleteBook: builder.mutation({
      query: (bookId) => ({
        url: `books/${bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Book", id: arg }, // Invalidate the specific book cache
        { type: "Book", id: "LIST" }, // Also invalidate the list cache
      ],
    }),
    trackPurchase: builder.mutation({
      query: (bookId) => ({
        // Assuming purchase tracking just needs the book ID
        url: `books/${bookId}/purchase`,
        method: "POST",
      }),
    }),
    addReview: builder.mutation({
      query: ({ bookId, ...review }) => ({
        url: `books/${bookId}/reviews`,
        method: "POST",
        body: review,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Book", id: arg.bookId }, // Invalidate the specific book cache to show new review
        "Review", // Or a specific Review tag if you have one
      ],
    }),
    bulkUpdateInventory: builder.mutation({
      query: (inventoryUpdates) => ({
        // Assuming inventoryUpdates is an array of { bookId, quantity }
        url: `books/bulk-update-inventory`,
        method: "PUT",
        body: inventoryUpdates,
      }),
      // This likely invalidates multiple book caches, potentially the whole list or specific ones based on response
      invalidatesTags: (result, error, arg) => {
        // If your backend response includes the IDs that were updated:
        if (result && result.updatedIds) {
          return result.updatedIds.map((id) => ({ type: "Book", id }));
        }
        // Otherwise, a broader invalidation might be needed:
        return [{ type: "Book", id: "LIST" }];
      },
    }),
  }),
});

export const {
  useGetRecommendationsQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useTrackPurchaseMutation,
  useAddReviewMutation,
  useBulkUpdateInventoryMutation,
} = bookAuthApiSlice;
