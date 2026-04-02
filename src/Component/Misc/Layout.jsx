import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from "../Header/Header";
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

export default function Layout() {
  return (
    <div className="flex h-screen w-full bg-gray-900">
      <Header />
      <main className="flex-1 overflow-auto p-6 text-white">
        <ProtectedRoute><Outlet /></ProtectedRoute>
      </main>
      

    </div>
  );
}