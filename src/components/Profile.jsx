import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import { theme } from '../utils/theme'; // Импортируем theme

const ProfileContainer = styled.div`
  padding: ${theme.spacing.xlarge};
  text-align: center;
  background-color: ${theme.colors.secondary};
`;

const ProfileInfo = styled.div`
  margin-bottom: ${theme.spacing.large};
  border: 1px solid ${theme.colors.accentLight};
  padding: ${theme.spacing.medium};
  border-radius: ${theme.borderRadius};
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  margin: 0 auto;
  padding: ${theme.spacing.large};
  border: 1px solid ${theme.colors.accentLight};
  border-radius: ${theme.borderRadius};
  background-color: white;
`;

const Input = styled.input`
  margin-bottom: ${theme.spacing.small};
  padding: ${theme.spacing.small};
  border: 1px solid ${theme.colors.accentLight};
  border-radius: ${theme.borderRadius};
  font-size: ${theme.fontSizes.medium};

  &:focus {
    outline: none;
    border-color: ${theme.colors.accent};
  }
`;

const Button = styled.button`
  padding: ${theme.spacing.medium};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.secondary};
  border: none;
  border-radius: ${theme.borderRadius};
  cursor: pointer;
  font-size: ${theme.fontSizes.medium};
  transition: ${theme.transition};

  &:hover {
    background-color: ${theme.colors.primaryDark};
  }
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  font-size: ${theme.fontSizes.small};
  margin-top: -${theme.spacing.xsmall};
  margin-bottom: ${theme.spacing.small};
`;

function Profile() {
  const { user, token, loading: authLoading } = useAuth();
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
        if (!token || !user) {
          throw new Error("No token available or user not logged in");
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
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
  }, [token, user, navigate]);

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