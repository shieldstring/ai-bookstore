import { apiSlice } from '../../apiSlice';

export const groupApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query({
      query: ({ page = 1, limit = 10, category = '', search = '' }) => 
        `/groups?page=${page}&limit=${limit}&category=${category}&search=${search}`,
      providesTags: ['Group'],
    }),
    getGroupDetails: builder.query({
      query: (groupId) => `/groups/${groupId}`,
      providesTags: (result, error, arg) => [{ type: 'Group', id: arg }],
    }),
    createGroup: builder.mutation({
      query: (groupData) => ({
        url: '/groups',
        method: 'POST',
        body: groupData,
      }),
      invalidatesTags: ['Group'],
    }),
    joinGroup: builder.mutation({
      query: (groupId) => ({
        url: `/groups/${groupId}/join`,
        method: 'POST',
      }),
      invalidatesTags: ['Group'],
    }),
    leaveGroup: builder.mutation({
      query: (groupId) => ({
        url: `/groups/${groupId}/leave`,
        method: 'POST',
      }),
      invalidatesTags: ['Group'],
    }),
    createGroupPost: builder.mutation({
      query: ({ groupId, content }) => ({
        url: `/groups/${groupId}/posts`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: ['Post'],
    }),
  }),
});

export const {
  useGetGroupsQuery,
  useGetGroupDetailsQuery,
  useCreateGroupMutation,
  useJoinGroupMutation,
  useLeaveGroupMutation,
  useCreateGroupPostMutation,
} = groupApiSlice;