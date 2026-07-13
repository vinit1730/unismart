import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

export default function VerifyOtp() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const email = params.get('email') || '';
  const [otp, setOtp] = useState('');
  const { user, error } = useSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      toast.success('Session verified.');
      navigate(
  user.role === "ADMIN"
    ? "/admin/faculty"
    : "/faculty/dashboard"
);
    }
    if (error) toast.error(error);
  }, [user, error, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 font-sans">
      <div className="bg-white p-8 max-w-md w-full mx-auto border border-gray-200 rounded-xl">
        <h2 className="text-base font-bold text-gray-800 mb-1">Confirm Session Passcode</h2>
        <p className="text-xs text-gray-400 mb-4">Input the code sent to {email}</p>
        <form onSubmit={(e) => { e.preventDefault(); dispatch(verifyOtp({ email, otp })); }}>
          <input type="text" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" className="w-full text-center tracking-widest text-lg font-mono border p-2 rounded-lg mb-3" required />
          <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-medium text-sm py-2 rounded-lg">Validate Token</button>
        </form>
      </div>
    </div>
  );
}