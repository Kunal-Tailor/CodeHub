import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import "./createRepo.css";

const CreateRepo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    if (!name.trim()) {
      alert("Repository name is required!");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:3002/repo/create", {
        name: name.trim(),
        description: description.trim(),
        visibility,
        owner: userId,
        content: [],
        issues: [],
      });

      setLoading(false);
      navigate("/");
    } catch (err) {
      console.error("Error creating repository:", err);
      alert(err.response?.data?.error || "Failed to create repository");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-repo-container" id="create-repo-page">
        <div className="create-repo-form-wrapper">
          <h1>Create a new repository</h1>
          <p className="create-repo-subtitle">
            A repository contains all project files, including the revision history.
          </p>

          <hr className="divider" />

          <form onSubmit={handleCreate} className="create-repo-form">
            {/* Repository Name */}
            <div className="form-group">
              <label htmlFor="repo-name" className="form-label">
                Repository name <span className="required">*</span>
              </label>
              <input
                id="repo-name"
                type="text"
                className="form-input"
                placeholder="my-awesome-project"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
                autoFocus
              />
              <p className="form-hint">
                Great repository names are short and memorable.
              </p>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="repo-description" className="form-label">
                Description <span className="optional">(optional)</span>
              </label>
              <input
                id="repo-description"
                type="text"
                className="form-input"
                placeholder="A short description of the repository"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoComplete="off"
              />
            </div>

            <hr className="divider" />

            {/* Visibility */}
            <div className="form-group">
              <label className="form-label">Visibility</label>
              <div className="visibility-options">
                <label
                  className={`visibility-option ${visibility ? "active" : ""}`}
                  htmlFor="visibility-public"
                >
                  <input
                    type="radio"
                    id="visibility-public"
                    name="visibility"
                    checked={visibility}
                    onChange={() => setVisibility(true)}
                  />
                  <div className="visibility-icon">
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Z" />
                    </svg>
                  </div>
                  <div>
                    <strong>Public</strong>
                    <p>Anyone can see this repository.</p>
                  </div>
                </label>

                <label
                  className={`visibility-option ${!visibility ? "active" : ""}`}
                  htmlFor="visibility-private"
                >
                  <input
                    type="radio"
                    id="visibility-private"
                    name="visibility"
                    checked={!visibility}
                    onChange={() => setVisibility(false)}
                  />
                  <div className="visibility-icon">
                    <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M4 4a4 4 0 0 1 8 0v2h.25c.966 0 1.75.784 1.75 1.75v5.5A1.75 1.75 0 0 1 12.25 15h-8.5A1.75 1.75 0 0 1 2 13.25v-5.5C2 6.784 2.784 6 3.75 6H4Zm8.25 3.5h-8.5a.25.25 0 0 0-.25.25v5.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25v-5.5a.25.25 0 0 0-.25-.25ZM10.5 6V4a2.5 2.5 0 1 0-5 0v2Z" />
                    </svg>
                  </div>
                  <div>
                    <strong>Private</strong>
                    <p>You choose who can see this repository.</p>
                  </div>
                </label>
              </div>
            </div>

            <hr className="divider" />

            <button
              type="submit"
              className="btn-create"
              disabled={loading || !name.trim()}
              id="create-repo-btn"
            >
              {loading ? "Creating..." : "Create repository"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateRepo;
