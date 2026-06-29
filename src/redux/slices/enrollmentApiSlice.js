import { apiTwo } from "./apiSlice";

export const enrollmentApiSlice = apiTwo.injectEndpoints({
  endpoints: (builder) => ({
    getMyEnrollments: builder.query({
      query: () => "enrollments",
      providesTags: (result) =>
        result && result.data
          ? [
              ...result.data.map(({ _id }) => ({ type: "Enrollment", id: _id })),
              { type: "Enrollment", id: "LIST" },
            ]
          : [{ type: "Enrollment", id: "LIST" }],
    }),

    getEnrollment: builder.query({
      query: (courseId) => `enrollments/${courseId}`,
      providesTags: (result, error, courseId) => [
        { type: "Enrollment", id: courseId },
      ],
    }),

    toggleLessonCompletion: builder.mutation({
      query: ({ courseId, lessonId }) => ({
        url: `enrollments/${courseId}/lessons/${lessonId}/toggle`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Enrollment", id: courseId },
        { type: "Enrollment", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetMyEnrollmentsQuery,
  useGetEnrollmentQuery,
  useToggleLessonCompletionMutation,
} = enrollmentApiSlice;
