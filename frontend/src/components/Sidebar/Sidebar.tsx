import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/ireportlogo.png";
import {
  FiHome,
  FiFileText,
  FiPlusSquare,
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiShield,
} from "react-icons/fi";
import "./Sidebar.css";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

// Navigation item interface - FIXED: Changed JSX.Element to React.ReactNode
interface NavItem {
  path: string;
  icon: React.ReactNode; // FIX: Changed from JSX.Element to React.ReactNode
  label: string;
  isAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Icon components with proper typing
  const HomeIcon = () => <FiHome className="nav-icon" />;
  const FileTextIcon = () => <FiFileText className="nav-icon" />;
  const PlusSquareIcon = () => <FiPlusSquare className="nav-icon" />;
  const UserIcon = () => <FiUser className="nav-icon" />;
  const ShieldIcon = () => <FiShield className="nav-icon" />;
  const LogoutIcon = () => <FiLogOut className="nav-icon logout-icon" />;
  const ChevronLeftIcon = () => <FiChevronLeft className="toggle-icon" />;
  const ChevronRightIcon = () => <FiChevronRight className="toggle-icon" />;

  // Common navigation items for all users
  const commonNavItems: NavItem[] = [
    { path: "/dashboard", icon: <HomeIcon />, label: "Dashboard" },
    { path: "/reports", icon: <FileTextIcon />, label: "My Reports" },
    {
      path: "/create-report",
      icon: <PlusSquareIcon />,
      label: "Create Report",
    },
    { path: "/profile", icon: <UserIcon />, label: "Profile" },
  ];

  // Admin-only navigation items
  const adminNavItems: NavItem[] = [
    {
      path: "/admin",
      icon: <ShieldIcon />,
      label: "Admin Dashboard",
      isAdmin: true,
    },
  ];

  // Combine navigation items based on user role
  // Admins will see common items + 'Admin Dashboard'
  const navItems: NavItem[] = user?.isAdmin
    ? [...commonNavItems, ...adminNavItems]
    : commonNavItems;

  const handleNavClick = () => {
    if (window.innerWidth <= 768) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && <div className="mobile-overlay" onClick={onMobileClose} />}

      <div
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}
      >
        {/* Toggle Button */}
        <div className="sidebar-toggle" onClick={onToggle}>
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </div>

        {/* Header with Logo */}
        <div className="sidebar-header">
          <div className="logo-container">
            <img src={logo} alt="iReporter Logo" className="sidebar-logo" />
            {!isCollapsed && <span className="logo-text">iReporter</span>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? "active" : ""} ${item.isAdmin ? "admin-item" : ""}`}
                onClick={handleNavClick}
              >
                <span className="nav-icon-wrapper">{item.icon}</span>
                {!isCollapsed && (
                  <div className="nav-content">
                    <span className="nav-label">{item.label}</span>
                    {item.isAdmin && <span className="admin-badge">Admin</span>}
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* Logout Section */}
          <div className="nav-section logout-section">
            <button onClick={handleLogout} className="nav-item logout-button">
              <span className="nav-icon-wrapper">
                <LogoutIcon />
              </span>
              {!isCollapsed && <span className="nav-label">Logout</span>}
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
