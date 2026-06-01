import { useEffect } from "react";
import { useConnections } from "../hooks/useConnections";
import "./Connections.css";

export default function Connections() {
  const { connections, loading, fetchConnections } = useConnections();

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  if (loading) {
    return (
      <div className="connections-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading connections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="connections-container">
      <div className="connections-header">
        <h1>My Connections</h1>
        <p className="connections-subtitle">
          {connections.length} connection{connections.length !== 1 ? "s" : ""}
        </p>
      </div>

      {connections.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤝</div>
          <h2>No connections yet</h2>
          <p>Start connecting with people by accepting their requests!</p>
        </div>
      ) : (
        <div className="connections-grid">
          {connections.map((connection) => (
            <div key={connection._id} className="connection-card">
              <div className="connection-image-wrapper">
                <img
                  src={connection.photoUrl || "/default-avatar.png"}
                  alt={`${connection.name}`}
                  className="connection-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/default-avatar.png";
                  }}
                />
                <div className="status-badge">✓</div>
              </div>

              <div className="connection-content">
                <h3 className="connection-name">
                  {connection.name}
                </h3>

                <div className="connection-info">
                  {connection.age && (
                    <span className="info-item">
                      <span className="info-label">Age:</span> {connection.age}
                    </span>
                  )}
                  {connection.gender && (
                    <span className="info-item">
                      <span className="info-label">Gender:</span>{" "}
                      {connection.gender}
                    </span>
                  )}
                </div>

                {connection.email && (
                  <p className="connection-email">
                    <span className="email-label">📧</span>
                    <a href={`mailto:${connection.email}`}>
                      {connection.email}
                    </a>
                  </p>
                )}

                {connection.about && (
                  <p className="connection-bio">{connection.about}</p>
                )}

                {connection.skills && connection.skills.length > 0 && (
                  <div className="connection-skills">
                    <p className="skills-label">Skills:</p>
                    <div className="skills-container">
                      {connection.skills.map((skill) => (
                        <span key={skill} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button className="message-btn">
                  💬 Send Message
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
