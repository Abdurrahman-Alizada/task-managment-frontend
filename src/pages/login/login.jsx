import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLoginUserMutation } from "../../redux/reducers/user/userThunk";

// Validation Schema
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = ({ onLogin }) => {
  const [loginError, setLoginError] = useState("");
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setLoginError("");
      await onLogin(values);  // Delegates login handling to App.js
      resetForm();
    } catch (error) {
      setLoginError(
        error.data?.message || "Login failed. Please check your credentials."
      );
      console.error("Login error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Custom Error Message component
  const CustomErrorMessage = ({ name }) => (
    <ErrorMessage
      name={name}
      component="p"
      className="mt-1 text-sm text-red-600"
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Task Management System
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to continue
          </p>
        </div>

        {/* Main Card */}
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {/* Error Message */}
            {loginError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                <p className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {loginError}
                </p>
              </div>
            )}

            {/* Login Form */}
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, touched, errors }) => (
                <Form className="space-y-6">
                  {/* Email Field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <div className="mt-1">
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        className={`appearance-none block w-full px-3 py-2 border ${
                          touched.email && errors.email
                            ? 'border-red-300'
                            : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="admin@example.com"
                        disabled={isLoading || isSubmitting}
                      />
                      <CustomErrorMessage name="email" />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="mt-1">
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        className={`appearance-none block w-full px-3 py-2 border ${
                          touched.password && errors.password
                            ? 'border-red-300'
                            : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="••••••••"
                        disabled={isLoading || isSubmitting}
                      />
                      <CustomErrorMessage name="password" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={isLoading || isSubmitting}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {(isLoading || isSubmitting) ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing in...
                        </div>
                      ) : (
                        'Sign in'
                      )}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
