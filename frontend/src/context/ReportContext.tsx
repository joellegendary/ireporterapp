import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { Incident, ReportContextType, CreateReportData } from "../utils/types";
import { useAuth } from "./AuthContext";

const API_URL = "http://localhost:5000/api/reports";

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const useReports = () => {
  const ctx = useContext(ReportContext);
  if (!ctx) throw new Error("useReports must be used within a ReportProvider");
  return ctx;
};

interface Props {
  children: ReactNode;
}

export const ReportProvider: React.FC<Props> = ({ children }) => {
  const { token, user } = useAuth();
  const [reports, setReports] = useState<Incident[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  }, [token]);

  // Fetch all reports
  useEffect(() => {
    if (!token) return;

    const fetchReports = async () => {
      try {
        const response = await axiosInstance.get("/");
        const mappedReports: Incident[] = response.data.map((r: any) => ({
          ...r,
          createdBy: Number(r.createdBy || r.created_by || 0),
        }));
        setReports(mappedReports);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchReports();
  }, [axiosInstance, token]);

  // Add a new report
  const addReport = async (reportData: CreateReportData) => {
    const userId = Number(user?.id);
    if (!userId || isNaN(userId)) {
      console.error("Invalid user ID");
      return -1;
    }

    try {
      const payload = {
        ...reportData,
        createdBy: userId,
        images: reportData.images || [],
        videos: reportData.videos || [],
      };

      // Extra safety: convert latitude/longitude to numbers if they exist
      if (payload.latitude && payload.longitude) {
        const lat = Number(payload.latitude);
        const lng = Number(payload.longitude);
        if (!isNaN(lat) && !isNaN(lng)) payload.location = `${lat},${lng}`;
        else payload.location = "";
      }

      const response = await axiosInstance.post("/", payload);

      const newReport: Incident = {
        ...response.data,
        createdBy: Number(
          response.data.createdBy || response.data.created_by || userId
        ),
      };

      setReports((prev) => [...prev, newReport]);
      return newReport.id;
    } catch (err) {
      console.error("Error adding report:", err);
      return -1;
    }
  };

  // Update an existing report
  const updateReport = async (id: number, updates: Partial<Incident>) => {
    try {
      const payload = {
        ...updates,
        images: updates.images || [],
        videos: updates.videos || [],
      };

      // Ensure latitude/longitude are numbers
      if (payload.latitude && payload.longitude) {
        const lat = Number(payload.latitude);
        const lng = Number(payload.longitude);
        if (!isNaN(lat) && !isNaN(lng)) payload.location = `${lat},${lng}`;
      }

      const response = await axiosInstance.put(`/${id}`, payload);

      const updatedReport: Incident = {
        ...response.data,
        createdBy: Number(
          response.data.createdBy || response.data.created_by || 0
        ),
      };

      setReports((prev) => prev.map((r) => (r.id === id ? updatedReport : r)));
      return true;
    } catch (err) {
      console.error("Error updating report:", err);
      return false;
    }
  };

  const deleteReport = async (id: number) => {
    try {
      await axiosInstance.delete(`/${id}`);
      setReports((prev) => prev.filter((r) => r.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting report:", err);
      return false;
    }
  };

  const getReport = (id: number) => reports.find((r) => r.id === id);
  const getUserReports = (userId: number) =>
    reports.filter((r) => r.createdBy === userId);
  const getAllReports = () => reports;
  const debugReports = () => console.log("Reports:", reports);

  const value: ReportContextType = {
    reports,
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
