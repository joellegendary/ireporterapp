import React, { useState } from "react";
import { useReports } from "../../context/ReportContext";
import { useAuth } from "../../context/AuthContext";
import { Incident } from "../../utils/types";

const ReportForm: React.FC = () => {
  const { addReport } = useReports();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    type: "red-flag" as Incident["type"],
    title: "",
    comment: "",
    location: "",
    images: [] as string[],
    videos: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, videos: [...prev.videos, ...files] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in to create a report.");

    const newReport: Omit<Incident, "id" | "createdOn"> = {
      type: formData.type,
      title: formData.title,
      comment: formData.comment,
      location: formData.location,
      images: formData.images,
      videos: formData.videos,
      createdBy: user.id,
      status: "draft", // FIXED — must match Incident type
    };

    await addReport(newReport);
    alert("Report submitted successfully!");

    setFormData({
      type: "red-flag",
      title: "",
      comment: "",
      location: "",
      images: [],
      videos: [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="report-form">
      <h2>Create Report</h2>

      <label>Type</label>
      <select name="type" value={formData.type} onChange={handleChange}>
        <option value="red-flag">Red Flag</option>
        <option value="intervention">Intervention</option>
      </select>

      <label>Title</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <label>Comment</label>
      <textarea
        name="comment"
        value={formData.comment}
        onChange={handleChange}
        required
      ></textarea>

      <label>Location</label>
      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        required
      />

      <label>Upload Images</label>
      <input type="file" accept="image/*" multiple onChange={handleImageUpload} />

      <label>Upload Videos</label>
      <input type="file" accept="video/*" multiple onChange={handleVideoUpload} />

      <button type="submit">Submit Report</button>
    </form>
  );
};

export default ReportForm;
