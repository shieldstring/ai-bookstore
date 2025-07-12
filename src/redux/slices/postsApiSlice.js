import { apiTwo } from "./apiSlice";

export const postsApiSlice = apiTwo.injectEndpoints({
  endpoints: (builder) => ({
    // Query to get all posts (the social feed)
    getPosts: builder.query({
      query: ({ limit = 10, skip = 0 }) => `posts?limit=${limit}&skip=${skip}`,
      // Provides 'Post' tags for caching. When a post changes, this query can be re-fetched.
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Post", id: _id })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }],
    }),

    // Query to get a single post by ID (if you were to implement a PostDetailPage)
    getPostById: builder.query({
      query: (postId) => `posts/${postId}`,
      // Provides a specific 'Post' tag for this ID.
      providesTags: (result, error, arg) => [{ type: "Post", id: arg }],
    }),

    // Query to get saved posts
    getSavedPosts: builder.query({
      query: () => `posts/saved/all`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Post", id: _id })),
              { type: "Post", id: "SAVED" },
            ]
          : [{ type: "Post", id: "SAVED" }],
    }),
    // Query to get reported posts (admin only)
    getReportedPosts: builder.query({
      query: () => `posts/admin/reported`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Post", id: _id })),
              { type: "Post", id: "REPORTED" },
            ]
          : [{ type: "Post", id: "REPORTED" }],
    }),

    // Mutation to create a new post
    createPost: builder.mutation({
      query: (postData) => ({
        url: "posts",
        method: "POST",
        body: postData,
      }),
      // Invalidates the 'LIST' tag, causing the `getPosts` query to refetch
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),

    // Mutation to like/unlike a post
    likeUnlikePost: builder.mutation({
      query: (postId) => ({
        url: `posts/${postId}/like`,
        method: "PUT",
      }),
      // Invalidates the specific post to refetch its updated like count
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg }],
      // Optional: optimistic update for faster UI response
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiTwo.util.updateQueryData("getPosts", undefined, (draft) => {
            // Find the post in the list and update its likes
            const postToUpdate = draft.find((post) => post._id === postId);
            if (postToUpdate) {
              const userId = localStorage.getItem("mockUserId"); // Get current user ID (mocked from AuthContext)
              if (userId) {
                if (postToUpdate.likes.includes(userId)) {
                  postToUpdate.likes = postToUpdate.likes.filter(
                    (id) => id !== userId
                  );
                } else {
                  postToUpdate.likes.push(userId);
                }
              }
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // Undo optimistic update on error
        }
      },
    }),

    // Mutation to add a comment to a post
    addCommentToPost: builder.mutation({
      query: ({ postId, text }) => ({
        url: `posts/${postId}/comments`,
        method: "POST",
        body: { text },
      }),
      // Invalidates the specific post to refetch its updated comments
      invalidatesTags: (result, error, arg) => [
        { type: "Post", id: arg.postId },
      ],
    }),

    // Mutation to delete a comment from a post
    deleteCommentFromPost: builder.mutation({
      query: ({ postId, commentId }) => ({
        url: `posts/${postId}/comments/${commentId}`,
        method: "DELETE",
      }),
      // Invalidates the specific post to refetch its updated comments
      invalidatesTags: (result, error, arg) => [
        { type: "Post", id: arg.postId },
      ],
    }),

    // Mutation to like/unlike a comment
    likeUnlikeComment: builder.mutation({
      query: ({ postId, commentId }) => ({
        url: `posts/${postId}/comments/${commentId}/like`,
        method: "PUT",
      }),
      // Invalidates the specific post to refetch its updated comments
      invalidatesTags: (result, error, arg) => [
        { type: "Post", id: arg.postId },
      ],
    }),

    // Mutation to reply to a comment
    replyComment: builder.mutation({
      query: ({ postId, commentId, text }) => ({
        url: `posts/${postId}/comments/${commentId}/reply`,
        method: "POST",
        body: { text },
      }),
      // Invalidates the specific post to refetch its updated comments
      invalidatesTags: (result, error, arg) => [
        { type: "Post", id: arg.postId },
      ],
    }),

    deletePost: builder.mutation({
      query: (postId) => ({
        url: `posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
      ],
    }),
    // Mutation to report a post
    reportPost: builder.mutation({
      query: (postId) => ({
        url: `posts/${postId}/report`,
        method: "POST",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Post", id: arg }],
    }),

    // Mutation to save/unsave a post
    toggleSavePost: builder.mutation({
      query: (postId) => ({
        url: `posts/${postId}/save`,
        method: "POST",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Post", id: arg },
        { type: "Post", id: "SAVED" },
      ],
    }),

    // Mutation to edit a post
    editPost: builder.mutation({
      query: ({ id, ...postData }) => ({
        url: `posts/${id}`,
        method: "PUT",
        body: postData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Post", id: arg.id },
        { type: "Post", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for your components to use
export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useEditPostMutation,
  useLikeUnlikePostMutation,
  useAddCommentToPostMutation,
  useReportPostMutation,
  useToggleSavePostMutation,
  useDeleteCommentFromPostMutation,
  useLikeUnlikeCommentMutation,
  useReplyCommentMutation,
  useDeletePostMutation,
  useGetReportedPostsQuery,
  useGetSavedPostsQuery,
} = postsApiSlice;
