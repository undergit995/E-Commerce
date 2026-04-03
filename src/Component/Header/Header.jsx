import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: "Dashboard",  path: "/dashboard",  icon: "⊞" },
    { id: "Products",   path: "/products",   icon: "◫" },
    { id: "Purchases",  path: "/products",  icon: "◎" },
    { id: "Customers",  path: "/products",  icon: "◉" },
    { id: "Analytics",  path: "/products",  icon: "▦" },
    { id: "Settings",   path: "/products",   icon: "✦" },
  ];

  const userName = "Aiden Crew";

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    Cookies.remove('id1');
    setDropdownOpen(false);
    navigate('/login',{replace:true});
  };

  const isActive = (path) => location.pathname === path;

  const activeStyle = {
    background: 'linear-gradient(to right, #facc15, #fb923c, #eab308)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  return (
    <aside
      className={`flex flex-col h-screen bg-gray-950 shadow-2xl border-r border-orange-500/20 transition-all duration-300 ${
        sideOpen ? 'w-52' : 'w-14'
      } flex-shrink-0`}
    >

      <div className="flex items-center h-16 px-2">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGUqE7wPtDRHLhjbh5ggWoSG8ZJKKxOAyj3A&s"
          alt="Logo"
          className="h-10 w-10 rounded-xl shadow-lg flex-shrink-0"
        />        
      </div>

      <nav className="flex flex-col w-full mt-2 space-y-1 px-1">
        {navItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center rounded-xl overflow-hidden"
          >
            <button
              onClick={() => {
                setSideOpen((prev) => !prev);
                navigate(item.path)
              }}

              className={`flex items-center justify-center w-10 h-10 flex-shrink-0 transition-all duration-200
                ${isActive(item.path)
                  ? 'bg-orange-500/10 ring-1 ring-orange-400/30 '
                  : 'hover:bg-gray-800/50 active:bg-orange-500/10'
                }`}
              style={isActive(item.path)?activeStyle : { color: '#9ca3af' }}
            >
              {item.icon}
            </button>
            

            {sideOpen && (
              <Link
                to={item.path}
                onClick={() => setSideOpen(true)}
                className={`flex-1 py-2 pr-2 text-sm font-medium whitespace-nowrap transition-all duration-200
                  ${isActive(item.path) ? '' : 'text-gray-400 hover:text-gray-200'}`}
                style={isActive(item.path) ? activeStyle : {}}
              >
                {item.id}
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="mt-auto w-full px-1 pb-3">
        {sideOpen && (
          <p className="text-xs text-gray-500 px-2 mb-1 truncate">{userName}</p>
        )}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center w-full p-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 transition-all duration-200"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGUqE7wPtDRHLhjbh5ggWoSG8ZJKKxOAyj3A&s"
              alt="Profile"
              className="h-8 w-8 rounded-full ring-2 ring-orange-400/30 flex-shrink-0"
            />
            {sideOpen && (
              <svg
                className={`w-4 h-4 ml-auto text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute bottom-12 left-0 w-28 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700/50 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-700/50">
                <p className="text-sm font-medium text-gray-200">{userName}</p>
                <p className="text-xs text-gray-400">john@example.com</p>
              </div>
              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-orange-500/10 hover:text-white transition-all duration-200"
              >
                Profile
              </Link>
              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-orange-500/10 hover:text-white transition-all duration-200"
              >
                Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-red-500/10 hover:text-white transition-all duration-200"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}