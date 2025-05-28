import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { githubService } from '../../services/api';


const GitHubCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing GitHub connection...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`GitHub authorization failed: ${error}`);
          return;
        }

        if (!code || !state) {
          setStatus('error');
          setMessage('Missing authorization code or state parameter');
          return;
        }

        // Exchange code for token
        const response = await githubService.exchangeCode(code, state);
        
        if (response.data.success) {
          setStatus('success');
          setMessage(`Successfully connected GitHub account: ${response.data.data.username}`);
          
          // Redirect back to projects after a short delay
          setTimeout(() => {
            navigate('/projects', { replace: true });
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Failed to connect GitHub account');
        }
      } catch (err: any) {
        console.error('GitHub callback error:', err);
        setStatus('error');
        setMessage(err.response?.data?.message || 'Failed to connect GitHub account');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return '⏳';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return '#4caf50';
      case 'error':
        return '#f44336';
      default:
        return '#2196f3';
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f7ff',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '3rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '500px'
      }}>
        <div style={{
          fontSize: '3rem',
          marginBottom: '1rem'
        }}>
          {getStatusIcon()}
        </div>
        
        <h2 style={{
          color: getStatusColor(),
          marginBottom: '1rem'
        }}>
          GitHub Integration
        </h2>
        
        <p style={{
          color: '#666',
          fontSize: '1.1rem',
          lineHeight: '1.5',
          marginBottom: '2rem'
        }}>
          {message}
        </p>
        
        {status === 'loading' && (
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e3f2fd',
            borderTop: '4px solid #2196f3',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
        )}
        
        {status === 'error' && (
          <button
            onClick={() => navigate('/projects')}
            style={{
              backgroundColor: '#4a6cfa',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
          >
            Back to Projects
          </button>
        )}
        
        {status === 'success' && (
          <p style={{
            color: '#666',
            fontSize: '0.9rem',
            fontStyle: 'italic'
          }}>
            Redirecting you back to projects...
          </p>
        )}
      </div>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default GitHubCallback;