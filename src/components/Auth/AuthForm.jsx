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
  background-color: ${props => (props.isLogin ? '#007bff' : '#28a745')};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${props => (props.isLogin ? '#0056b3' : '#218838')};
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.8em;
  margin-top: -5px;
  margin-bottom: 10px;
`;

const SwitchFormButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  margin-top: 10px;
  padding: 0;
  text-decoration: underline;

  &:hover {
    color: #0056b3;
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
        if (isLogin) {
          await login(email, password);
        } else {
          await register(username, email, password);
          await login(email, password); // Auto-login after registration
        }

        const redirectPath = location.state?.from?.pathname || '/';
        navigate(redirectPath);
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