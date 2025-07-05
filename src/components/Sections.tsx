import React, { type ReactNode } from 'react';

interface SectionsProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const Sections: React.FC<SectionsProps> = ({ title, subtitle, children }) => {
  return (
    <section className="mt-15 animate-fadeIn">
      <div className="mb-4 text-center pt-5">
        <h2 className="text-4xl  text-blue-600 font-bold">{title}</h2>
        {subtitle && <p className="text-gray-500">{subtitle}</p>}
      </div>
      <div className="grid gap-6">{children}</div>
    </section>
  );
};

export default Sections;