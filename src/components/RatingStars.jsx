import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, max = 5, size = 16, showValue = true }) => {
  const stars = [];
  for (let i = 1; i <= max; i++) {
    const isFilled = i <= Math.floor(rating);
    const isHalf = i === Math.ceil(rating) && rating % 1 !== 0;
    
    stars.push(
      <Star
        key={i}
        size={size}
        className={isFilled || isHalf ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}
        style={{
          color: isFilled ? '#f59e0b' : '#cbd5e1',
          fill: isFilled ? '#f59e0b' : 'none',
          display: 'inline-block'
        }}
      />
    );
  }

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'flex', gap: '2px' }}>{stars}</div>
      {showValue && (
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '4px' }}>
          {rating ? rating.toFixed(1) : '0.0'}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
