// src/components/Dashboard/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile, updateUserProfile, uploadProfileAvatar } from "../../lib/supabase";

const UserProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    avatarUrl: "",
    currency: "LKR",
    language: "en",
    theme: "light"
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      setLoading(true);
      setError("");

      try {
        const { data, error } = await getUserProfile();

        if (error) {
          setError("Failed to load profile");
          return;
        }

        if (data) {
          setFormData({
            fullName: data.full_name || user.user_metadata?.full_name || "",
            avatarUrl: data.avatar_url || "",
            currency: data.currency || "LKR",
            language: data.language || "en",
            theme: data.theme || "light"
          });
        } else {
          setFormData((prev) => ({
            ...prev,
            fullName: user.user_metadata?.full_name || ""
          }));
        }
      } catch (err) {
        console.error("Profile load error:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const { data, error } = await uploadProfileAvatar(file);

      if (error) {
        setError("Failed to upload image. Please try again.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        avatarUrl: data.publicUrl
      }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const { error } = await updateUserProfile({
        fullName: formData.fullName,
        avatarUrl: formData.avatarUrl,
        currency: formData.currency,
        language: formData.language,
        theme: formData.theme
      });

      if (error) {
        setError(error.message || "Failed to update profile");
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-card">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <h3 className="card-title">Profile Settings</h3>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="form-input"
            placeholder="Your name"
            required
          />
        </div>

        <div className="form-group">
          <label>Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="form-input"
            disabled={uploading}
          />
          <small style={{ color: "#718096", marginTop: "4px", display: "block" }}>
            JPG, PNG, or GIF (max 5MB)
          </small>
        </div>

        {uploading && (
          <div className="form-group">
            <p style={{ color: "#4299e1" }}>Uploading image...</p>
          </div>
        )}

        {formData.avatarUrl && !uploading && (
          <div className="form-group">
            <label>Preview</label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src={formData.avatarUrl}
                alt="Profile preview"
                style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover" }}
              />
              <span style={{ color: "#718096" }}>Profile photo</span>
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="form-select"
          >
            <option value="LKR">LKR - Sri Lankan Rupee</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="INR">INR - Indian Rupee</option>
          </select>
        </div>

        <div className="form-group">
          <label>Language</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="form-select"
          >
            <option value="en">English</option>
            <option value="si">Sinhala</option>
            <option value="ta">Tamil</option>
          </select>
        </div>

        <div className="form-group">
          <label>Theme</label>
          <select
            name="theme"
            value={formData.theme}
            onChange={handleChange}
            className="form-select"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {error && <div style={{ color: "#d32f2f", marginBottom: "10px" }}>{error}</div>}
        {success && <div style={{ color: "#4caf50", marginBottom: "10px" }}>Profile updated successfully!</div>}

        <button
          type="submit"
          className="btn-primary"
          disabled={saving || uploading}
          style={{ marginTop: "20px" }}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
