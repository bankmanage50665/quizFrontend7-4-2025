import React, { useState } from "react";
import axios from "axios";

const LoginWithOtp = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // 'phone' or 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendMessage, setResendMessage] = useState(false);

  // Request OTP function
  const requestOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate phone number
      if (!phoneNumber || phoneNumber.length < 10) {
        throw new Error("Please enter a valid phone number");
      }

      // API call to send OTP
      const response = await axios.post(
        "http://localhost:3000/api/user/request-otp",
        { phoneNumber }
      );

      if (response.data.success) {
        setStep("otp");
      } else {
        throw new Error(response.data.message || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate OTP
      if (!otp || otp.length < 4) {
        throw new Error("Please enter a valid OTP");
      }

      // API call to verify OTP
      const response = await axios.post(
        "http://localhost:3000/api/user/verify-otp",
        {
          phoneNumber,
          otp,
        }
      );

      if (response.data.success) {
        // Store user data correctly
        localStorage.setItem("userId", response.data.user.id);
        localStorage.setItem("token", response.data.token);

        // Now retrieve to use or verify (if needed)
        const storedUserId = localStorage.getItem("userId");
        const storedToken = localStorage.getItem("token");

        

        setSuccess(true);
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        throw new Error(response.data.message || "Invalid OTP");
      }
    } catch (err) {
      setError(err.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP function
  const resendOTP = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/request-otp",
        {
          phoneNumber,
        }
      );

      if (response.data.success) {
        setResendMessage(true);
        setTimeout(() => setResendMessage(false), 3000);
      } else {
        throw new Error(response.data.message || "Failed to resend OTP");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 transition-all duration-300">
        {/* Logo or icon could go here */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-center text-white">
            {step === "phone" ? "Login" : "Verification"}
          </h2>
          <p className="text-gray-400 text-center mt-2">
            {step === "phone"
              ? "Enter your phone number to continue"
              : `Enter the code sent to ${phoneNumber}`}
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/40 text-red-200 rounded-lg border border-red-700/50 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/40 text-green-200 rounded-lg border border-green-700/50 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Login successful! Redirecting...
          </div>
        )}

        {resendMessage && (
          <div className="mb-6 p-4 bg-blue-900/40 text-blue-200 rounded-lg border border-blue-700/50 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            OTP resent successfully!
          </div>
        )}

        {/* Form */}
        {step === "phone" ? (
          <form onSubmit={requestOTP} className="space-y-6">
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-gray-300 mb-2 font-medium"
              >
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  id="phoneNumber"
                  className="w-full p-4 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white text-lg transition-all"
                  placeholder="Your 10-digit number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all text-lg font-medium shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </span>
              ) : (
                "Get Verification Code"
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOTP} className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-gray-300 mb-2 font-medium"
              >
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                className="w-full p-4 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700/50 text-white text-lg tracking-widest text-center transition-all"
                placeholder="Enter code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all text-lg font-medium shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify & Login"
              )}
            </button>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-2 space-y-3 sm:space-y-0">
              <button
                type="button"
                onClick={resendOTP}
                className="text-blue-400 hover:text-blue-300 focus:outline-none transition-colors flex items-center"
                disabled={loading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Resend Code
              </button>

              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-gray-400 hover:text-gray-300 focus:outline-none transition-colors flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 17l-5-5m0 0l5-5m-5 5h12"
                  />
                </svg>
                Change Number
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginWithOtp;
