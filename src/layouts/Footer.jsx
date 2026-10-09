import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--bg-dark)', color: 'var(--text-light)', paddingTop: '4rem', paddingBottom: '2rem', marginTop: 'auto' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '8px', color: '#fff' }}>
                <Compass size={20} />
              </div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#fff' }}>
                Wanderlust
              </span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Smart Tourism & Travel Recommendation Platform. Helping travelers discover destinations, create itineraries, and explore unforgettable travel experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1.2rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li><Link to="/" style={{ color: '#94a3b8' }}>Home</Link></li>
              <li><Link to="/destinations" style={{ color: '#94a3b8' }}>All Destinations</Link></li>
              <li><Link to="/attractions" style={{ color: '#94a3b8' }}>Tourist Attractions</Link></li>
              <li><Link to="/recommendations" style={{ color: '#94a3b8' }}>Smart Recommendations</Link></li>
              <li><Link to="/about" style={{ color: '#94a3b8' }}>About Platform</Link></li>
            </ul>
          </div>

          {/* Top Destinations */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1.2rem' }}>Popular Destinations</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              <li>Goa Tropical Beaches</li>
              <li>Kerala Backwaters</li>
              <li>Jaipur Pink City Heritage</li>
              <li>Manali Snow Valleys</li>
              <li>Hyderabad Historical Forts</li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1.2rem' }}>Contact & Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} style={{ color: 'var(--primary)' }} />
                <span>Hyderabad, Telangana, India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} style={{ color: 'var(--primary)' }} />
                <span>support@smarttourism.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} style={{ color: 'var(--primary)' }} />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid #334155', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', color: '#64748b', fontSize: '0.85rem' }}>
          <div>© 2026 Smart Tourism & Travel Recommendation Platform. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Built for Academic Excellence & Viva Presentation.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
