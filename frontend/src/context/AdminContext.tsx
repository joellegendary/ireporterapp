import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

const AdminContext = createContext<boolean>(false);

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (ctx === undefined)
    throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
};

interface Props {
  children: ReactNode;
}

export const AdminProvider: React.FC<Props> = ({ children }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAdminStatus = async () => {
      if (!user) return setIsAdmin(false);

      try {
        const response = await axios.get(`${API_URL}/user/${user.id}`);
        setIsAdmin(response.data.isAdmin);
      } catch (err) {
        console.error("Error fetching admin status:", err);
        setIsAdmin(false);
      }
    };

    fetchAdminStatus();
  }, [user]);

  return (
    <AdminContext.Provider value={isAdmin}>{children}</AdminContext.Provider>
  );
};
