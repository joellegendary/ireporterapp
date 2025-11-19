import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/reports";

export const fetchAllReports = async () => {
  const res = await axios.get(API_BASE_URL);
  return res.data; // array of reports
};

export const fetchUserReports = async (userId: number) => {
  const res = await axios.get(`${API_BASE_URL}/user/${userId}`);
  return res.data;
};

export const fetchReport = async (id: number) => {
  const res = await axios.get(`${API_BASE_URL}/${id}`);
  return res.data;
};

export const createReport = async (data: any) => {
  const res = await axios.post(API_BASE_URL, data);
  return res.data; // created report
};

export const updateReportRequest = async (id: number, updates: any) => {
  const res = await axios.patch(`${API_BASE_URL}/${id}`, updates);
  return res.data;
};

export const deleteReportRequest = async (id: number) => {
  const res = await axios.delete(`${API_BASE_URL}/${id}`);
  return res.data;
};
