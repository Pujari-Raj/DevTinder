import { useState } from "react";
import { useUserFeed } from "../hooks/useUserFeed";
import UserCard from "../components/UserCard";
import { sendConnectionRequest, sendIgnoreRequest } from "../services/requestService";
import "./Feed.css";

const Feed = () => {
  const { users, isLoading, error, refetch } = useUserFeed({
    page: 1,
    limit: 10,
  });
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  const currentUser = users[currentUserIndex];

  const handleIgnore = async (userId: string) => {
    setActionLoading(true);
    try {
      const response = await sendIgnoreRequest(userId);
      if (response.success) {
        moveToNextUser();
      }
    } catch (err) {
      console.error("Ignore failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleInterested = async (userId: string) => {
    setActionLoading(true);
    try {
      const response = await sendConnectionRequest(userId);
      if (response.success) {
        moveToNextUser();
      }
    } catch (err) {
      console.error("Interested failed:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const moveToNextUser = () => {
    if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    } else {
      // Optionally refetch for more users
      refetch();
      setCurrentUserIndex(0);
    }
  };

  if (isLoading) {
    return (
      <div className="feed-container">
        <div className="loading">Loading users...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="feed-container">
        <div className="no-users">No users available at the moment</div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-content">
        {currentUser && (
          <UserCard
            user={currentUser}
            onIgnore={handleIgnore}
            onInterested={handleInterested}
          />
        )}
      </div>
      {actionLoading && <div className="action-loading">Processing...</div>}
    </div>
  );
};

export default Feed;