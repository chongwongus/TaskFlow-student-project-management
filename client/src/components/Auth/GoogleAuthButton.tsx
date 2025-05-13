import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import './Auth.scss'; // Now this will reference the file in the same directory

const GoogleAuthButton: React.FC = () => {
  const { login } = useAuth();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const token = credentialResponse.credential;
      if (!token) {
        console.error('No token received from Google');
        return;
      }

      // In a production app, you would send this token to your backend
      // where it would be verified with Google and used to create/update a user
      // For now, we'll just use the token directly
      
      // Save the token and update auth context
      await login(token);

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