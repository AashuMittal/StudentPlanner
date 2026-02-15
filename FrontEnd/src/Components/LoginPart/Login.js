import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoginUser } from "../../utils/api";
import { LoginImg } from "../../utils/imgLink";
import { showError, showSuccess } from "../../utils/toast";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await LoginUser(email, password);

        if (res.success === false) {
            showError(res.message);
        } else {
            localStorage.setItem("token", res.token);
               localStorage.setItem("user", JSON.stringify(res.user));

            showSuccess("Login successful!");
            navigate("/dashboard");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <LoginImg />
                <h2 className="text-3xl font-bold text-center m-4">Welcome Back 👋</h2>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />

                    <Link
                        to="/forgot-password"
                        className="block text-right text-sm text-indigo-600 hover:underline"
                    >
                        Forgot password?
                    </Link>

                    <button
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-6">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-indigo-600 font-semibold">
                        Sign up
                    </Link>
                </p>
            </div>

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
}

export default Login;
