"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getUserProfile, updateProfile, changePassword, deleteAccount } from "../api/userService"
import "../assets/styles/profile.css"

const Profile = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)

  const [profileData, setProfileData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      language: "en",
      timezone: "UTC",
    },
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await getUserProfile()
      setProfile(data)
      setProfileData({
        email: data.email || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        preferences: data.preferences || {
          emailNotifications: true,
          smsNotifications: false,
          language: "en",
          timezone: "UTC",
        },
      })
    } catch (err) {
      setError("Failed to load profile")
      console.error("Error loading profile:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    try {
      setError("")
      setSuccessMessage("")
      const updatedProfile = await updateProfile(profileData)
      setProfile(updatedProfile)
      setIsEditing(false)
      setSuccessMessage("Profile updated successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile")
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    try {
      setError("")
      setSuccessMessage("")
      await changePassword(passwordData)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setSuccessMessage("Password changed successfully!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      setError(err.response?.data || "Failed to change password")
    }
  }

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone and will remove all your personal data in compliance with GDPR.",
      )
    ) {
      if (
        window.confirm("This will permanently delete your account and all associated data. Are you absolutely sure?")
      ) {
        try {
          await deleteAccount()
          logout()
          navigate("/login", {
            state: { message: "Account deleted successfully" },
          })
        } catch (err) {
          setError(err.response?.data || "Failed to delete account")
        }
      }
    }
  }

  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-spinner">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="profile-container">
        <h1>My Profile</h1>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="profile-tabs">
          <button
            className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile Information
          </button>
          <button
            className={`tab-button ${activeTab === "password" ? "active" : ""}`}
            onClick={() => setActiveTab("password")}
          >
            Change Password
          </button>
          <button
            className={`tab-button ${activeTab === "danger" ? "active" : ""}`}
            onClick={() => setActiveTab("danger")}
          >
            Account Settings
          </button>
        </div>

        {activeTab === "profile" && (
          <div className="tab-content">
            <div className="profile-header">
              <h3>Profile Information</h3>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phoneNumber}
                    onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    className="form-control"
                    rows="3"
                  />
                </div>

                <div className="preferences-section">
                  <h4>Preferences</h4>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={profileData.preferences.emailNotifications}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            preferences: {
                              ...profileData.preferences,
                              emailNotifications: e.target.checked,
                            },
                          })
                        }
                      />
                      Email Notifications
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={profileData.preferences.smsNotifications}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            preferences: {
                              ...profileData.preferences,
                              smsNotifications: e.target.checked,
                            },
                          })
                        }
                      />
                      SMS Notifications
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-display">
                <div className="profile-info">
                  <div className="info-item">
                    <label>Username:</label>
                    <span>{profile?.username}</span>
                  </div>
                  <div className="info-item">
                    <label>Full Name:</label>
                    <span>
                      {profile?.firstName} {profile?.lastName}
                    </span>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{profile?.email || "Not provided"}</span>
                  </div>
                  <div className="info-item">
                    <label>Phone:</label>
                    <span>{profile?.phoneNumber || "Not provided"}</span>
                  </div>
                  <div className="info-item">
                    <label>Address:</label>
                    <span>{profile?.address || "Not provided"}</span>
                  </div>
                  <div className="info-item">
                    <label>Member Since:</label>
                    <span>{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Unknown"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "password" && (
          <div className="tab-content">
            <h3>Change Password</h3>
            <form onSubmit={handlePasswordChange} className="password-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Change Password
              </button>
            </form>
          </div>
        )}

        {activeTab === "danger" && (
          <div className="tab-content danger-zone">
            <h3>Danger Zone</h3>
            <div className="danger-section">
              <h4>Delete Account</h4>
              <p>
                Permanently delete your account and all associated data. This action cannot be undone. In compliance
                with GDPR:
              </p>
              <ul>
                <li>Your personal information will be permanently deleted</li>
                <li>Your cart will be cleared</li>
                <li>Order history will be anonymized for legal compliance</li>
                <li>You will be immediately logged out</li>
              </ul>
              <button onClick={handleDeleteAccount} className="btn btn-danger">
                Delete My Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
