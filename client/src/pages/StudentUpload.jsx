import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFaculties } from '../redux/slices/facultySlice';
import Navbar from '../components/Navbar';
import API from '../services/api';
import toast from 'react-hot-toast';

export default function StudentUpload() {
  const dispatch = useDispatch();
  const { faculties } = useSelector(state => state.faculty);
  const [facId, setFacId] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    dispatch(fetchAllFaculties());
  }, [dispatch]);

  const onUpload = async (e) => {
    e.preventDefault();
    
    if (!facId) {
      toast.error('Please select a faculty anchor link.');
      return;
    }
    if (!file) {
      toast.error('Please upload an Excel (.xlsx) file.');
      return;
    }

    const fd = new FormData();
    fd.append('facultyId', facId);
    fd.append('file', file);

    // Added a loading toast while processing large excel parsing operations
    const loadingToast = toast.loading('Parsing Excel sheets and uploading records...');

    try {
      await API.post('/students/upload', fd, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      
      toast.dismiss(loadingToast);
      toast.success('Matrix Ingest Completed.');
      
      // Reset file field layout state after a successful upload execution
      setFile(null);
      e.target.reset();

    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("Upload error context logs:", error);
      
      const serverErrorMessage = error.response?.data?.message || 'Failed to execute bulk student upload parsing.';
      toast.error(serverErrorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="p-6 max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-xs mt-12">
        <h3 className="font-bold text-sm text-gray-800 mb-3">Bulk Student Excel Onboarding</h3>
        <form onSubmit={onUpload} className="space-y-3">
          <select 
            value={facId} 
            onChange={e => setFacId(e.target.value)} 
            className="w-full text-xs border p-2 rounded bg-white" 
            required
          >
            <option value="">Select Faculty Anchor Link</option>
            {faculties && faculties.map(f => (
              <option key={f._id} value={f._id}>
                {f.name} {f.department ? `(${f.department})` : ''}
              </option>
            ))}
          </select>
          
          <input 
            type="file" 
            accept=".xlsx" 
            onChange={e => setFile(e.target.files[0])} 
            className="w-full text-xs border p-2 rounded bg-gray-50 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer" 
            required 
          />
          
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white text-xs py-2 rounded font-medium hover:bg-blue-700 transition-colors"
          >
            Execute Bulk Parsing
          </button>
        </form>
      </div>
    </div>
  );
}