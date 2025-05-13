
import React from 'react';

export const LogoCloud = () => {
  const companies = [
    { name: 'McKinsey', class: 'font-semibold text-gray-900' },
    { name: 'Bain', class: 'font-semibold text-gray-800' },
    { name: 'BCG', class: 'font-semibold text-gray-900' },
    { name: 'Strategy&', class: 'font-medium text-gray-800' },
    { name: 'Deloitte', class: 'font-medium text-gray-700' }
  ];

  return (
    <div className="text-left">
      <p className="text-sm text-gray-500 mb-3">Trusted by consultants from top firms</p>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {companies.map((company, index) => (
          <span key={index} className={`${company.class}`}>
            {company.name}
          </span>
        ))}
      </div>
    </div>
  );
};
