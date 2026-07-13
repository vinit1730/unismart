import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = params.get('role') || 'faculty';
  
  const [email, setEmail] = useState('');
  const { loading, otpSent, error } = useSelector(state => state.auth);

  useEffect(() => {
    if (otpSent) {
      toast.success('Passcode sent.');
      navigate(`/verify?email=${encodeURIComponent(email)}`);
    }
    if (error) toast.error(error);
  }, [otpSent, error, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 font-sans">
      <div className="bg-white p-8 max-w-md w-full mx-auto border border-gray-200 rounded-xl shadow-xs">
        <h2 className="text-xl font-bold uppercase tracking-wide text-gray-800 mb-1">{role} Authorization</h2>
        <p className="text-xs text-gray-400 mb-4">Provide institutional registration handle details below.</p>
        <form onSubmit={(e) => { e.preventDefault(); dispatch(sendOtp(email)); }}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="username@university.edu" className="w-full text-sm border p-2.5 rounded-lg mb-3" required />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2 px-4 rounded-lg transition-colors">{loading ? 'Sending...' : 'Request Verification OTP'}</button>
        </form>
      </div>
    </div>
  );
}