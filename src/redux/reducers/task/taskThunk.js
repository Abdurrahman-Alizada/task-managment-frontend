import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const taskApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:7000", // Adjust to your environment variable if needed
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Task"],
  reducerPath: "taskApi",
  endpoints: (build) => ({
    // CRUD endpoints for tasks
    createTask: build.mutation({
      query: (newTask) => ({
        url: `/tasks/create`,
        method: "POST",
        body: newTask,
      }),
      invalidatesTags: ["Task"],
    }),
    getAllTasks: build.query({
      query: () => `/tasks/getAll`,
      providesTags: ["Task"],
    }),
    getTaskById: build.query({
      query: (id) => `/tasks/getTaskById/${id}`,
      providesTags:["Task"],
    }),
    getDashboardStat: build.query({
      query: () => `/auth/getDashboardStats`,
      providesTags:["Task"],
    }),
    getUserTask: build.query({
      query: () => `/tasks/getUserTasks`,
      providesTags:["Task"],
    }),
    updateTask: build.mutation({
      query: ({ id, ...updatedTaskData }) => ({
        url: `/tasks/updateTask/${id}`,
        method: "PUT",
        body: updatedTaskData,
      }),
      invalidatesTags: ["Task"],
    }),
    deleteTask: build.mutation({
      query: (id) => ({
        url: `/tasks/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Task"],
    }),
    addAssignedUser: build.mutation({
      query: (task) => ({
        url: `/tasks/${task?.taskId}/assignUser`,
        method: "PUT",
        body: task,
      }),
      invalidatesTags: ["Task"],
    }),
    removeAssignedUser: build.mutation({
      query: (task) => ({
        url: `/tasks/${task.taskId}/unassignUser`,
        method: "PUT",
        body: task,
      }),
      invalidatesTags: ["Task"],
    }),
  }),
});

export const {
  useCreateTaskMutation,
  useGetAllTasksQuery,
  useGetTaskByIdQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useAddAssignedUserMutation,
  useRemoveAssignedUserMutation,
  useGetDashboardStatQuery,
  useGetUserTaskQuery
} = taskApi;
