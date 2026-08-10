import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api, { API_BASE_URL } from '../api/config';
import toast, { Toaster } from 'react-hot-toast';

export const CivicEyeComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mediaType, setMediaType] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchComplaintDetails();
  }, [id]);

  const fetchComplaintDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to view complaint details');
        setLoading(false);
        return;
      }

      const response = await api.get(`/complaint/detail/${id}`);

      setComplaint(response.data);
      const proofPath = response.data.proof;
      const extension = proofPath.split('?')[0].split('.').pop().toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
        setMediaType('image');
      } else if (['mp4', 'mov', 'avi', 'wmv'].includes(extension)) {
        setMediaType('video');
      } else {
        setMediaType('other');
      }
      setLoading(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Failed to fetch complaint details. Please try again.'
      );
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to delete a complaint');
        setDeleting(false);
        return;
      }

      await api.delete(`/complaint/delete/${id}`);

      toast.success('Complaint deleted successfully');
      setTimeout(() => {
        navigate('/complaintlist');
      }, 1000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Failed to delete complaint. Please try again.'
      );
      setDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'In Progress': 'bg-blue-100 text-blue-800',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  const renderProofMedia = () => {
    if (!complaint || !complaint.proof) return null;
    
    let mediaUrl;
    if (complaint.proof.startsWith('http://') || complaint.proof.startsWith('https://')) {
      mediaUrl = complaint.proof;
    } else {
      // Get the server URL (assuming uploads are served from backend)
      const serverUrl = API_BASE_URL;
      
      // Normalize any Windows backslashes to forward slashes
      const normalizedPath = complaint.proof.replace(/\\/g, '/');
      
      // Extract the file path (remove any absolute path and keep relative path)
      const filePath = normalizedPath.replace(/^.*\/uploads\//, '/uploads/');
      
      // Construct full URL
      mediaUrl = `${serverUrl}${filePath.startsWith('/') ? '' : '/'}${filePath}`;
    }

    if (mediaType === 'image') {
      return (
        <div className="mt-3">
          <img
            src={mediaUrl}
            alt="Complaint proof"
            className="max-w-full h-auto rounded border border-gray-200"
            style={{ maxHeight: '400px' }}
          />
        </div>
      );
    } else if (mediaType === 'video') {
      return (
        <div className="mt-3">
          <video
            controls
            className="max-w-full rounded border border-gray-200"
            style={{ maxHeight: '400px' }}
          >
            <source src={mediaUrl} type={`video/${complaint.proof.split('?')[0].split('.').pop().toLowerCase()}`} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else {
      return (
        <div className="mt-2">
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            View uploaded file
          </a>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-red-100 text-red-700 rounded">
        <p>{error}</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 card">
        <p className="text-center" style={{ color: 'var(--text-muted)' }}>Complaint not found</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', padding: '2.5rem 1rem' }}>
      <div className="max-w-2xl mx-auto p-6 card" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <Toaster />
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Complaint Details</h2>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-primary btn-sm"
          >
            Back to List
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Status</h3>
            {getStatusBadge(complaint.status)}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Created At</p>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{complaint.createdAt}</p>
            </div>
            {complaint.resolvedAt && (
              <div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Resolved At</p>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{complaint.resolvedAt}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Complaint Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Type</p>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{complaint.type}</p>
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Location</p>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{complaint.location}</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Description</p>
            <p className="font-medium whitespace-pre-line mt-1" style={{ color: 'var(--text-primary)' }}>{complaint.description}</p>
          </div>
          <div>
            <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Proof/Reference</p>
            {renderProofMedia()}
          </div>
        </div>

        {complaint.status === 'Pending' && (
          <div className="border-t pt-6 mt-6" style={{ borderColor: 'var(--border)' }}>
            <p className="italic text-sm" style={{ color: 'var(--text-muted)' }}>
              Your complaint is currently under review. You'll be notified once there's an update.
            </p>
          </div>
        )}

        {/* Delete Button at Bottom */}
        {complaint.status === 'Pending' && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="btn btn-danger btn-sm"
            >
              {deleting ? 'Deleting...' : 'Delete Complaint'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};