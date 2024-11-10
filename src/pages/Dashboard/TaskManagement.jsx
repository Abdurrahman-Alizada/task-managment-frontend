import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
// import { Search, X } from "lucide-react";
import {
  useGetAllTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useAddAssignedUserMutation,
  useRemoveAssignedUserMutation,
  useGetUserTaskQuery,
} from "../../redux/reducers/task/taskThunk";
import { useSearchUserQuery } from "../../redux/reducers/user/userThunk";
import { useSelector } from "react-redux";

const TaskTable = () => {
  const [activeTab, setActiveTab] = useState("My Tasks");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAssignModalOpen, setAssignModalOpen] = useState(false);
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const editTaskRef = useRef(null);
  const searchTimeout = useRef(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const currentLoginUser = useSelector((state) => state.user.currentLoginUser);

  const { data: allTasksData } = useGetAllTasksQuery(
    {},
    {
      skip: currentLoginUser?.role == "User",
    }
  );
  const { data: MyTask } = useGetUserTaskQuery();
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [addAssignedUser] = useAddAssignedUserMutation();
  const [removeAssignedUser] = useRemoveAssignedUserMutation();

  const { data: searchResults, isLoading: isSearching } = useSearchUserQuery(
    searchUserQuery ? { query: searchUserQuery } : undefined,
    { skip: !searchUserQuery }
  );

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
  };

  const handleAddClick = () => {
    editTaskRef.current = null;
    setModalOpen(true);
  };

  const handleEditClick = (task) => {
    editTaskRef.current = task;
    setModalOpen(true);
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setDeleteModalOpen(true);
  };

  const handleAssignClick = (task) => {
    setSelectedTask(task);
    setSelectedUsers([]);
    setSearchUserQuery("");
    setAssignModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTask(taskToDelete._id);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleSearchUser = (e) => {
    const value = e.target.value;
    setSearchUserQuery(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (value.length >= 2) {
        setSearchUserQuery(value);
      }
    }, 300);
  };

  const handleSelectUser = async (user) => {
    try {
      await addAssignedUser({
        taskId: selectedTask._id,
        userId: user._id,
        modelType: user.role,
      });
      setSearchUserQuery("");
      setSelectedUsers([...selectedUsers, user]);
    } catch (error) {
      console.error("Error assigning user:", error);
    }
  };

  const handleRemoveUser = async (taskId, userId) => {
    try {
      await removeAssignedUser({ taskId, userId });
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const handleCloseModal = () => setModalOpen(false);
  const handleCloseDeleteModal = () => setDeleteModalOpen(false);
  const handleCloseAssignModal = () => setAssignModalOpen(false);

  const filterData = (data) =>
    data?.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // const getCurrentData = () => filterData(allTasksData);
  const getCurrentData = () => {
    if (activeTab === "All Tasks") return filterData(allTasksData);
    if (activeTab === "My Tasks") return filterData(MyTask);
    return filterData(MyTask);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: editTaskRef.current?.title || "",
      description: editTaskRef.current?.description || "",
      dueDate: editTaskRef.current?.dueDate?.split("T")[0] || "",
      status: editTaskRef.current?.status || "pending",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      dueDate: Yup.date().required("Due date is required"),
      status: Yup.string()
        .oneOf(["pending", "in-progress", "completed"])
        .required(),
    }),
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        if (editTaskRef.current) {
          await updateTask({ ...values, id: editTaskRef.current?._id });
        } else {
          await createTask(values);
        }
        handleCloseModal();
        formik.resetForm();
      } catch (error) {
        console.error("Error saving task:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const Tabs =
    currentLoginUser.role === "Admin" || currentLoginUser.role === "Manager"
      ? ["My Tasks", "All Tasks"]
      : ["My Tasks"];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Task Management</h2>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b-2 border-gray-300">
        {Tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`py-2 px-4 ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-500 font-semibold"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search and Add Section */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by title or description"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4 border-b">Title</th>
              <th className="py-3 px-4 border-b">Description</th>
              <th className="py-3 px-4 border-b">Due Date</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Assigned Users</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentData()?.map((task) => (
              <tr key={task._id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{task.title}</td>
                <td className="py-3 px-4 border-b">{task.description}</td>
                <td className="py-3 px-4 border-b">
                  {new Date(task.dueDate).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 border-b">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : task.status === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
                <td className="py-3 px-4 border-b">
                  <div className="flex flex-wrap gap-2">
                    {task.assignedTo?.map((assigned) => (
                      <div
                        key={assigned?.userId?._id}
                        className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
                      >
                        <span className="text-sm">{assigned?.userId?.name}</span>
                        {(currentLoginUser?.role == "Admin" ||
                          currentLoginUser?.role == "Manager") && (
                          <button
                            onClick={() => {
                              handleRemoveUser(task?._id, assigned?.userId?._id);
                            }}
                            className="text-red-500 hover:text-red-700 ml-1"
                          >
                            X
                          </button>
                        )}
                      </div>
                    ))}
                    {(currentLoginUser?.role === "Admin" ||
                      currentLoginUser?.role === "Manager") && (
                      <button
                        onClick={() => handleAssignClick(task)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        + Assign
                      </button>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 border-b">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(task)}
                      className="text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(task)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {getCurrentData()?.length === 0 && (
        <p className="mt-4 text-center text-gray-500">
          No results found for "{searchQuery}"
        </p>
      )}

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              {/* <X size={20} /> */}X
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editTaskRef.current ? "Edit Task" : "Add Task"}
            </h2>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                {formik.errors.title && formik.touched.title && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.title}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                {formik.errors.description && formik.touched.description && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.description}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Due Date
                </label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formik.values.dueDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                />
                {formik.errors.dueDate && formik.touched.dueDate && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.dueDate}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                {formik.errors.status && formik.touched.status && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.status}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={handleCloseDeleteModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              {/* <X size={20} /> */}X
            </button>
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this task?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign User Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={handleCloseAssignModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              {/* <X size={20} /> */}X
            </button>
            <h2 className="text-xl font-semibold mb-4">Assign Users</h2>

            {/* Search Input */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchUserQuery}
                onChange={handleSearchUser}
                placeholder="Search users by name or email..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md"
              />
              {/* <Search className="absolute right-3 top-2.5 text-gray-400" size={20} /> */}
            </div>

            {/* Loading State */}
            {isSearching && (
              <div className="text-center py-4 text-gray-500">
                Searching users...
              </div>
            )}

            {/* Search Results */}
            {searchUserQuery && searchResults?.results?.length > 0 && (
              <div className="mb-4 max-h-48 overflow-y-auto border border-gray-200 rounded-md">
                {searchResults.results.map((user) => {
                  const isAlreadyAssigned = selectedTask.assignedTo?.some(
                    (assigned) => assigned?.userId?._id === user?._id
                  );

                  return (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 border-b last:border-b-0"
                    >
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                        <div className="text-xs text-gray-400">{user.role}</div>
                      </div>
                      <button
                        onClick={() => handleSelectUser(user)}
                        disabled={isAlreadyAssigned}
                        className={`px-3 py-1 rounded-md text-sm ${
                          isAlreadyAssigned
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                      >
                        {isAlreadyAssigned ? "Assigned" : "Assign"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* No Results Message */}
            {searchUserQuery &&
              searchResults?.results?.length === 0 &&
              !isSearching && (
                <div className="text-center py-4 text-gray-500">
                  No users found matching "{searchUserQuery}"
                </div>
              )}

            {/* Currently Assigned Users */}
            {selectedTask?.assignedTo?.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Assigned Users:</h3>
                <div className="space-y-2">
                  {selectedTask.assignedTo.map((assigned) => (
                    <div
                      key={assigned?.userId?._id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
                      <div>
                        <div className="font-medium">
                          {assigned?.userId?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {assigned?.userId?.email}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleRemoveUser(
                            selectedTask._id,
                            assigned?.userId?._id
                          )
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        X{/* <X size={20} /> */}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={handleCloseAssignModal}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
