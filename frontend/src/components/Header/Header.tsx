import React from 'react';
import { FiMenu, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

interface HeaderProps {
  title: string;
  onMenuToggle: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

// Create icon components with proper typing
const MenuIcon = () => <FiMenu size={20} />;
const SearchIcon = () => <FiSearch size={16} />;

const Header: React.FC<HeaderProps> = ({ 
  title, 
  onMenuToggle, 
  searchTerm, 
  onSearchChange 
}) => {
  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserDisplayName = () => {
    return `${user?.firstname} ${user?.lastname}`;
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuToggle}>
          <MenuIcon />
        </button>
        <h1 className="header-title">{title}</h1>
      </div>

      <div className="header-right">
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <span className="search-icon">
            <SearchIcon />
          </span>
        </div>

        <div className="user-info">
          <div className="user-avatar">
            {getInitials(getUserDisplayName())}
          </div>
          <div className="user-details">
            <div className="user-name">{getUserDisplayName()}</div>
            <div className={`user-role ${user?.isAdmin ? 'admin' : ''}`}>
              {user?.isAdmin ? 'Administrator' : 'User'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;