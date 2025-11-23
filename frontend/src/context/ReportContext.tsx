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

  // ---------------------------------------------------------
  // AXIOS INSTANCE
  // ---------------------------------------------------------
  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: API_URL,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  }, [token]);

  // ---------------------------------------------------------
  // LOAD ALL REPORTS
  // ---------------------------------------------------------
  useEffect(() => {
    if (!token) return;

    const fetchReports = async () => {
      setLoading(true);

      try {
        const res = await axiosInstance.get("/");
        const data = res.data?.data;

        if (Array.isArray(data)) {
          setReports(data);
        } else {
          console.warn("Unexpected reports format:", data);
          setReports([]);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [axiosInstance, token]);

  // ---------------------------------------------------------
  // CREATE REPORT
  // ---------------------------------------------------------
  const addReport = async (
    data: Omit<Incident, "id" | "createdOn">
  ): Promise<number> => {
    try {
      const res = await axiosInstance.post("/", {
        ...data,
        createdBy: user?.id,
      });

      const created: Incident = res.data?.data;

      if (!created || !created.id) {
        console.error("Invalid response from backend");
        return -1;
      }

      setReports((prev) => [...prev, created]);
      return created.id;
    } catch (err) {
      console.error("Error creating report:", err);
      return -1;
    }
  };

  // ---------------------------------------------------------
  // UPDATE REPORT
  // ---------------------------------------------------------
  const updateReport = async (
    id: number,
    updates: Partial<Incident>
  ): Promise<boolean> => {
    try {
      const res = await axiosInstance.put(`/${id}`, updates);
      if (!res.data?.success) return false;

      // Get updated data
      const refreshed = await axiosInstance.get(`/${id}`);
      const updated: Incident = refreshed.data?.data;

      if (!updated) return false;

      setReports((prev) =>
        prev.map((r) => (r.id === id ? updated : r))
      );

      return true;
    } catch (err) {
      console.error("Error updating report:", err);
      return false;
    }
  };

  // ---------------------------------------------------------
  // DELETE REPORT
  // ---------------------------------------------------------
  const deleteReport = async (id: number): Promise<boolean> => {
    try {
      await axiosInstance.delete(`/${id}`);

      setReports((prev) => prev.filter((r) => r.id !== id));
      return true;
    } catch (err) {
      console.error("Error deleting report:", err);
      return false;
    }
  };

  // ---------------------------------------------------------
  // GETTERS
  // ---------------------------------------------------------
  const getReport = (id: number): Incident | undefined =>
    reports.find((r) => r.id === id);

  const getUserReports = (userId: number): Incident[] =>
    reports.filter((r) => r.createdBy === userId);

  const getAllReports = (): Incident[] => reports;

  const debugReports = () => console.log("Reports:", reports);

  // ---------------------------------------------------------
  // CONTEXT VALUE
  // ---------------------------------------------------------
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
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
};
