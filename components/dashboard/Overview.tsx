import React, { useMemo } from 'react';
import { Customer } from '../../types';

interface OverviewProps {
  customers: Customer[];
}

interface StatCardProps {
    label: string;
    value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
    <div className="bg-[#0a0a0a] border border-[#333] p-6 transition-all duration-300 hover:border-[#444]">
        <span className="block text-xs text-gray-400 uppercase tracking-wider mb-2">{label}</span>
        <div className="text-4xl font-serif text-white">{value}</div>
    </div>
);

const Overview: React.FC<OverviewProps> = ({ customers }) => {
    const stats = useMemo(() => {
        const totalCustomers = customers.length;
        const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpent, 0);
        const totalPoints = customers.reduce((acc, c) => acc + c.points, 0);

        return {
            totalCustomers,
            totalRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
            totalPoints: totalPoints.toLocaleString('en-IN'),
        }
    }, [customers]);

  return (
    <div>
      <h1 className="text-4xl font-serif pb-5 mb-8 border-b border-[#333]">System Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard label="Total Users" value={stats.totalCustomers} />
        <StatCard label="Total Revenue" value={stats.totalRevenue} />
        <StatCard label="Active Points" value={stats.totalPoints} />
      </div>
    </div>
  );
};

export default Overview;
