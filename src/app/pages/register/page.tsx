"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.message);
      return;
    }

    router.push("/pages/login");
  };

  return (
    <div className="relative flex justify-center items-center h-screen bg-gray-900">
      <div className="absolute inset-0">
        <BackgroundBeams />
      </div>
      <form
        className="relative z-10 p-6 bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-lg w-96"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-4 text-white">Register</h2>
        <input
          type="text"
          name="username"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition duration-200"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
