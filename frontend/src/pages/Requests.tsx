import { useEffect, useState } from "react";
import { useRequests } from "../hooks/useRequests";
import { useReviewRequest } from "../hooks/useReviewRequest";
import "./Requests.css";

export default function Requests() {
  const { requests, loading, fetchRequests } = useRequests();
  const { reviewRequest, loading: reviewLoading } = useReviewRequest();
  const [processingId, setProcessingId] = useState<string | null>(null);

  console.log("Requests component rendered with requests:", requests);

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (requestId: string) => {
    console.log("Accepting request with requestId:", requestId);
    setProcessingId(requestId);
    try {
      await reviewRequest(requestId, "accepted");
      // Refetch requests after accepting
      await fetchRequests();
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await reviewRequest(requestId, "rejected");
      // Refetch requests after rejecting
      await fetchRequests();
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="requests-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="requests-container">
      <div className="requests-header">
        <h1>Connection Requests</h1>
        <p className="requests-subtitle">
          {requests.length} pending request{requests.length !== 1 ? "s" : ""}
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h2>No pending requests</h2>
          <p>You don't have any connection requests at the moment.</p>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map((request) => (
            <div key={request._id} className="request-card">
              <div className="request-header">
                <img
                  src={request?.senderId?.photoUrl || "/default-avatar.png"}
                  alt={`${request?.senderId?.name}`}
                  className="request-avatar"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/default-avatar.png";
                  }}
                />
              </div>

              <div className="request-body">
                <h3 className="request-name">
                  {request?.senderId?.name}{" "}
                </h3>

                {request?.senderId?.age && (
                  <p className="request-age">
                    {request?.senderId?.age} years old
                  </p>
                )}

                {request?.senderId?.gender && (
                  <p className="request-gender">
                    {request?.senderId?.gender}
                  </p>
                )}

                {request?.senderId?.skills &&
                  request?.senderId?.skills.length > 0 && (
                    <div className="request-skills">
                      {request?.senderId?.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="skill-badge">
                          {skill}
                        </span>
                      ))}
                      {request?.senderId?.skills.length > 3 && (
                        <span className="skill-badge more">
                          +{request?.senderId?.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                <p className="request-time">
                  {/* {new Date(request?.createdAt).toLocaleDateString()} */}
                </p>
              </div>

              <div className="request-actions">
                <button
                  className="action-btn accept-btn"
                  onClick={() => handleAccept(request._id)}
                  disabled={reviewLoading || processingId === request?._id}
                  title="Accept connection request"
                >
                  {processingId === request?._id && reviewLoading ? (
                    <span className="button-spinner"></span>
                  ) : (
                    <>✓ Accept</>
                  )}
                </button>
                <button
                  className="action-btn reject-btn"
                  onClick={() => handleReject(request._id)}
                  disabled={reviewLoading || processingId === request?._id}
                  title="Reject connection request"
                >
                  {processingId === request?._id && reviewLoading ? (
                    <span className="button-spinner"></span>
                  ) : (
                    <>✕ Reject</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
