import { apiTwo } from "./apiSlice";

export const postsApiSlice = apiTwo.injectEndpoints({
  endpoints: (builder) => ({
    // Query to get all posts (the social feed)
    getPosts: builder.query({
      query: ({ limit = 10, skip = 0, userId, tag } = {}) => {
        let url = `posts?limit=${limit}&skip=${skip}`;
        if (userId) url += `&userId=${userId}`;
        if (tag) url += `&tag=${tag}`;
        return url;
      },
      // Enhanced tag structure for better cache granularity
      providesTags: (result, error, arg) => {
        const tags = [{ type: "Post", id: "LIST" }];
        
        if (result) {
          // Add specific post tags
          result.forEach(post => {
            tags.push({ type: "Post", id: post._id });
            // Add user-specific tags for better cache management
            if (post.author) {
              tags.push({ type: "Post", id: `USER_${post.author}` });
            }
          });
          
          // Add parameter-specific tags for filtered queries
          if (arg?.userId) {
            tags.push({ type: "Post", id: `USER_POSTS_${arg.userId}` });
          }
          if (arg?.tag) {
            tags.push({ type: "Post", id: `TAG_${arg.tag}` });
          }
        }
        
        return tags;
      },
      // Keep cache for 5 minutes for better performance
      keepUnusedDataFor: 300,
    }),

    // Query to get a single post by ID
    getPostById: builder.query({
      query: (postId) => `posts/${postId}`,
      providesTags: (result, error, postId) => [
        { type: "Post", id: postId },
        ...(result?.author ? [{ type: "Post", id: `USER_${result.author}` }] : []),
      ],
      // Longer cache for individual posts
      keepUnusedDataFor: 600,
    }),

    // Query to get posts by user
    getUserPosts: builder.query({
      query: (userId) => `posts/user/${userId}`,
      providesTags: (result, error, userId) => [
        { type: "Post", id: `USER_POSTS_${userId}` },
        { type: "Post", id: `USER_${userId}` },
        ...(result ? result.map(post => ({ type: "Post", id: post._id })) : []),
      ],
    }),

    // Query to get saved posts
    getSavedPosts: builder.query({
      query: () => `posts/saved/all`,
      providesTags: (result) => [
        { type: "Post", id: "SAVED" },
        ...(result ? result.map(post => ({ type: "Post", id: post._id })) : []),
      ],
    }),

    // Query to get reported posts (admin only)
    getReportedPosts: builder.query({
      query: () => `posts/admin/reported`,
      providesTags: (result) => [
        { type: "Post", id: "REPORTED" },
        ...(result ? result.map(post => ({ type: "Post", id: post._id })) : []),
      ],
    }),

    // Mutation to create a new post
    createPost: builder.mutation({
      query: (postData) => ({
        url: "posts",
        method: "POST",
        body: postData,
      }),
      // Enhanced invalidation with optimistic updates
      invalidatesTags: (result, error, postData) => [
        { type: "Post", id: "LIST" },
        ...(postData.author ? [{ type: "Post", id: `USER_POSTS_${postData.author}` }] : []),
        ...(postData.tags ? postData.tags.map(tag => ({ type: "Post", id: `TAG_${tag}` })) : []),
      ],
      // Optimistic update for create
      async onQueryStarted(postData, { dispatch, queryFulfilled, getState }) {
        const tempId = `temp_${Date.now()}`;
        const tempPost = {
          _id: tempId,
          ...postData,
          likes: [],
          comments: [],
          createdAt: new Date().toISOString(),
          isOptimistic: true,
        };

        // Optimistically add to main feed
        const patchResult = dispatch(
          apiTwo.util.updateQueryData("getPosts", undefined, (draft) => {
            draft.unshift(tempPost);
          })
        );

        try {
          const { data: newPost } = await queryFulfilled;
          // Replace optimistic post with real one
          dispatch(
            apiTwo.util.updateQueryData("getPosts", undefined, (draft) => {
              const index = draft.findIndex(post => post._id === tempId);
              if (index !== -1) {
                draft[index] = newPost;
              }
            })
          );
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Mutation to like/unlike a post
    likeUnlikePost: builder.mutation({
      query: (postId) => ({
        url: `posts/${postId}/like`,
        method: "PUT",
      }),
      // Selective invalidation - only invalidate specific post
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
      ],
      // Enhanced optimistic update
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const userId = localStorage.getItem("mockUserId");
        if (!userId) return;

        const patches = [];

        // Update all relevant queries that might contain this post
        const queryKeys = [
          { endpointName: "getPosts", args: undefined },
          { endpointName: "getSavedPosts", args: undefined },
          { endpointName: "getPostById", args: postId },
        ];

        queryKeys.forEach(({ endpointName, args }) => {
          const patch = dispatch(
            apiTwo.util.updateQueryData(endpointName, args, (draft) => {
              const updatePost = (post) => {
                if (post._id === postId) {
                  if (post.likes.includes(userId)) {
                    post.likes = post.likes.filter(id => id !== userId);
                  } else {
                    post.likes.push(userId);
                  }
                }
              };

              if (Array.isArray(draft)) {
                draft.forEach(updatePost);
              } else if (draft && draft._id === postId) {
                updatePost(draft);
              }
            })
          );
          patches.push(patch);
        });

        try {
          await queryFulfilled;
        } catch {
          patches.forEach(patch => patch.undo());
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
      // Force refetch by invalidating all related caches
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
        { type: "Post", id: "LIST" },
        { type: "Post", id: "SAVED" },
      ],
    }),

    // Mutation to delete a comment from a post
    deleteCommentFromPost: builder.mutation({
      query: ({ postId, commentId }) => ({
        url: `posts/${postId}/comments/${commentId}`,
        method: "DELETE",
      }),
      // Force refetch by invalidating all related caches
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
        { type: "Post", id: "LIST" },
        { type: "Post", id: "SAVED" },
      ],
    }),

    // Mutation to like/unlike a comment
    likeUnlikeComment: builder.mutation({
      query: ({ postId, commentId }) => ({
        url: `posts/${postId}/comments/${commentId}/like`,
        method: "PUT",
      }),
      // Force refetch by invalidating all related caches
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
        { type: "Post", id: "LIST" },
        { type: "Post", id: "SAVED" },
      ],
    }),

    // Mutation to reply to a comment
    replyComment: builder.mutation({
      query: ({ postId, commentId, text }) => ({
        url: `posts/${postId}/comments/${commentId}/reply`,
        method: "POST",
        body: { text },
      }),
      // Force refetch by invalidating all related caches
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
        { type: "Post", id: "LIST" },
        { type: "Post", id: "SAVED" },
      ],
    }),

    // Mutation to delete a post
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
        { type: "Post", id: "LIST" },
        { type: "Post", id: "SAVED" },
        { type: "Post", id: "REPORTED" },
      ],
      // Optimistic deletion
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const patches = [];

        ["getPosts", "getSavedPosts", "getReportedPosts"].forEach(endpointName => {
          const patch = dispatch(
            apiTwo.util.updateQueryData(endpointName, undefined, (draft) => {
              const index = draft.findIndex(post => post._id === postId);
              if (index !== -1) {
                draft.splice(index, 1);
              }
            })
          );
          patches.push(patch);
        });

        try {
          await queryFulfilled;
        } catch {
          patches.forEach(patch => patch.undo());
        }
      },
    }),

    // Mutation to report a post
    reportPost: builder.mutation({
      query: (postId) => ({
        url: `posts/${postId}/report`,
        method: "POST",
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
        { type: "Post", id: "REPORTED" },
      ],
    }),

    // Mutation to save/unsave a post
    toggleSavePost: builder.mutation({
      query: (postId) => ({
        url: `posts/${postId}/save`,
        method: "POST",
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
        { type: "Post", id: "SAVED" },
      ],
      // Optimistic save/unsave
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const userId = localStorage.getItem("mockUserId");
        
        // Update main posts query
        const postsPatch = dispatch(
          apiTwo.util.updateQueryData("getPosts", undefined, (draft) => {
            const post = draft.find(p => p._id === postId);
            if (post) {
              if (post.savedBy && post.savedBy.includes(userId)) {
                post.savedBy = post.savedBy.filter(id => id !== userId);
              } else {
                post.savedBy = post.savedBy || [];
                post.savedBy.push(userId);
              }
            }
          })
        );

        // Update saved posts query
        const savedPatch = dispatch(
          apiTwo.util.updateQueryData("getSavedPosts", undefined, (draft) => {
            const existingIndex = draft.findIndex(p => p._id === postId);
            if (existingIndex !== -1) {
              // Remove from saved
              draft.splice(existingIndex, 1);
            }
            // Note: Adding to saved list would require the full post data
          })
        );

        try {
          await queryFulfilled;
        } catch {
          postsPatch.undo();
          savedPatch.undo();
        }
      },
    }),

    // Mutation to edit a post
    editPost: builder.mutation({
      query: ({ id, ...postData }) => ({
        url: `posts/${id}`,
        method: "PUT",
        body: postData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Post", id },
      ],
      // Optimistic edit
      async onQueryStarted({ id, ...postData }, { dispatch, queryFulfilled }) {
        const patches = [];

        ["getPosts", "getPostById", "getSavedPosts"].forEach(endpointName => {
          const patch = dispatch(
            apiTwo.util.updateQueryData(endpointName,
              endpointName === "getPostById" ? id : undefined,
              (draft) => {
                const updatePost = (post) => {
                  if (post._id === id) {
                    Object.assign(post, postData);
                  }
                };

                if (Array.isArray(draft)) {
                  draft.forEach(updatePost);
                } else if (draft && draft._id === id) {
                  updatePost(draft);
                }
              }
            )
          );
          patches.push(patch);
        });

        try {
          await queryFulfilled;
        } catch {
          patches.forEach(patch => patch.undo());
        }
      },
    }),

    // Utility mutation to refresh specific post data
    refreshPost: builder.mutation({
      queryFn: () => ({ data: null }),
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
      ],
    }),

    // Utility mutation to clear all post cache
    clearPostsCache: builder.mutation({
      queryFn: () => ({ data: null }),
      invalidatesTags: ["Post"],
    }),
  }),
});

// Export hooks for your components to use
export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useGetUserPostsQuery,
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
  useRefreshPostMutation,
  useClearPostsCacheMutation,
} = postsApiSlice;

// Utility function to manually invalidate specific cache entries
export const invalidatePostCache = (dispatch, postId) => {
  dispatch(
    apiTwo.util.invalidateTags([
      { type: "Post", id: postId },
      { type: "Post", id: "LIST" },
    ])
  );
};

// Utility function to manually update post in cache
export const updatePostInCache = (dispatch, postId, updateFn) => {
  dispatch(
    apiTwo.util.updateQueryData("getPostById", postId, updateFn)
  );
  dispatch(
    apiTwo.util.updateQueryData("getPosts", undefined, (draft) => {
      const post = draft.find(p => p._id === postId);
      if (post) updateFn(post);
    })
  );
};