import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const resetPassword = async () => {
    const res = await fetch("http://localhost:5000/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Password reset successful");
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-96 shadow">
        <h2 className="text-xl font-bold mb-3">Reset Password</h2>

        <input
          type="password"
          placeholder="New password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <button
          onClick={resetPassword}
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
