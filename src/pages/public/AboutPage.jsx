import React from 'react';
import { Compass, Award, ShieldCheck, HeartHandshake, Code2, Database, Layout } from 'lucide-react';

const AboutPage = () => {
  return (
    <div style={{ padding: '4rem 0', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '1rem', padding: '0.4rem 1rem' }}>
            Academic Full Stack Capstone Project
          </span>
          <h1 className="section-title">About Smart Tourism & Travel Recommendation Platform</h1>
          <p className="section-subtitle">
            An end-to-end full stack web application engineered with Spring Boot 3 REST APIs, React 18, JWT Security, and MySQL database.
          </p>
        </div>

        {/* System Features Card */}
        <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Core System Architecture</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.75rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '12px', borderRadius: '12px', height: 'fit-content' }}>
                <Code2 size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>Spring Boot Backend</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Layered Architecture (Controller, Service, Repository, Entity, DTO, Security)</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ background: 'var(--accent-light)', color: 'var(--accent)', padding: '12px', borderRadius: '12px', height: 'fit-content' }}>
                <Layout size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>React 18 Frontend</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Vite build tool, Axios HTTP client, custom Glassmorphism CSS, and responsive layouts</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ background: '#fef3c7', color: '#d97706', padding: '12px', borderRadius: '12px', height: 'fit-content' }}>
                <Database size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>MySQL & Relational Data</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Proper PK/FK relationships, cascading rules, indexing, and JPA Hibernate ORM</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ background: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '12px', height: 'fit-content' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>Role Security</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Spring Security 6 with stateless JWT Bearer token authentication & role guards</p>
              </div>
            </div>
          </div>
        </div>

        {/* Student & Project Details Card */}
        <div className="glass-card" style={{ padding: '2.5rem', background: 'linear-gradient(135deg, var(--bg-dark-surface) 0%, var(--bg-dark) 100%)', color: '#fff' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Project Demonstration & Viva Preparedness</h2>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Designed as a 1-month comprehensive academic project suitable for Java Full Stack developer training, project viva presentation, resume showcase, and GitHub portfolio.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', borderTop: '1px solid #334155', paddingTop: '1.25rem', color: '#94a3b8', fontSize: '0.88rem' }}>
            <div><strong>Backend Port:</strong> 8080</div>
            <div><strong>Frontend Port:</strong> 5173</div>
            <div><strong>Default Admin:</strong> admin@tourism.com</div>
            <div><strong>Default User:</strong> user@tourism.com</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
