// src/components/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Импортируем AuthContext
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';

const ProfileContainer = styled.div`
  padding: 20px;
`;

const ProfileInfo = styled.div`
  margin-bottom: 20px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.8em;
  margin-top: -5px;
  margin-bottom: 10px;
`;

function Profile() {
  const { user, token, loading: authLoading } = useAuth(); // Теперь получаем и токен
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        //Проверка наличия токена и пользователя
        if (!token || !user) {
          throw new Error("No token available or user not logged in");
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
          },
        });

        if (!response.ok) {
          //Если ошибка 401, перенаправляем на страницу логина
          if (response.status === 401) {
            navigate("/auth");
          }
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = await response.json();
        setProfile(data);
        setUsername(data.username);
        setEmail(data.email);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, user, navigate]); // Зависимость от токена, user и navigate

  const validateForm = () => {
    let isValid = true;
    setEmailError('');

    if (!validator.isEmail(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update profile: ${response.status}`);
        }

        const data = await response.json();
        setProfile(data);
        alert('Profile updated successfully');
      } catch (error) {
        console.error("Error updating profile:", error);
        setError(error.message || "Failed to update profile");
      } finally {
        setLoading(false);
      }
    }
  };

  if (authLoading || loading) {
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
      </ProfileInfo>
      <FormContainer>
        <h2>Edit Profile</h2>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
        <Button onClick={handleSubmit}>Update Profile</Button>
      </FormContainer>
    </ProfileContainer>
  );
}

export default Profile;