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
  registered: string; // ISO date
}

// =========================
// INCIDENT / REPORT TYPE
// =========================
export interface Incident {
  id: number;
  createdBy: number; // user id
  type: "red-flag" | "intervention";
  title: string;
  comment: string;
  status:
    | "draft"
    | "submitted"
    | "under-investigation"
    | "resolved"
    | "rejected";
  location: string;
  images: string[];
  videos: string[];
  createdOn: string; // ISO date
  updatedOn?: string;
}

// =========================
// ADMIN ACTION TYPE
// =========================
export interface AdminAction {
  id: string;
  adminId: number;
  actionType: "approve" | "reject" | "update-status";
  incidentId: number;
  timestamp: string;
  details?: string;
}

// =========================
// REPORT CONTEXT TYPE
// =========================
export interface ReportContextType {
  reports: Incident[];
  loading?: boolean;
  error?: string | null;

  // FIXED: Now matches your ReportProvider's signature
  addReport: (report: Omit<Incident, "id" | "createdOn">) => Promise<number>;

  updateReport: (id: number, updates: Partial<Incident>) => Promise<boolean>;
  deleteReport: (id: number) => Promise<boolean>;

  getReport: (id: number) => Incident | undefined;
  getUserReports: (userId: number) => Incident[];
  getAllReports: () => Incident[];

  debugReports?: () => void;
}
