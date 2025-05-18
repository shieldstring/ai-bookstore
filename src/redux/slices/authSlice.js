import { createSlice } from "@reduxjs/toolkit";
import { apiOne, apiTwo } from "./apiSlice";
import { handleLoginSuccess } from "./cartThunks";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredential: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
      handleLoginSuccess();

      const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days
      localStorage.setItem("expirationTime", expirationTime);
    },
    logout: (state, action) => {
      state.userInfo = null;
      // NOTE: here we need to also remove the cart from storage so the next
      // logged in user doesn't inherit the previous users cart and shipping
      localStorage.clear();
    },
  },
});

export const { setCredential, logout } = authSlice.actions;

export default authSlice.reducer;

// RTK Query endpoints for auth
export const authApiSlice = apiOne.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    // Add endpoint for checking Google OAuth authentication status
    checkGoogleAuthStatus: builder.query({
      query: () => "auth/check-google-auth-status",
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: "auth/register",
        method: "POST",
        body: userData,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (credentials) => ({
        url: "auth/forgot-password",
        method: "POST",
        body: credentials,
      }),
    }),
    resetPassword: builder.mutation({
      query: (token, password) => ({
        url: `auth/reset-password/${token}`,
        method: "POST",
        body: password,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useForgotPasswordMutation,
  useCheckGoogleAuthStatusQuery,
} = authApiSlice;

export const authApiAuthSlice = apiTwo.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query({
      query: () => `admin`,
      providesTags: (result, error, arg) => [{ type: "Admin", id: arg }],
    }),
    getUserDashboard: builder.query({
      query: () => `users/profile`,
      providesTags: [{ type: "User", id: "CURRENT" }],
    }),
    getReferralStats: builder.query({
      query: () => `users/referral-stats`,
      providesTags: (arg) => [{ type: "User", id: arg }],
    }),
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "users/profile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: [{ type: "User", id: "CURRENT" }], // This will auto-refresh getUserDashboard
    }),
    // Admin user management endpoints
    getAllUsers: builder.query({
      query: () => `admin/users`,
      providesTags: ["Users"],
    }),
    getUserById: builder.query({
      query: (id) => `admin/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `admin/users/${id}/role`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ["Users", (result, error, arg) => [{ type: "User", id: arg.id }]],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `admin/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAdminDashboardQuery,
  useGetUserDashboardQuery,
  useGetReferralStatsQuery,
  useUpdateProfileMutation,
} = authApiAuthSlice;
