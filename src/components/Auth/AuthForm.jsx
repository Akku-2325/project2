// src/components/Auth/AuthForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import validator from 'validator';

const AuthFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  margin: 50px auto; /* Centered vertically and horizontally with top margin */
  padding: 30px; /* Increased padding */
  border: 1px solid #ced4da; /* Softer border color */
  border-radius: 8px; /* Slightly more rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  background-color: #f8f9fa; /* Light background color */
`;

const Input = styled.input`
  margin-bottom: 15px; /* Increased margin */
  padding: 12px; /* Increased padding */
  border: 1px solid #ced4da;
  border-radius: 6px; /* Slightly more rounded corners */
  font-size: 16px; /* Increased font size */
  color: #495057; /* Darker text color */
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; /* Smooth transition */

  &:focus {
    outline: none;
    border-color: #80bdff; /* Focus color */
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25); /* Focus shadow */
  }
`;

const Button = styled.button`
  padding: 12px 20px; /* Increased padding */
  font-size: 16px; /* Increased font size */
  background-color: ${props => (props.isLogin ? '#007bff' : '#28a745')};
  color: white;
  border: none;
  border-radius: 6px; /* Slightly more rounded corners */
  cursor: pointer;
  transition: background-color 0.15s ease-in-out; /* Smooth transition */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */

  &:hover {
    background-color: ${props => (props.isLogin ? '#0056b3' : '#218838')};
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545; /* Red error color */
  font-size: 0.9em; /* Slightly larger error font */
  margin-top: -10px; /* Adjusted margin */
  margin-bottom: 15px; /* Increased margin */
`;

const SwitchFormButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  margin-top: 20px; /* Increased margin */
  padding: 0;
  text-decoration: none; /* Remove underline */
  font-size: 14px; /* Adjusted font size */
  transition: color 0.15s ease-in-out; /* Smooth transition */

  &:hover {
    color: #0056b3;
    text-decoration: underline; /* Add underline on hover */
  }
`;

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const validateForm = () => {
    let isValid = true;
    setUsernameError('');
    setEmailError('');
    setPasswordError('');

    if (!isLogin && username.length < 3) {
      setUsernameError('Username must be at least 3 characters long');
      isValid = false;
    }

    if (!validator.isEmail(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        let userData;
        if (isLogin) {
          userData = await login(email, password);
        } else {
          await register(username, email, password);
          userData = await login(email, password); // Auto-login after registration
        }

        // Check user role and redirect accordingly
        if (userData.role === 'admin') {
          navigate('/admin');
        } else {
          const redirectPath = location.state?.from?.pathname || '/';
          navigate(redirectPath);
        }
      } catch (error) {
        console.error('Authentication failed:', error);
        if (error.message === 'Email is already registered') {
          setEmailError(error.message);
        } else {
          alert(`Authentication failed: ${error.message || 'Something went wrong'}`);
        }
      }
    }
  };
  
  const switchForm = () => {
    setIsLogin(!isLogin);
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <AuthFormContainer>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && <ErrorMessage>{usernameError}</ErrorMessage>}
          </>
        )}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
        <Button type="submit" disabled={loading} isLogin={isLogin}>
          {loading
            ? isLogin
              ? 'Logging in...'
              : 'Registering...'
            : isLogin
            ? 'Login'
            : 'Register'}
        </Button>
      </form>
      <SwitchFormButton type="button" onClick={switchForm}>
        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
      </SwitchFormButton>
    </AuthFormContainer>
  );
}

export default AuthForm;