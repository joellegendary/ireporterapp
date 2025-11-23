import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useReports } from "../../context/ReportContext";
import MapPicker from "../MapPicker/MapPicker";
import { Incident } from "../../utils/types";
import "./ReportForm.css";

interface ReportFormProps {
  report?: Incident;
  isEditing?: boolean;
}

const ReportForm: React.FC<ReportFormProps> = ({
  report,
  isEditing = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addReport, updateReport } = useReports();

  const [formData, setFormData] = useState({
    type: "red-flag" as "red-flag" | "intervention",
    title: "",
    location: "",
    latitude: "",
    longitude: "",
    comment: "",
    images: [] as string[],
    videos: [] as string[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-save draft only when creating
  useEffect(() => {
    if (
      !isEditing &&
      (formData.title || formData.comment || formData.latitude)
    ) {
      const draft = {
        ...formData,
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem("ireporter_draft", JSON.stringify(draft));
    }
  }, [formData, isEditing]);

  // Load draft if exists
  useEffect(() => {
    if (!isEditing) {
      const savedDraft = localStorage.getItem("ireporter_draft");
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          const draftTime = new Date(draft.lastSaved);
          const currentTime = new Date();
          const hoursDiff =
            (currentTime.getTime() - draftTime.getTime()) / (1000 * 60 * 60);

          if (hoursDiff < 1) {
            if (
              confirm(
                "You have a recently saved draft. Continue where you left off?"
              )
            ) {
              setFormData(draft);
            }
          }
        } catch (error) {
          console.error("Error loading draft:", error);
        }
      }
    }
  }, [isEditing]);

  // Load editing data
  useEffect(() => {
    if (!isEditing) {
      const searchParams = new URLSearchParams(location.search);
      const typeParam = searchParams.get("type");
      if (typeParam === "red-flag" || typeParam === "intervention") {
        setFormData((prev) => ({ ...prev, type: typeParam }));
      }
    }

    if (isEditing && report) {
      const [lat, lng] = report.location
        .split(",")
        .map((coord) => coord.trim());
      setFormData({
        type: report.type,
        title: report.title,
        location: report.location,
        latitude: lat,
        longitude: lng,
        comment: report.comment,
        images: report.images,
        videos: report.videos,
      });
    }
  }, [isEditing, report, location.search]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters long";
    }

    if (!formData.comment.trim()) {
      newErrors.comment = "Description is required";
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = "Description must be at least 10 characters long";
    }

    if (!formData.latitude || !formData.longitude) {
      newErrors.location = "Please select a location on the map";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
      location: `${lat},${lng}`,
    }));

    if (errors.location) {
      setErrors((prev) => ({ ...prev, location: "" }));
    }
  };

  const handleMediaUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    mediaType: "images" | "videos"
  ) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles = Array.from(files).filter((file) => {
      if (mediaType === "images") {
        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        return validTypes.includes(file.type);
      } else {
        const validTypes = [
          "video/mp4",
          "video/quicktime",
          "video/avi",
          "video/mkv",
          "video/webm",
          "video/x-msvideo",
        ];
        return validTypes.includes(file.type);
      }
    });

    if (validFiles.length !== files.length) {
      alert(`Some files were skipped. Unsupported formats were removed.`);
    }

    const newMedia = validFiles.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      [mediaType]: [...prev[mediaType], ...newMedia],
    }));

    e.target.value = "";
  };

  const removeMedia = (index: number, mediaType: "images" | "videos") => {
    setFormData((prev) => ({
      ...prev,
      [mediaType]: prev[mediaType].filter((_, i) => i !== index),
    }));
  };

  const clearDraft = () => {
    if (
      confirm(
        "Are you sure you want to clear your draft? This action cannot be undone."
      )
    ) {
      localStorage.removeItem("ireporter_draft");
      setFormData({
        type: "red-flag",
        title: "",
        location: "",
        latitude: "",
        longitude: "",
        comment: "",
        images: [],
        videos: [],
      });
    }
  };

  // -------------------------------------------------------
  // ✅ FIXED: Only show success after backend has saved
  // -------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const locationString = `${formData.latitude},${formData.longitude}`;

      if (isEditing && report) {
        const success = await updateReport(report.id, {
          type: formData.type,
          title: formData.title,
          location: locationString,
          comment: formData.comment,
          images: formData.images,
          videos: formData.videos,
        });

        if (success) {
          alert("✅ Report updated successfully!");
          navigate("/dashboard");
        } else {
          alert("❌ Failed to update report.");
        }
      } else {
        const newId = await addReport({
          type: formData.type,
          title: formData.title,
          location: locationString,
          comment: formData.comment,
          images: formData.images,
          videos: formData.videos,
          createdBy: user?.id || 0,
          status: "draft",
        });

        if (typeof newId === "number" && newId > 0) {
          localStorage.removeItem("ireporter_draft");
          alert("✅ Report created successfully!");
          navigate("/dashboard");
        } else {
          alert("❌ Failed to create report.");
        }
      }
    } catch (error) {
      alert("❌ An error occurred. Please try again.");
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (formData.title || formData.comment || formData.latitude) {
      if (
        confirm("You have unsaved changes. Are you sure you want to leave?")
      ) {
        navigate("/dashboard");
      }
    } else {
      navigate("/dashboard");
    }
  };

  const initialLocation =
    formData.latitude && formData.longitude
      ? {
          lat: parseFloat(formData.latitude),
          lng: parseFloat(formData.longitude),
        }
      : undefined;

  const hasUnsavedChanges =
    formData.title || formData.comment || formData.latitude;

  return (
    <div className="report-form">
      <div className="form-header">
        <h1 className="form-title">
          {isEditing ? "Edit Report" : "Create New Report"}
        </h1>
        <p className="form-subtitle">
          {isEditing
            ? "Update your report details"
            : "Report corruption or request government intervention"}
        </p>

        {!isEditing && hasUnsavedChanges && (
          <div className="draft-notice">
            <span>💾 Draft auto-saved</span>
            <button type="button" className="btn-link" onClick={clearDraft}>
              Clear Draft
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* --- Report Type --- */}
        <div className="form-group">
          <label className="form-label">Report Type *</label>
          <div className="type-selector">
            <label
              className={`type-option ${formData.type === "red-flag" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="type"
                value="red-flag"
                checked={formData.type === "red-flag"}
                onChange={handleChange}
                style={{ display: "none" }}
              />
              <div className="type-icon">🚩</div>
              <div className="type-label">Red Flag</div>
              <div className="type-description">
                Report corruption incidents
              </div>
            </label>

            <label
              className={`type-option ${formData.type === "intervention" ? "selected" : ""}`}
            >
              <input
                type="radio"
                name="type"
                value="intervention"
                checked={formData.type === "intervention"}
                onChange={handleChange}
                style={{ display: "none" }}
              />
              <div className="type-icon">⚙️</div>
              <div className="type-label">Intervention</div>
              <div className="type-description">Request government action</div>
            </label>
          </div>
        </div>

        {/* ---- Title ---- */}
        <div className="form-grid">
          <div className="form-group form-full-width">
            <label className="form-label">Report Title *</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a clear, descriptive title"
              maxLength={100}
            />
            <div className="input-info">
              {formData.title.length}/100 characters
              {errors.title && (
                <span className="error-text">{errors.title}</span>
              )}
            </div>
          </div>

          {/* ---- Description ---- */}
          <div className="form-group form-full-width">
            <label className="form-label">Description *</label>
            <textarea
              name="comment"
              className="form-textarea"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Provide detailed information about the incident or issue..."
              rows={6}
              maxLength={1000}
            />
            <div className="input-info">
              {formData.comment.length}/1000 characters
              {errors.comment && (
                <span className="error-text">{errors.comment}</span>
              )}
            </div>
          </div>
        </div>

        {/* ---- Location ---- */}
        <div className="form-group form-full-width">
          <label className="form-label">Location *</label>
          <MapPicker
            onLocationSelect={handleLocationSelect}
            initialLocation={initialLocation}
          />
          {errors.location && (
            <span className="error-text">{errors.location}</span>
          )}

          {formData.latitude && formData.longitude && (
            <div className="coordinates-info">
              Selected: {formData.latitude}, {formData.longitude}
            </div>
          )}
        </div>

        {/* ---- Images ---- */}
        <div className="form-group form-full-width">
          <label className="form-label">Supporting Images (Optional)</label>
          <label className="media-upload">
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={(e) => handleMediaUpload(e, "images")}
              style={{ display: "none" }}
            />
            <div className="upload-icon">📷</div>
            <div className="upload-text">Upload Images</div>
            <div className="upload-subtext">
              JPEG, PNG, GIF, WEBP • No size limits
            </div>
          </label>

          {formData.images.length > 0 && (
            <div className="media-preview">
              <div className="media-header">
                <span>{formData.images.length} image(s) attached</span>
                <button
                  type="button"
                  className="btn-link"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, images: [] }))
                  }
                >
                  Remove All
                </button>
              </div>
              <div className="media-grid">
                {formData.images.map((image, index) => (
                  <div key={index} className="media-item">
                    <img src={image} alt={`Evidence ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-media"
                      onClick={() => removeMedia(index, "images")}
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ---- Videos ---- */}
        <div className="form-group form-full-width">
          <label className="form-label">Supporting Videos (Optional)</label>
          <label className="media-upload">
            <input
              type="file"
              multiple
              accept="video/mp4,video/quicktime,video/avi,video/mkv,video/webm,video/x-msvideo"
              onChange={(e) => handleMediaUpload(e, "videos")}
              style={{ display: "none" }}
            />
            <div className="upload-icon">🎥</div>
            <div className="upload-text">Upload Videos</div>
            <div className="upload-subtext">
              MP4, MOV, AVI, MKV, WEBM • No size limits
            </div>
          </label>

          {formData.videos.length > 0 && (
            <div className="media-preview">
              <div className="media-header">
                <span>{formData.videos.length} video(s) attached</span>
                <button
                  type="button"
                  className="btn-link"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, videos: [] }))
                  }
                >
                  Remove All
                </button>
              </div>
              <div className="media-grid">
                {formData.videos.map((video, index) => (
                  <div key={index} className="media-item">
                    <video src={video} controls />
                    <button
                      type="button"
                      className="remove-media"
                      onClick={() => removeMedia(index, "videos")}
                      title="Remove video"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ---- Actions ---- */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Update Report"
                : "Create Report"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
