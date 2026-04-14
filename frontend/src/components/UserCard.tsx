import { useState } from "react";
import type { UserProfile } from "../hooks/useUserFeed";
import "./UserCard.css";

interface UserCardProps {
  user: UserProfile;
  onIgnore?: (userId: string) => void;
  onInterested?: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onIgnore, onInterested }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleIgnore = async () => {
    setIsLoading(true);
    try {
      await onIgnore?.(user._id);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterested = async () => {
    setIsLoading(true);
    try {
      await onInterested?.(user._id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-card">
      <div className="user-card-image">
        {user.photoUrl ? (
          <img src={user.photoUrl} alt={user.name} />
        ) : (
          <div className="user-card-placeholder">
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              {/* Smiley face */}
              <circle cx="50" cy="50" r="45" fill="#FF4444" />
              {/* Left eye */}
              <circle cx="35" cy="40" r="8" fill="white" />
              {/* Right eye */}
              <circle cx="65" cy="40" r="8" fill="white" />
              {/* Smile */}
              <path
                d="M 35 60 Q 50 75 65 60"
                stroke="white"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="user-card-content">
        <div className="user-card-header">
          <h2 className="user-name">{user.name}</h2>
          {user.age && user.gender && (
            <p className="user-age-gender">
              {user.age}, {user.gender}
            </p>
          )}
        </div>

        {user.about && (
          <div className="user-about">
            <p>{user.about}</p>
          </div>
        )}

        <div className="user-card-actions">
          <button
            className="btn btn-ignore"
            onClick={handleIgnore}
            disabled={isLoading}
          >
            Ignore
          </button>
          <button
            className="btn btn-interested"
            onClick={handleInterested}
            disabled={isLoading}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
