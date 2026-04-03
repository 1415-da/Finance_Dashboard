import React from 'react';

export default function StatCard({ 
  icon: Icon, 
  title, 
  value, 
  iconColorClass = 'blue', 
  valueClass = '',
  description = ''
}) {
  return (
    <div className={`summary-card glass-panel`}>
      <div className={`card-icon ${iconColorClass}`}>
        <Icon size={24} />
      </div>
      <div className="card-info">
        <h3>{title}</h3>
        {description ? (
          <>
            <h3 style={{ fontSize: '1.25rem', margin: '0', color: 'var(--text-main)' }}>{value}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{description}</p>
          </>
        ) : (
          <h2 className={valueClass}>{value}</h2>
        )}
      </div>
    </div>
  );
}
