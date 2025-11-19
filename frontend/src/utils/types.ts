// =========================
// USER TYPE
// =========================
export interface User {
  id: number;
  firstname: string;
  lastname: string;
  othernames: string;
  username: string;
  email: string;
  phoneNumber: string;
  isAdmin: boolean;
  registered: string;
}

// =========================
// ADMIN ACTION TYPE
// =========================
export interface AdminAction {
  id: string;
  adminId: number;
  adminName: string;
  action: "status_change" | "reject" | "approve" | "view";
  reportId: number;
  oldStatus?: string;
  newStatus?: string;
  timestamp: Date;
  notes?: string;
}

// =========================
// INCIDENT TYPE
// =========================
export interface Incident {
  id: number;
  createdOn: Date;
  createdBy: number;
  type: "red-flag" | "intervention";
  title: string;
  location: string;
  status: "draft" | "under investigation" | "resolved" | "rejected";
  images: string[];
  videos: string[];
  comment: string;
  lastModifiedBy?: number;
  lastModifiedAt?: Date;
  adminActions?: AdminAction[];
}

// =========================
// AUTH RESPONSE TYPE
// (used by login + signup)
// =========================
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// =========================
// AUTH CONTEXT TYPE
// =========================
export interface AuthContextType {
  user: User | null;
  token: string | null;

  login: (email: string, password: string) => Promise<AuthResponse>;

  signup: (
    userData: Omit<User, "id" | "registered" | "isAdmin">
  ) => Promise<AuthResponse>;

  logout: () => void;

  isAuthenticated: boolean;
}

// =========================
// REPORT CONTEXT TYPE
// =========================
export interface ReportContextType {
  reports: Incident[];

  addReport: (report: Omit<Incident, "id" | "createdOn">) => Promise<number>;

  updateReport: (id: number, updates: Partial<Incident>) => Promise<boolean>;

  deleteReport: (id: number) => Promise<boolean>;

  getReport: (id: number) => Incident | undefined;

  getUserReports: (userId: number) => Incident[];

  getAllReports: () => Incident[];

  debugReports?: () => void;
}
