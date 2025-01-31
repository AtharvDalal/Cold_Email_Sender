"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

    // Convert resume to base64 if provided
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
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Send Email to HR</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullname">Full Name</label>
          <input
            type="text"
            id="fullname"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="phone">Phone Number</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="linkedinId">LinkedIn ID</label>
          <input
            type="text"
            id="linkedinId"
            value={linkedinId}
            onChange={(e) => setLinkedinId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="resume">Resume (Optional)</label>
          <input
            type="file"
            id="resume"
            onChange={(e) =>
              setResume(e.target.files ? e.target.files[0] : null)
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="hrEmail">HR Email</label>
          <input
            type="email"
            id="hrEmail"
            value={hrEmail}
            onChange={(e) => setHrEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Send Email
        </button>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
    </div>
  );
};

export default SendEmail;
