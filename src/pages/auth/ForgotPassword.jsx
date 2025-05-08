import React, { useEffect, useState } from "react";
import { useForgotPasswordMutation } from "../../redux/slices/authSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import SEO from "../../components/SEO";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
  });
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword(credentials);
      toast.success(res?.data?.msg);
      if (res.status === 200) {
        setModal(true);
      } else {
        toast.error(res?.error.data?.msg);
      }
    } catch (err) {
      toast.error(err?.data?.msg || err.error);
    }
  };

  return (
    <>
      <SEO
        title="Forgot Password"
        description="AI-Powered Social-Ecommerce Platform is a comprehensive system integrating eCommerce, social networking, and MLM for book sales, community engagement, and earning opportunities."
        name="AI-Powered Social-Ecommerce"
        type="description"
      />
      <div className=" flex items-center justify-center bg-gray-50 py-12 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Forgot Password
            </h2>
            <p className="mt-2 text-sm text-[#495454] font-light ">
              Enter your email below to recieve a password reset link.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error.data?.message || "Invalid email or password"}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Submiting...
                  </>
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </form>

          <div className="text-center text-sm mt-4">
            <span className="text-gray-600"> Remember Now? </span>
            <Link
              to="/login"
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 z-[150] overflow-y-auto bg-[#000000]/50 ">
          <div className="flex items-end justify-center sm:min-h-screen px-4 pt-12 pb-20 text-center sm:block sm:p-0">
            <span
              className="hidden sm:inline-block sm:h-screen sm:align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="relative inline-block px-4 pt-5 pb-4 overflow-hidden text-center align-bottom transition-all transform bg-white rounded-2xl shadow-xl  top-20 md:top-0 sm:my-8 w-full sm:max-w-md sm:p-6 md:p-8 sm:align-middle">
              <div className="py-4 space-y-5 justify-center">
                <img src="../Mailsent.svg" className="mx-auto w-36" alt="i" />
                <h3
                  className="text-2xl lg:text-4xl  font-bold leading-6 text-gray-800 capitalize "
                  id="modal-title"
                >
                  Recovery Mail Sent
                </h3>
                <p className="mt-2 text-sm text-[#495454] font-light ">
                  A password recovery link has been sent to your mail. click on
                  the link to recover mail.
                </p>

                <div className="flex flex-col space-y-5 w-full">
                  <button
                    onClick={() => {
                      setModal(false);
                      navigate("/login");
                    }}
                    className="w-full bg-[#CC080B] rounded-lg p-3 text-white font-semibold transition duration-200 hover:bg-[#757E7E]"
                  >
                    Open Mail
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgotPassword;
