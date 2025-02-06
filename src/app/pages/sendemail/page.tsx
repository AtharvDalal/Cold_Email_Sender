"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackgroundBeams } from "@/components/ui/background-beams";

const SendEmail = () => {
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [linkedinId, setLinkedinId] = useState("");
  const [resume, setResume] = useState<File | null>(null);
  const [hrEmail, setHrEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to send an email.");
      return;
    }

    if (!fullname || !phone || !linkedinId || !hrEmail) {
      setError("All fields except resume are required.");
      return;
    }

    if (!hrEmail.includes("@")) {
      setError("Invalid HR email format.");
      return;
    }

    if (resume) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        await sendEmail(reader.result as string, token);
      };
      reader.readAsDataURL(resume);
    } else {
      await sendEmail(null, token);
    }
  };

  const sendEmail = async (resumeBase64: string | null, token: string) => {
    try {
      const response = await fetch("/api/emails/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullname,
          phone,
          linkedinId,
          resume: resumeBase64,
          hrEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Email sent successfully!");
        setError("");
        setTimeout(() => router.push("/pages/sendemail"), 2000);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (error) {
      setError("Failed to send email. Please try again.");
      console.error("Error:", error);
    }
  };

  return (
    <div className=" relative flex items-center justify-center min-h-screen  to-black text-white p-6">
      <BackgroundBeams />
      <div className="w-full max-w-md p-6  bg-opacity-30 rounded-lg shadow-lg backdrop-blur-md">
        <h1 className="text-2xl font-bold mb-4 text-center text-teal-400">
          Send Email to HR
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium">
              Full Name
            </label>
            <input
              type="text"
              id="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>
          <div>
            <label htmlFor="linkedinId" className="block text-sm font-medium">
              LinkedIn ID
            </label>
            <input
              type="text"
              id="linkedinId"
              value={linkedinId}
              onChange={(e) => setLinkedinId(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>
          <div>
            <label htmlFor="resume" className="block text-sm font-medium">
              Resume (Optional)
            </label>
            <input
              type="file"
              id="resume"
              onChange={(e) =>
                setResume(e.target.files ? e.target.files[0] : null)
              }
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div>
            <label htmlFor="hrEmail" className="block text-sm font-medium">
              HR Email
            </label>
            <input
              type="email"
              id="hrEmail"
              value={hrEmail}
              onChange={(e) => setHrEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition"
          >
            Send Email
          </button>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green-400 text-sm text-center">{success}</p>
          )}

          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition"
          >
            Go To Home
          </button>
        </form>
      </div>
    </div>
  );
};

export default SendEmail;
