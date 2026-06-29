import { apiOne, apiTwo } from "./apiSlice";

export const coursePublicApiSlice = apiOne.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: ({
        page = 1,
        limit = 8,
        category = "",
        search = "",
        sort = "newest",
      } = {}) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        if (category) params.append("category", category);
        if (search) params.append("keyword", search);
        if (sort) params.append("sort", sort);

        return `/courses?${params.toString()}`;
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

    getCourseDetails: builder.query({
      query: (courseId) => `courses/${courseId}`,
      providesTags: (result, error, arg) => [{ type: "Book", id: arg }],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseDetailsQuery,
} = coursePublicApiSlice;

export const courseApiSlice = apiTwo.injectEndpoints({
  endpoints: (builder) => ({
    getSellerCourses: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.category) queryParams.append("category", params.category);
        return `courses/my-courses?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: "Book", id: _id })),
              { type: "Book", id: "LIST" },
            ]
          : [{ type: "Book", id: "LIST" }],
    }),

    addCourse: builder.mutation({
      query: (newCourse) => ({
        url: `courses`,
        method: "POST",
        body: newCourse,
      }),
      invalidatesTags: [{ type: "Book", id: "LIST" }],
    }),

    updateCourse: builder.mutation({
      query: ({ productId, data }) => ({
        url: `courses/${productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [
        { type: "Book", id: productId },
        { type: "Book", id: "LIST" },
      ],
    }),

    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `courses/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Book", id: arg },
        { type: "Book", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetSellerCoursesQuery,
  useAddCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApiSlice;
