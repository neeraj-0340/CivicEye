import React from 'react';
import { Link } from 'react-router-dom';
import logo from "./assets/celogofull.png";
import ThemeToggle from "./components/ThemeToggle";

export const CivicEyeAboutPage = () => {
  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh', color: 'var(--text-primary)' }}>
      <header className="shadow-md sticky top-0 z-50" style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between py-4 px-6 gap-x-10">
          <img src={logo} alt="CivicEye Logo" className="h-6" />
          <nav className="flex items-center gap-6" style={{ color: 'var(--text-secondary)' }}>
            <Link to="/userhome" className="hover:text-blue-500">Home</Link>
            <Link to="/complaintlist" className="hover:text-blue-500">My Complaints</Link>
            <ThemeToggle />
            <Link to="/login">
              <button className="btn btn-primary btn-sm">Login</button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-4xl card p-8" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <h1 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>About Our Platform</h1> 
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
            Our Citizen Complaints and Reporting Web Application empowers civilians to actively participate in improving public infrastructure and services. 
            By allowing users to upload complaints with photographic or video evidence, we bridge the gap between citizens and authorities.
          </p>
          <h2 className="text-2xl font-semibold mt-6" style={{ color: 'var(--text-primary)' }}>Key Features</h2>
          <ul className="list-disc list-inside mt-2 space-y-2" style={{ color: 'var(--text-secondary)' }}>
            <li>Upload complaints with photo/video evidence</li>
            <li>Track complaint status through user accounts</li>
            <li>Transparency and accountability in complaint resolution</li>
            <li>Incentives: Earn rewards and recognition for civic engagement</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-6" style={{ color: 'var(--text-primary)' }}>Our Mission</h2>
          <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
            We aim to create a transparent and accountable system where citizens and authorities work together to improve public services and infrastructure.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CivicEyeAboutPage;
