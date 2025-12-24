import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import type { RootState } from "../../store/store";
import ClinicLogo from "../../components/ClinicLogo"; // <-- NEW LOGO

const AdminLoginPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect if already authenticated
  if (isAuthenticated) {
      setTimeout(() => navigate("/admin/dashboard"), 100);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
        await dispatch(login({ username, password }) as any).unwrap();
        navigate("/admin/dashboard");
    } catch (err) {
        setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <div className="mb-4">
          <Link
            to="/"
            className="inline-block text-teal-700 border border-teal-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-50 transition shadow-sm"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Logo + Title */}
        <div className="text-center mb-10">
          <div className="mx-auto flex items-center justify-center">
            <ClinicLogo className="w-28 h-28 md:w-32 md:h-32" />
          </div>

          <h1 className="text-2xl font-bold mt-4 text-gray-900">
            {t("clinicName")}
          </h1>
          <p className="text-gray-500">{t("admin.login")}</p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100"
        >
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.username")}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                outline-none transition text-gray-700"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("admin.password")}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl 
                focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                outline-none transition text-gray-700"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold 
              shadow-md hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : t("admin.login")}
            </button>
          </div>
        </form>

        {/* Demo Credentials */}
        <p className="text-center text-gray-500 text-sm mt-4 select-all">
          Demo Login —{" "}
          <span className="text-teal-600 font-medium">
            admin / sanjeevani123
          </span>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
