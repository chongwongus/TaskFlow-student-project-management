import React, { useState } from 'react';
import { projectService } from '../../services/api';
import './Modals.scss';

interface AddMemberModalProps {
  projectId: string;
  onClose: () => void;
  onMemberAdded: () => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ 
  projectId, 
  onClose,
  onMemberAdded
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await projectService.addMember(projectId, email);
      
      setSuccess(true);
      setEmail('');
      onMemberAdded();
      
      // Close the modal after a short delay
      setTimeout(onClose, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add member');
      console.error('Error adding member:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>Add Team Member</h3>
          <button 
            className="close-button"
            onClick={onClose}
            disabled={loading}
          >
            &times;
          </button>
        </div>
        
        {error && <div className="modal-error">{error}</div>}
        {success && <div className="modal-success">Member added successfully!</div>}
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter team member's email"
              disabled={loading || success}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading || success}
            >
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading || success}
            >
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;