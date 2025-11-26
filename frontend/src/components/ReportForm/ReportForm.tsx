import React, { useEffect, useState } from "react";
import { useReports } from "../../context/ReportContext";
import { useAuth } from "../../context/AuthContext";
import MapPicker from "../MapPicker/MapPicker";
import { Incident } from "../../utils/types";
import toast from "react-hot-toast";
import "./ReportForm.css";

interface ReportFormProps {
  report?: Incident;
  isEditing?: boolean;
  onSuccess?: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({
  report,
  isEditing = false,
  onSuccess,
}) => {
  const { addReport, updateReport } = useReports();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    type: report?.type || "red-flag",
    title: report?.title || "",
    location: report?.location || "",
    comment: report?.comment || "",
    images: report?.images || [],
    videos: report?.videos || [],
  });

  const [errors, setErrors] = useState<any>({});
  const [touched, setTouched] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usingLocation, setUsingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Load report into form when editing
  useEffect(() => {
    if (isEditing && report) {
      setFormData({
        type: report.type,
        title: report.title,
        location: report.location,
        comment: report.comment,
        images: report.images || [],
        videos: report.videos || [],
      });

      // Set map center from existing report location
      if (report.location) {
        const [lat, lng] = report.location
          .split(",")
          .map((coord) => parseFloat(coord.trim()));
        if (!isNaN(lat) && !isNaN(lng)) {
          setMapCenter({ lat, lng });
        }
      }
    }
  }, [isEditing, report]);

  // Validation
  const validateField = (name: string, value: string) => {
    if (name === "title") {
      if (!value.trim()) return "Title is required";
      if (value.length < 5) return "Title must be at least 5 characters";
    }

    if (name === "comment") {
      if (!value.trim()) return "Description is required";
      if (value.length < 10) return "Description must be at least 10 letters";
    }

    if (name === "location") {
      if (!value.trim()) return "Select location from the map";
    }

    return "";
  };

  const validateForm = () => {
    const newErrors: any = {};
    newErrors.title = validateField("title", formData.title);
    newErrors.comment = validateField("comment", formData.comment);
    newErrors.location = validateField("location", formData.location);

    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) delete newErrors[key];
    });

    return newErrors;
  };

  const isFormValid = () => Object.keys(validateForm()).length === 0;

  // Input Handlers
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors((err: any) => ({ ...err, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<any>) => {
    const { name, value } = e.target;

    setTouched((t: any) => ({ ...t, [name]: true }));
    setErrors((err: any) => ({ ...err, [name]: validateField(name, value) }));
  };

  // Media Upload
  const pickMedia = (type: "image" | "video") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "image" ? "image/*" : "video/*";
    input.multiple = true;

    input.onchange = () => {
      const files = Array.from(input.files || []);
      const limit = type === "image" ? 10 : 5;

      const existing =
        type === "image" ? formData.images.length : formData.videos.length;

      if (files.length + existing > limit) {
        toast.error(`Maximum ${limit} ${type}s allowed`);
        return;
      }

      const urls = files.map((f: any) => URL.createObjectURL(f));

      setFormData((prev) => ({
        ...prev,
        [type === "image" ? "images" : "videos"]: [
          ...(type === "image" ? prev.images : prev.videos),
          ...urls,
        ],
      }));

      toast.success(`Added ${files.length} ${type}(s)`);
    };

    input.click();
  };

  const removeImage = (i: number) =>
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== i),
    }));

  const removeVideo = (i: number) =>
    setFormData((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, idx) => idx !== i),
    }));

  // Map Picker Location Handler
  const handleLocationSelect = (coords: { lat: number; lng: number }) => {
    const locationString = `${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}`;

    setFormData((prev) => ({
      ...prev,
      location: locationString,
    }));
    setMapCenter(coords);
    setErrors((e: any) => ({ ...e, location: "" }));
  };

  // Use Current Map Location
  const useCurrentMapLocation = () => {
    if (!mapCenter) {
      toast.error("Please select a location on the map first");
      return;
    }

    setUsingLocation(true);

    setTimeout(() => {
      const locationString = `${mapCenter.lat.toFixed(6)},${mapCenter.lng.toFixed(6)}`;

      setFormData((prev) => ({
        ...prev,
        location: locationString,
      }));

      setErrors((e: any) => ({ ...e, location: "" }));
      toast.success("Location set from map!");
      setUsingLocation(false);
    }, 500);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm();
    setErrors(validation);

    if (Object.keys(validation).length > 0) {
      toast.error("Fix errors before submitting");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && report) {
        await updateReport(report.id, formData);
        toast.success("Report updated!");
      } else {
        await addReport({
          ...formData,
          createdBy: Number(user?.id),
          status: "submitted",
        });
        toast.success("Report submitted!");
      }

      onSuccess?.();
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="report-form-container">
      <form className="report-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h1>{isEditing ? "Edit Report" : "Create New Report"}</h1>
        </div>

        <div className="form-grid">
          {/* Report Type */}
          <div className="form-group">
            <label className="form-label required">Report Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="form-select"
            >
              <option value="red-flag">🚩 Red Flag</option>
              <option value="intervention">🛠️ Intervention</option>
            </select>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label required">Title</label>
            <input
              type="text"
              name="title"
              className={`form-input ${errors.title && touched.title ? "error" : ""}`}
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Brief title"
            />
            {errors.title && touched.title && (
              <div className="error-text">{errors.title}</div>
            )}
          </div>

          {/* Description */}
          <div className="form-group full-width">
            <label className="form-label required">Description</label>
            <textarea
              name="comment"
              className={`form-textarea ${errors.comment && touched.comment ? "error" : ""}`}
              value={formData.comment}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={5}
            />
            {errors.comment && touched.comment && (
              <div className="error-text">{errors.comment}</div>
            )}
          </div>

          {/* Location */}
          <div className="form-group full-width">
            <label className="form-label required">Location</label>

            <div className="location-buttons">
              <button
                type="button"
                className="btn btn-outline location-btn"
                onClick={useCurrentMapLocation}
                disabled={usingLocation || !mapCenter}
              >
                {usingLocation ? "Setting location..." : "📍 Use Map Location"}
              </button>
            </div>

            <MapPicker onSelect={handleLocationSelect} />

            {errors.location && touched.location && (
              <div className="error-text">{errors.location}</div>
            )}

            {formData.location && (
              <div className="coordinates-display">📍 {formData.location}</div>
            )}
          </div>

          {/* Media */}
          <div className="form-group full-width">
            <label className="form-label">Media Evidence</label>

            <button
              type="button"
              className="upload-btn image-upload-btn"
              onClick={() => pickMedia("image")}
              disabled={formData.images.length >= 10}
            >
              📷 Upload Images ({formData.images.length}/10)
            </button>

            <button
              type="button"
              className="upload-btn video-upload-btn"
              onClick={() => pickMedia("video")}
              disabled={formData.videos.length >= 5}
            >
              🎥 Upload Videos ({formData.videos.length}/5)
            </button>

            {formData.images.length > 0 && (
              <div className="media-grid">
                {formData.images.map((img, i) => (
                  <div key={i} className="media-item">
                    <img src={img} alt={`Evidence ${i + 1}`} />
                    <button type="button" onClick={() => removeImage(i)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {formData.videos.length > 0 && (
              <div className="media-grid">
                {formData.videos.map((vid, i) => (
                  <div key={i} className="media-item">
                    <video controls src={vid} />
                    <button type="button" onClick={() => removeVideo(i)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary submit-btn"
            disabled={isSubmitting || !isFormValid()}
          >
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Submitting..."
              : isEditing
                ? "Update Report"
                : "Submit Report"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
