import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
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

  // Axios instance
  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  }, [token]);

  // ============================
  // LOAD ALL REPORTS
  // ============================
  useEffect(() => {
    if (!token) return;

    const fetchReports = async () => {
      try {
        const res = await axiosInstance.get("/");
        setReports(res.data.data || []);
      } catch (err) {
        console.error("Error loading reports", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [axiosInstance, token]);

  // ============================
  // CREATE REPORT
  // ============================
  const addReport = async (
    reportData: Omit<Incident, "id" | "createdOn">
  ): Promise<number> => {
    try {
      const response = await axiosInstance.post("/", {
        ...reportData,
        createdBy: user?.id,
      });

      const newReport: Incident = response.data.data;

      // Add full backend response
      setReports((prev) => [...prev, newReport]);

      return newReport.id;
    } catch (err) {
      console.error("Error creating report", err);
      return -1;
    }
  };

  // ============================
  // UPDATE REPORT
  // ============================
  const updateReport = async (
    id: number,
    updates: Partial<Incident>
  ): Promise<boolean> => {
    try {
      // Update in backend
      await axiosInstance.put(`/${id}`, updates);

      // Fetch updated report
      const updated = await axiosInstance.get(`/${id}`);
      const updatedReport: Incident = updated.data.data;

      setReports((prev) => prev.map((r) => (r.id === id ? updatedReport : r)));

      return true;
    } catch (err) {
      console.error("Error updating report", err);
      return false;
    }
  };

  // ============================
  // DELETE REPORT
  // ============================
  const deleteReport = async (id: number): Promise<boolean> => {
    try {
      await axiosInstance.delete(`/${id}`);
      setReports((prev) => prev.filter((r) => r.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting report", err);
      return false;
    }
  };

  // ============================
  // GETTERS
  // ============================
  const getReport = (id: number) => reports.find((r) => r.id === id);

  const getUserReports = (userId: number) =>
    reports.filter((r) => r.createdBy === userId);

  const getAllReports = () => reports;

  const debugReports = () => console.log("Reports:", reports);

  const value: ReportContextType = {
    reports,
    loading,
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
