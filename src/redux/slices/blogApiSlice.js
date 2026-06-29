import { apiOne, apiTwo } from "./apiSlice";

export const blogPublicApiSlice = apiOne.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query({
      query: ({
        page = 1,
        limit = 8,
        category = "",
        search = "",
        showDrafts = false,
      } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        if (category) params.append("category", category);
        if (search) params.append("search", search);
        if (showDrafts) params.append("showDrafts", "true");

        return `/blogs?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Book", id: _id })), // Reuse Book tag or use Blog tags if configured
              { type: "Book", id: "BLOG_LIST" },
            ]
          : [{ type: "Book", id: "BLOG_LIST" }],
      transformResponse: (response) => ({
        data: response.data,
        total: response.total,
        page: response.page,
        pages: response.pages,
      }),
    }),

    getBlogDetails: builder.query({
      query: (blogId) => `blogs/${blogId}`,
      providesTags: (result, error, arg) => [{ type: "Book", id: arg }],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogDetailsQuery,
} = blogPublicApiSlice;

export const blogApiSlice = apiTwo.injectEndpoints({
  endpoints: (builder) => ({
    createBlog: builder.mutation({
      query: (newBlog) => ({
        url: `blogs`,
        method: "POST",
        body: newBlog,
      }),
      invalidatesTags: [{ type: "Book", id: "BLOG_LIST" }],
    }),

    updateBlog: builder.mutation({
      query: ({ blogId, data }) => ({
        url: `blogs/${blogId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { blogId }) => [
        { type: "Book", id: blogId },
        { type: "Book", id: "BLOG_LIST" },
      ],
    }),

    deleteBlog: builder.mutation({
      query: (blogId) => ({
        url: `blogs/${blogId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Book", id: arg },
        { type: "Book", id: "BLOG_LIST" },
      ],
    }),
  }),
});

export const {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApiSlice;
