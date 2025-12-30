import { useState, useEffect } from 'react';
import type { GitLabUser } from '../types/gitlab';
import './UserFilter.css';

interface UserFilterProps {
  allUsers: GitLabUser[];
  selectedUserIds: number[];
  onSelectionChange: (userIds: number[]) => void;
}

export function UserFilter({ allUsers, selectedUserIds, onSelectionChange }: UserFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleUser = (userId: number) => {
    if (selectedUserIds.includes(userId)) {
      onSelectionChange(selectedUserIds.filter((id) => id !== userId));
    } else {
      onSelectionChange([...selectedUserIds, userId]);
    }
  };

  const handleSelectAll = () => {
    onSelectionChange(allUsers.map((u) => u.id));
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  useEffect(() => {
    // Initialize with all users selected
    if (allUsers.length > 0 && selectedUserIds.length === 0) {
      onSelectionChange(allUsers.map((u) => u.id));
    }
  }, [allUsers, selectedUserIds.length, onSelectionChange]);

  const selectedCount = selectedUserIds.length;
  const totalCount = allUsers.length;

  return (
    <div className="user-filter">
      <button className="filter-toggle" onClick={() => setIsOpen(!isOpen)}>
        👥 Filter Users ({selectedCount}/{totalCount})
      </button>

      {isOpen && (
        <div className="filter-dropdown">
          <div className="filter-header">
            <input
              type="text"
              className="filter-search"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="filter-actions">
              <button onClick={handleSelectAll} className="filter-action-btn">
                Select All
              </button>
              <button onClick={handleClearAll} className="filter-action-btn">
                Clear All
              </button>
            </div>
          </div>

          <div className="filter-list">
            {filteredUsers.map((user) => (
              <label key={user.id} className="filter-item">
                <input
                  type="checkbox"
                  checked={selectedUserIds.includes(user.id)}
                  onChange={() => handleToggleUser(user.id)}
                />
                <img src={user.avatar_url} alt={user.name} className="filter-avatar" />
                <div className="filter-user-info">
                  <div className="filter-user-name">{user.name}</div>
                  <div className="filter-user-username">@{user.username}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
