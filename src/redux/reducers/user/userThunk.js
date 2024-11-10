"use client";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../../baseURL";

export const userApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["User", "CurrentLoginUser"],
  reducerPath: "userApi",
  endpoints: (build) => ({
    // Authentication endpoints
    loginUser: build.mutation({
      query: (user) => ({
        url: `/auth/login`,
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["User"],
    }),
    getCurrentLoginUser: build.query({
      query: () => `/auth/currentLoginUser`,
      providesTags: ["CurrentLoginUser"],
    }),

    // CRUD endpoints for users
    createUser: build.mutation({
      query: (newUser) => ({
        url: `/regular-user/create-user`,
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["User"],
    }),
    getAllUsers: build.query({
      query: () => `/regular-user/getAll`,
      providesTags: ["User"],
    }),
    searchUser: build.query({
      query: (query) => `/auth/search?query=${query}`,
      providesTags: ["User"],
    }),
    updateUser: build.mutation({
      query: ({ id, ...updatedUserData }) => ({
        url: `/regular-user/updateUser/${id}`,
        method: "PUT",
        body: updatedUserData,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: build.mutation({
      query: (id) => ({
        url: `/regular-user/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // CRUD endpoints for managers
    createManager: build.mutation({
      query: (newManager) => ({
        url: `/manager/create-manager`,
        method: "POST",
        body: newManager,
      }),
      invalidatesTags: ["User"],
    }),
    getAllManagers: build.query({
      query: () => `/manager/getAll`,
      providesTags: ["User"],
    }),
    updateManager: build.mutation({
      query: ({ id, ...updatedManagerData }) => ({
        url: `/manager/update/${id}`,
        method: "PUT",
        body: updatedManagerData,
      }),
      invalidatesTags: ["User"],
    }),
    deleteManager: build.mutation({
      query: (id) => ({
        url: `/manager/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // CRUD endpoints for admins
    createAdmin: build.mutation({
      query: (newAdmin) => ({
        url: `/admin/create-admin`,
        method: "POST",
        body: newAdmin,
      }),
      invalidatesTags: ["User"],
    }),
    getAllAdmins: build.query({
      query: () => `/admin/getAll`,
      providesTags: ["User"],
    }),
    updateAdmin: build.mutation({
      query: ({ id, ...updatedAdminData }) => ({
        url: `/admin/admins/${id}`,
        method: "PUT",
        body: updatedAdminData,
      }),
      invalidatesTags: ["User"],
    }),
    deleteAdmin: build.mutation({
      query: (id) => ({
        url: `/admin/admins/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginUserMutation,
  useGetCurrentLoginUserQuery,
  useCreateUserMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useCreateManagerMutation,
  useGetAllManagersQuery,
  useUpdateManagerMutation,
  useDeleteManagerMutation,
  useCreateAdminMutation,
  useGetAllAdminsQuery,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
  useSearchUserQuery
} = userApi;
