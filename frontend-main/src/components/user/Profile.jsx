import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [userRepos, setUserRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const [userRes, repoRes] = await Promise.all([
          axios.get(`http://localhost:3002/userProfile/${userId}`),
          fetch(`http://localhost:3002/repo/user/${userId}`).then((r) =>
            r.json()
          ),
        ]);
        setUserDetails(userRes.data);
        setUserRepos(repoRes.repositories || []);
      } catch (err) {
        console.error("Cannot fetch user details: ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    navigate("/auth");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="profile-page-wrapper" id="profile-page">
        {/* Left: User info */}
        <div className="user-profile-section">
          <div className="profile-avatar">
            <svg width="40" height="40" viewBox="0 0 16 16" fill="currentColor">
              <path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" />
            </svg>
          </div>

          <div className="profile-name">
            <h2>{userDetails?.username || "User"}</h2>
            <p className="profile-email">{userDetails?.email || ""}</p>
          </div>

          <button className="follow-btn">Follow</button>

          <div className="profile-stats">
            <div className="stat">
              <strong>{userDetails?.followedUsers?.length || 0}</strong>
              <span>followers</span>
            </div>
            <span className="stat-dot">·</span>
            <div className="stat">
              <strong>{userRepos.length}</strong>
              <span>repositories</span>
            </div>
          </div>

          <button onClick={handleLogout} className="btn-logout" id="logout">
            Sign out
          </button>
        </div>

        {/* Right: Content */}
        <div className="profile-content">
          {/* Heatmap */}
          <div className="heat-map-section">
            <HeatMapProfile />
          </div>

          {/* User Repos */}
          <div className="profile-repos">
            <h3>Repositories</h3>
            <div className="repo-card-wrapper">
              {userRepos.length === 0 ? (
                <p className="empty-text">No repositories yet.</p>
              ) : (
                userRepos.map((repo) => (
                  <div key={repo._id} className="repo">
                    <div>
                      <span className="repo-name">{repo.name}</span>
                      <span
                        className={`repo-badge ${
                          repo.visibility ? "public" : "private"
                        }`}
                      >
                        {repo.visibility ? "Public" : "Private"}
                      </span>
                    </div>
                    {repo.description && (
                      <p className="description">{repo.description}</p>
                    )}
                    <div className="repo-meta">
                      <span className="repo-lang">
                        <span className="lang-dot"></span>
                        JavaScript
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
