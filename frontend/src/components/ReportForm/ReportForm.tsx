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

interface FormErrors {
  title?: string;
  comment?: string;
  location?: string;
  submit?: string;
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

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load draft
  useEffect(() => {
    if (!isEditing) {
      const savedDraft = localStorage.getItem("ireporter_draft");
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          const draftTime = new Date(draft.lastSaved);
          const hoursDiff =
            (new Date().getTime() - draftTime.getTime()) / (1000 * 60 * 60);
          if (
            hoursDiff < 1 &&
            confirm("You have a recently saved draft. Continue?")
          ) {
            setFormData(draft);
          }
        } catch (err) {
          console.error("Error loading draft:", err);
        }
      }
    }
  }, [isEditing]);

  // Prefill editing data
  useEffect(() => {
    if (isEditing && report) {
      const loc = report.location || "";
      const parts = loc.includes(",")
        ? loc.split(",").map((c) => c.trim())
        : [loc.trim(), ""];
      const lat = parts[0] || "";
      const lng = parts[1] || "";
      setFormData({
        type: report.type,
        title: report.title,
        location: loc,
        latitude: String(lat),
        longitude: String(lng),
        comment: report.comment || "",
        images: report.images || [],
        videos: report.videos || [],
      });
    }
  }, [isEditing, report]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters long";
    } else if (formData.title.trim().length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    // Comment validation
    if (!formData.comment.trim()) {
      newErrors.comment = "Description is required";
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = "Description must be at least 10 characters long";
    } else if (formData.comment.trim().length > 1000) {
      newErrors.comment = "Description must be less than 1000 characters";
    }

    // Location validation
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    if (!formData.latitude || !formData.longitude) {
      newErrors.location = "Please select a location on the map";
    } else if (isNaN(lat) || isNaN(lng)) {
      newErrors.location = "Invalid location coordinates";
    } else if (lat < -90 || lat > 90) {
      newErrors.location = "Latitude must be between -90 and 90";
    } else if (lng < -180 || lng > 180) {
      newErrors.location = "Longitude must be between -180 and 180";
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

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset states
    setSubmitSuccess(false);
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Check authentication
    if (!user?.id) {
      setErrors({ submit: "You must be logged in to submit a report" });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        type: formData.type,
        title: formData.title.trim(),
        location: `${formData.latitude},${formData.longitude}`,
        comment: formData.comment.trim(),
        images: formData.images,
        videos: formData.videos,
        createdBy: Number(user.id),
        status: "draft" as const,
      };

      let success = false;

      if (isEditing && report) {
        const result = await updateReport(report.id, payload);
        success = result === true || result !== false;
      } else {
        const newId = await addReport(payload);
        success = newId !== undefined && newId !== null && newId !== -1;
      }

      if (success) {
        setSubmitSuccess(true);

        // Show success message
        alert(
          isEditing
            ? "Report updated successfully!"
            : "Report created successfully!"
        );

        // Clear draft from localStorage for new reports
        if (!isEditing) {
          localStorage.removeItem("ireporter_draft");
        }

        // Navigate after a brief delay to show the success state
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        throw new Error("Failed to save report");
      }
    } catch (err: any) {
      console.error("Error submitting report:", err);
      const errorMessage =
        err?.message || "Error submitting report. Please try again.";
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-save draft for new reports (not editing)
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

  const latNum = parseFloat(String(formData.latitude));
  const lngNum = parseFloat(String(formData.longitude));
  const initialLocation =
    !Number.isNaN(latNum) && !Number.isNaN(lngNum)
      ? { lat: latNum, lng: lngNum }
      : undefined;

  return (
    <div className="report-form">
      <h1>{isEditing ? "Edit Report" : "Create New Report"}</h1>

      {submitSuccess && (
        <div className="success-message">
          ✓ {isEditing ? "Report updated" : "Report created"} successfully!
          Redirecting...
        </div>
      )}

      {errors.submit && <div className="error-message">⚠ {errors.submit}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="type">Report Type:</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="red-flag">Red Flag</option>
            <option value="intervention">Intervention</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Enter a descriptive title"
            maxLength={100}
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
          <div className="character-count">{formData.title.length}/100</div>
        </div>

        <div className="form-group">
          <label htmlFor="comment">Description:</label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Provide detailed description of the incident"
            rows={5}
            maxLength={1000}
          />
          {errors.comment && (
            <span className="field-error">{errors.comment}</span>
          )}
          <div className="character-count">{formData.comment.length}/1000</div>
        </div>

        <div className="form-group">
          <label>Location:</label>
          <MapPicker
            initialLocation={initialLocation}
            onLocationSelect={handleLocationSelect}
          />
          {errors.location && (
            <span className="field-error">{errors.location}</span>
          )}
          {formData.latitude && formData.longitude && (
            <div className="coordinates">
              Coordinates: {formData.latitude}, {formData.longitude}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || submitSuccess}
          className={`submit-button ${isSubmitting ? "submitting" : ""} ${submitSuccess ? "success" : ""}`}
        >
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              {isEditing ? "Updating..." : "Submitting..."}
            </>
          ) : submitSuccess ? (
            <>✓ {isEditing ? "Updated" : "Submitted"}</>
          ) : isEditing ? (
            "Update Report"
          ) : (
            "Submit Report"
          )}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
