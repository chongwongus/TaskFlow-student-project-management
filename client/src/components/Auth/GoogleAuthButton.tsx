import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Auth.scss';

const GoogleAuthButton: React.FC = () => {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const token = credentialResponse.credential;
      if (!token) {
        console.error('No token received from Google');
        return;
      }

      // Use the token with our backend
      await googleLogin(token);
      navigate('/projects');
    } catch (error) {
      console.error('Google auth error:', error);
    }
  };

  const handleError = () => {
    console.error('Google Login Failed');
  };

  return (
    <div className="google-auth-button">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
      />
    </div>
  );
};

export default GoogleAuthButton;
