import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { Incident, ReportContextType } from "../utils/types";
import { useAuth } from "./AuthContext";

const API_URL = "http://localhost:5000/api/reports";

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const useReports = () => {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error("useReports must be used within a ReportProvider");
  return ctx;
};

export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { token, user } = useAuth();

  const [reports, setReports] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Axios instance with better error logging
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    instance.interceptors.response.use(
      (response) => {
        console.log("✅ API Success:", response.config.url, response.status);
        return response;
      },
      (error) => {
        console.error("❌ API Error Details:");
        console.error("URL:", error.config?.url);
        console.error("Method:", error.config?.method);
        console.error("Status:", error.response?.status);
        console.error("Response Data:", error.response?.data);
        console.error("Message:", error.message);
        return Promise.reject(error);
      }
    );

    return instance;
  }, [token]);

  // Load all reports
  useEffect(() => {
    if (!token) {
      setReports([]);
      setLoading(false);
      return;
    }

    const fetchReports = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axiosInstance.get("/");
        console.log("Fetched reports response:", res.data);

        const data = res.data?.data || res.data;

        if (Array.isArray(data)) {
          console.log(`Loaded ${data.length} reports`);
          setReports(data);
        } else {
          console.warn("Unexpected reports format:", data);
          setReports([]);
        }
      } catch (error: any) {
        console.error("Error fetching reports:", error);
        setError(error.response?.data?.message || "Failed to load reports");
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [axiosInstance, token]);

  // CREATE REPORT - Proper error handling
  const addReport = async (
    data: Omit<Incident, "id" | "createdOn">
  ): Promise<number> => {
    setError(null);

    try {
      console.log("📤 Creating report with data:", data);

      // Validate required fields
      if (!data.title?.trim()) throw new Error("Title is required");
      if (!data.comment?.trim()) throw new Error("Description is required");
      if (!data.location?.trim()) throw new Error("Location is required");

      const payload = {
        type: data.type || "red-flag",
        title: data.title.trim(),
        comment: data.comment.trim(),
        location: data.location.trim(),
        images: Array.isArray(data.images) ? data.images : [],
        videos: Array.isArray(data.videos) ? data.videos : [],
        createdBy: user?.id,
        status: "submitted",
      };

      console.log("📦 Sending payload to backend:", payload);

      const res = await axiosInstance.post("/", payload);
      console.log("✅ Create report response:", res.data);

      // Handle different response formats
      const responseData = res.data?.data || res.data;

      if (!responseData) {
        throw new Error("No data received from server");
      }

      // Validate the response has required fields
      if (!responseData.id) {
        console.error("❌ Invalid response - missing ID:", responseData);
        throw new Error("Server response missing report ID");
      }

      const created: Incident = {
        id: responseData.id,
        title: responseData.title || data.title,
        comment: responseData.comment || data.comment,
        location: responseData.location || data.location,
        type: responseData.type || data.type,
        status: responseData.status || "submitted",
        createdBy: responseData.createdBy || user?.id,
        createdOn: responseData.createdOn || new Date().toISOString(),
        images: Array.isArray(responseData.images) ? responseData.images : [],
        videos: Array.isArray(responseData.videos) ? responseData.videos : [],
      };

      console.log("📝 Created report object:", created);

      // Add to state
      setReports((prev) => {
        const newReports = [created, ...prev];
        console.log(
          `🔄 Reports state updated: ${prev.length} -> ${newReports.length}`
        );
        return newReports;
      });

      return created.id;
    } catch (err: any) {
      console.error("💥 Error creating report:", err);

      let errorMessage = "Failed to create report";

      if (err.response?.data) {
        // Try to extract meaningful error message from backend
        const backendError = err.response.data;
        errorMessage =
          backendError.message ||
          backendError.error ||
          JSON.stringify(backendError);
      } else if (err.message) {
        errorMessage = err.message;
      }

      if (err.response?.status === 500) {
        errorMessage =
          "Server error: Please try again later or contact support";
      }

      setError(errorMessage);
      return -1;
    }
  };

  // UPDATE REPORT
  const updateReport = async (
    id: number,
    updates: Partial<Incident>
  ): Promise<boolean> => {
    setError(null);

    try {
      const res = await axiosInstance.put(`/${id}`, updates);

      const success =
        res.data?.success !== false &&
        !res.data?.error &&
        res.status >= 200 &&
        res.status < 300;

      if (!success) {
        throw new Error(res.data?.message || "Update failed");
      }

      const refreshedRes = await axiosInstance.get(`/${id}`);
      const updated: Incident = refreshedRes.data?.data || refreshedRes.data;

      if (!updated) {
        throw new Error("Failed to fetch updated report");
      }

      setReports((prev) => prev.map((r) => (r.id === id ? updated : r)));

      return true;
    } catch (err: any) {
      console.error("Error updating report:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to update report";
      setError(errorMessage);
      return false;
    }
  };

  // DELETE REPORT
  const deleteReport = async (id: number): Promise<boolean> => {
    setError(null);

    try {
      await axiosInstance.delete(`/${id}`);
      setReports((prev) => prev.filter((r) => r.id !== id));
      return true;
    } catch (err: any) {
      console.error("Error deleting report:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to delete report";
      setError(errorMessage);
      return false;
    }
  };

  // GETTERS
  const getReport = (id: number): Incident | undefined =>
    reports.find((r) => r.id === id);

  const getUserReports = (userId: number): Incident[] =>
    reports.filter((r) => r.createdBy === userId);

  const getAllReports = (): Incident[] => reports;

  const debugReports = () => {
    console.log("Current reports state:", reports);
    console.log("Reports count:", reports.length);
    console.log("Loading:", loading);
    console.log("Error:", error);
  };

  // CONTEXT VALUE
  const value: ReportContextType = {
    reports,
    loading,
    error,
    addReport,
    updateReport,
    deleteReport,
    getReport,
    getUserReports,
    getAllReports,
    debugReports,
  };

  return (
    <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
  );
};
