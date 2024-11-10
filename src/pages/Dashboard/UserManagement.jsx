import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useGetAllUsersQuery,
  useGetAllAdminsQuery,
  useGetAllManagersQuery,
  useCreateUserMutation,
  useCreateManagerMutation,
  useCreateAdminMutation,
  useUpdateUserMutation,
  useUpdateManagerMutation,
  useUpdateAdminMutation,
  useDeleteUserMutation,
  useDeleteManagerMutation,
  useDeleteAdminMutation,
  useGetCurrentLoginUserQuery,
} from "../../redux/reducers/user/userThunk";
import { useSelector } from "react-redux";

const UserTable = () => {

  const currentLoginUser = useSelector(state=>state.user.currentLoginUser)

  const [activeTab, setActiveTab] = useState("Users");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const editUserRef = useRef(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const { data: usersData } = useGetAllUsersQuery({},{skip:(currentLoginUser?.role !=="Admin" && currentLoginUser?.role !=="Manager")});
  const { data: adminsData } = useGetAllAdminsQuery({},{skip:currentLoginUser?.role !=="Admin"});
  const { data: managersData } = useGetAllManagersQuery({},{skip:currentLoginUser?.role !=="Admin"});

  const [createUser] = useCreateUserMutation();
  const [createManager] = useCreateManagerMutation();
  const [createAdmin] = useCreateAdminMutation();
  const [updateUser] = useUpdateUserMutation();
  const [updateManager] = useUpdateManagerMutation();
  const [updateAdmin] = useUpdateAdminMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [deleteManager] = useDeleteManagerMutation();
  const [deleteAdmin] = useDeleteAdminMutation();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery("");
  };

  const handleAddClick = () => {
    editUserRef.current = null;
    setModalOpen(true);
  };

  const handleEditClick = (user) => {
    editUserRef.current = user;
    setModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (activeTab === "Users") await deleteUser(userToDelete._id);
      if (activeTab === "Managers") await deleteManager(userToDelete._id);
      if (activeTab === "Admins") await deleteAdmin(userToDelete._id);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCloseModal = () => setModalOpen(false);
  const handleCloseDeleteModal = () => setDeleteModalOpen(false);

  const filterData = (data) =>
    data?.filter(
      (item) =>
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getCurrentData = () => {
    if (activeTab === "Admins") return filterData(adminsData);
    if (activeTab === "Managers") return filterData(managersData);
    return filterData(usersData);
  };

  // Formik and Yup setup
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: editUserRef.current?.name || "",
      email: editUserRef.current?.email || "",
      password: "",
      status: editUserRef.current?.status || "active",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: editUserRef.current
        ? Yup.string()
        : Yup.string().required("Password is required"),
      status: Yup.string().oneOf(["active", "inactive"]).required(),
    }),
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        if (editUserRef.current) {
          if (activeTab === "Users") {
            await updateUser({ ...values, id: editUserRef.current?._id });
          }
          if (activeTab === "Managers") {
            await updateManager({ ...values, id: editUserRef.current?._id });
          }
          if (activeTab === "Admins") {
            await updateAdmin({ ...values, id: editUserRef.current?._id });
          }
        } else {
          if (activeTab === "Users") await createUser(values);
          if (activeTab === "Managers") await createManager(values);
          if (activeTab === "Admins") await createAdmin(values);
        }
        handleCloseModal();
        formik.resetForm();
      } catch (error) {
        console.error("Error saving user:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const Tabs = currentLoginUser.role === "Admin" ? ["Users", "Admins", "Managers"] : ["Users"]
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

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

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 px-4 py-2 border border-gray-300 rounded-lg w-full"
      />

      {/* Add Button */}
      <button
        onClick={handleAddClick}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Add{" "}
        {activeTab === "Users"
          ? "User"
          : activeTab === "Admins"
          ? "Admin"
          : "Manager"}
      </button>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4 border-b">Name</th>
              <th className="py-3 px-4 border-b">Email</th>
              <th className="py-3 px-4 border-b">Status</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getCurrentData()?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{user.name}</td>
                <td className="py-3 px-4 border-b">{user.email}</td>
                <td className="py-3 px-4 border-b">{user.status}</td>
                <td className="py-3 px-4 border-b">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="text-blue-500 hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
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
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">
              {editUserRef.current
                ? `Edit ${editUserRef.current?.role}`
                : `Add ${activeTab.slice(0, -1)}`}
            </h3>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...formik.getFieldProps("name")}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.name}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...formik.getFieldProps("email")}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.email}
                  </div>
                )}
              </div>
              {!editUserRef.current && (
                <div className="mb-4">
                  <label htmlFor="password" className="block text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    {...formik.getFieldProps("password")}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.password}
                    </div>
                  )}
                </div>
              )}
              <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  {...formik.getFieldProps("status")}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={handleCloseDeleteModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              {userToDelete?.name || "this user"}?
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 bg-gray-300 rounded-lg mr-4"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
