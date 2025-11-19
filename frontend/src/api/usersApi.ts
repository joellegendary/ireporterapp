import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth";

export const signupRequest = async (userData: any) => {
  const response = await axios.post(`${API_BASE_URL}/signup`, userData);
  return response.data; // { user, token }
};

export const loginRequest = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE_URL}/login`, {
    email,
    password,
  });
  return response.data; // { user, token }
};
