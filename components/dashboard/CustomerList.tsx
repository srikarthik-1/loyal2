import React from 'react';
import { Customer } from '../../types';

interface CustomerListProps {
  customers: Customer[];
}

const CustomerList: React.FC<CustomerListProps> = ({ customers }) => {
  return (
    <div>
      <h1 className="text-4xl font-serif pb-5 mb-8 border-b border-[#333]">Registered Users</h1>
      <div className="bg-[#0a0a0a] border border-[#333] p-1 md:p-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#333]">
                <th className="p-4 text-left text-xs text-gray-400 uppercase tracking-wider font-normal">Name</th>
                <th className="p-4 text-left text-xs text-gray-400 uppercase tracking-wider font-normal">Mobile</th>
                <th className="p-4 text-left text-xs text-gray-400 uppercase tracking-wider font-normal">Points</th>
                <th className="p-4 text-left text-xs text-gray-400 uppercase tracking-wider font-normal">Total Spend (₹)</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                customers.map(customer => (
                  <tr key={customer.mobile} className="border-b border-[#1a1a1a] hover:bg-[#111]">
                    <td className="p-4 text-white">{customer.name}</td>
                    <td className="p-4 text-gray-300 font-mono">{customer.mobile}</td>
                    <td className="p-4 text-white font-medium">{customer.points.toLocaleString('en-IN')}</td>
                    <td className="p-4 text-white font-medium">{customer.totalSpent.toLocaleString('en-IN')}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerList;
