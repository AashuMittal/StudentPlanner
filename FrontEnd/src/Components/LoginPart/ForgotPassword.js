import { useState } from "react";
import { ForgotPasswordApi } from "../../utils/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async () => {
    const res = await ForgotPasswordApi(email);
    setMsg(res.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96 shadow">
        <h2 className="text-xl font-bold mb-3">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-2 rounded"
        >
          Send Reset Link
        </button>

        {msg && <p className="text-sm mt-3 text-green-600">{msg}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;
