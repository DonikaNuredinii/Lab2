import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance'; 

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
      const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth');
          return;
        }

        try {
          const res = await axiosInstance.get('/api/User/me');


          setUser(res.data);
          setForm(res.data);
        } catch (err) {
          console.error(err);
          navigate('/auth');
        }
      };

      fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogout = async () => {
        try {
          await axiosInstance.post('/api/User/logout'); 
        } catch (err) {
          console.warn('Logout failed:', err);
        }
      
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        navigate('/login');
    };

    const handleSave = async () => {
        const updatePayload = {
          firstName: form.firstName,
          lastName: form.lastName,
          phoneNumber: form.phoneNumber,
          password: form.password?.trim() || undefined,
        };
    
        try {
          await axiosInstance.put('/api/User/me', updatePayload);
          alert('Profile updated successfully!');
        } catch (err) {
         console.error('Update failed:', err.response?.data || err.message);
        
          alert('Failed to update profile.');
        }
    };




    if (!user) return <div>Loading...</div>;

    return (
      <div className="settings-layout">
        <aside className="settings-sidebar">
          <div className="profile-avatar">
            <img src="https://via.placeholder.com/100" alt="Avatar" />
            <h3>{user.firstName} {user.lastName}</h3>
          </div>
          <ul className="sidebar-nav">
            <li className="active">Account</li>
            <li>Order History</li>
            <li>Notifications</li>
          </ul>
          <button onClick={handleLogout} className="logout-link">Log Out</button>
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
                <input name="lastName" value={form.lastName || ''} onChange={handleChange} />
              </label>
            </div>
            <div className="form-row">
              <label>
                Email
                <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    readOnly
                />

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
                    value={form.password || ''}
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
