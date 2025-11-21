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
  latitude?: number | string;
  longitude?: number | string;
  status: "draft" | "under investigation" | "resolved" | "rejected";
  images: string[];
  videos: string[];
  comment: string; // <--- updated
  lastModifiedBy?: number;
  lastModifiedAt?: Date;
  adminActions?: AdminAction[];
}

// =========================
// AUTH RESPONSE TYPE
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
// CREATE REPORT DATA TYPE
// =========================
export interface CreateReportData {
  title: string;
  comment: string; // <--- changed from description
  type?: "red-flag" | "intervention";
  status?: "draft" | "under investigation" | "resolved" | "rejected";
  location?: string;
  latitude?: number | string;
  longitude?: number | string;
  file?: File;
  images?: string[]; // optional if you handle multiple files
  videos?: string[]; // optional if you handle multiple files
  createdBy?: number; // optional, set by context or backend
}

// =========================
// REPORT CONTEXT TYPE
// =========================
export interface ReportContextType {
  reports: Incident[];

  addReport: (report: CreateReportData) => Promise<number>;

  updateReport: (id: number, updates: Partial<Incident>) => Promise<boolean>;

  deleteReport: (id: number) => Promise<boolean>;

  getReport: (id: number) => Incident | undefined;

  getUserReports: (userId: number) => Incident[];

  getAllReports: () => Incident[];

  debugReports?: () => void;
}
