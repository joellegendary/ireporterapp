import React from "react";
import "./ProfileCard.css";
import { useReports } from "../../context/ReportContext";
import { User } from "../../utils/types";

interface ProfileCardProps {
  user?: User | null;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const { reports } = useReports();

  const userReports = reports.filter((r) => r.createdBy === user?.id);
  const redFlags = userReports.filter((r) => r.type === "red-flag").length;
  const interventions = userReports.filter(
    (r) => r.type === "intervention"
  ).length;
  const resolved = userReports.filter((r) => r.status === "resolved").length;
  const pending = userReports.filter(
    (r) => r.status === "under-investigation"
  ).length;
  const rejected = userReports.filter((r) => r.status === "rejected").length;

  return (
    <div className="profile-card">
      <h2>
        {user?.firstname} {user?.lastname}
      </h2>
      <p>Email: {user?.email}</p>
      <div className="stats">
        <span>Total Reports: {userReports.length}</span>
        <span>Red-Flags: {redFlags}</span>
        <span>Interventions: {interventions}</span>
        <span>Resolved: {resolved}</span>
        <span>Pending: {pending}</span>
        <span>Rejected: {rejected}</span>
      </div>
    </div>
  );
};

export default ProfileCard;
