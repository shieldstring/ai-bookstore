import { apiTwo } from "./apiSlice";

export const productsApiSlice = apiTwo.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page = 1, limit = 10, genre = "", sortBy = "", search = "" }) =>
        `books?page=${page}&limit=${limit}&genre=${genre}&sort=${sortBy}&search=${search}`,
      providesTags: ["Book"],
    }),
    getProduct: builder.query({
      query: (bookId) => `books/${bookId}`,
      providesTags: (result, error, arg) => [{ type: "Book", id: arg }],
    }),
    createProduct: builder.mutation({
      query: (productData) => ({
        url: "products",
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Book"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `products/${id}`,
        method: "PUT",
        body: productData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Book", id }],
    }),
    deleteProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `products/${id}`,
        method: "DELETE",
        body: productData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Book", id }],
    }),
  }),
});

export const {
  useGetProductQuery,
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApiSlice;
