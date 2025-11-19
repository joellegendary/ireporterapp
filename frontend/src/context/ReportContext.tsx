import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import type { ReactNode } from "react";
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

interface Props {
  children: ReactNode;
}

export const ReportProvider: React.FC<Props> = ({ children }) => {
  const { token, user } = useAuth(); // 🔥 token now available!

  const [reports, setReports] = useState<Incident[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 🔥 Axios instance WITH TOKEN
  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  }, [token]);

  // 🔥 Fetch all reports on mount or when token changes
  useEffect(() => {
    if (!token) return; // don't fetch without login

    const fetchReports = async () => {
      try {
        const response = await axiosInstance.get("/");
        setReports(response.data);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchReports();
  }, [axiosInstance, token]);

  // Add a report
  const addReport = async (reportData: Omit<Incident, "id" | "createdOn">) => {
    try {
      const response = await axiosInstance.post("/", reportData);
      setReports((prev) => [...prev, response.data]);
      return response.data.id;
    } catch (err) {
      console.error("Error adding report:", err);
      return -1;
    }
  };

  // Update a report
  const updateReport = async (id: number, updates: Partial<Incident>) => {
    try {
      const response = await axiosInstance.put(`/${id}`, updates);
      setReports((prev) => prev.map((r) => (r.id === id ? response.data : r)));
      return true;
    } catch (err) {
      console.error("Error updating report:", err);
      return false;
    }
  };

  // Delete a report
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
