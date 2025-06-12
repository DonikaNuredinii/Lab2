import React, { useEffect, useState } from "react";
import "../CSS/ProfilePage.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { FaArrowLeft } from "react-icons/fa";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axiosInstance.get("/api/User/me");
        console.log("🔍 User fetched:", res.data);
        setUser(res.data);
        setForm(res.data);
      } catch (err) {
        console.error("Fetch profile error:", err);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogout = async () => {
  try {
    // Call logout endpoint (must clear cookie on server)
    await axiosInstance.post("/api/User/logout", null, {
      withCredentials: true,
    });
    console.log("🔓 Logout request successful");
  } catch (err) {
    console.warn("Logout failed:", err);
  } finally {
    // Clear client storage
    localStorage.clear();

    // Optional: manually expire the cookie (not always reliable)
    document.cookie =
      "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    navigate("/login");
    console.log("👋 Logged out");

  }
};


  const handleSave = async () => {
    const updatePayload = {
      firstName: form.firstName,
      lastName: form.lastName,
      phoneNumber: form.phoneNumber,
      password: form.password?.trim() || undefined,
    };

    try {
      await axiosInstance.put("/api/User/me", updatePayload);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Failed to update profile.");
    }
  };

  if (!user) return <div>Loading...</div>;

  const role = (user?.roleName || "").toLowerCase();
  console.log("🧠 Normalized role:", role);

  return (
    <div className="settings-layout">
      <aside className="settings-sidebar">
        <button onClick={() => navigate("/online-menu")} className="back-button">
          <FaArrowLeft />
        </button>

        <div className="profile-avatar">
          <h3>{user.firstName} {user.lastName}</h3>
        </div>

        <ul className="sidebar-nav">
          <li className="active">Account</li>

          {(role === "admin" || role === "superadmin") && (
  <li
    onClick={() =>
      role === "superadmin"
        ? navigate("/superadmin")
        : navigate("/admin")
    }
  >
    Dashboard
  </li>
)}


          <li>Notifications</li>
        </ul>

        <button onClick={handleLogout} className="logout-link">
          Log Out
        </button>
      </aside>

      <main className="settings-content">
        <h2>Account Settings</h2>
        <form className="settings-form">
          <div className="form-row">
            <label>
              First Name
              <input name="firstName" value={form.firstName} onChange={handleChange} />
            </label>
            <label>
              Last Name
              <input name="lastName" value={form.lastName || ""} onChange={handleChange} />
            </label>
          </div>

          <div className="form-row">
            <label>
              Email
              <input name="email" value={form.email} onChange={handleChange} readOnly />
            </label>
            <label>
              Phone
              <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
            </label>
          </div>

          <div className="form-row">
            <label>
              Password
              <input
                type="password"
                name="password"
                placeholder="********"
                value={form.password || ""}
                onChange={handleChange}
              />
            </label>
          </div>

          <div className="action-links">
            <button type="button" onClick={handleSave} className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default ProfilePage;
