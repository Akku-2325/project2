// src/components/Profile/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from 'context/AuthContext'; //  <--  Изменен путь импорта
import styled from 'styled-components';

const ProfileContainer = styled.div`
  padding: 20px;
`;

const ProfileInfo = styled.div`
  margin-bottom: 20px;
`;

function Profile() {
  const { user, token } = useAuth(); // Теперь получаем и токен
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        //Проверка наличия токена
        if (!token) {
          throw new Error("No token available");
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]); // Зависимость от токена, чтобы обновить профиль при смене токена

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>No profile information available.</div>;
  }

  return (
    <ProfileContainer>
      <ProfileInfo>
        <h2>Profile Information</h2>
        <p>Username: {profile.username}</p>
        <p>Email: {profile.email}</p>
        {/* Add more profile information here */}
      </ProfileInfo>
      {/* Add a form for updating profile information here */}
    </ProfileContainer>
  );
}

export default Profile;