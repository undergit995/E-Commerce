import {React } from 'react'
import Cookies from 'js-cookie';
import { Navigate, useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const Liv = Cookies.get("id1");

  if (!Liv) {
    return <Navigate to="/login" />;
  }

  return children;
}
