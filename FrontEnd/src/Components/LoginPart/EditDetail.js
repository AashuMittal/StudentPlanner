import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UpdateUser } from "../../utils/api";
import { LoginImg } from "../../utils/imgLink";
import { showError, showSuccess } from "../../utils/toast";

function EditDetail() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const userId = JSON.parse(localStorage.getItem("user"))?._id;
  console.log(userId);
  

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await UpdateUser({...form,userId});

    if (res.success === false) {
      showError(res.message);
    } else {
      localStorage.setItem("token", res.token);
           localStorage.setItem("user", JSON.stringify(res.user));

      showSuccess("Account created successfully!");
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <LoginImg />
        <h2 className="text-3xl font-bold text-center m-4">Edit Your Detail 🚀</h2>

        <form className="space-y-4" onSubmit={handleSignup}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email address"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <button
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Creating..." : "Submit"}
          </button>
        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default EditDetail;
