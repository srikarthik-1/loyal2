import React, { useState } from 'react';
import { Customer } from '../../types';

interface SearchProps {
  customers: Customer[];
}

const Search: React.FC<SearchProps> = ({ customers }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [foundCustomer, setFoundCustomer] = useState<Customer | null | undefined>(undefined);

    const handleSearch = () => {
        const customer = customers.find(c => c.mobile === searchTerm);
        setFoundCustomer(customer || null);
    };

    return (
        <div>
            <h1 className="text-4xl font-serif pb-5 mb-8 border-b border-[#333]">Database Search</h1>
            <div className="bg-[#0a0a0a] border border-[#333] p-6 md:p-8 max-w-2xl mx-auto">
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Find Customer by Mobile</label>
                <div className="flex gap-4">
                    <input 
                        type="tel"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter Mobile Number..."
                        className="flex-grow bg-[#111] border border-[#333] p-3 focus:outline-none focus:border-white transition-colors"
                    />
                    <button onClick={handleSearch} className="px-6 py-3 bg-white/10 border border-[#333] rounded-md text-white transition-all duration-300 hover:bg-white/20">Search</button>
                </div>

                <div className="mt-8">
                    {foundCustomer === undefined && <p className="text-gray-500">Enter a mobile number to begin search.</p>}
                    {foundCustomer === null && <p className="text-red-500">User not found in the database.</p>}
                    {foundCustomer && (
                        <div className="bg-black/30 border border-[#222] p-6">
                            <h3 className="text-2xl font-serif text-white">{foundCustomer.name}</h3>
                            <p className="text-md text-gray-400 font-mono mt-1 mb-4">{foundCustomer.mobile}</p>
                            <div className="flex gap-8">
                                <div>
                                    <span className="block text-xs text-gray-500 uppercase">Points</span>
                                    <span className="text-xl font-bold">{foundCustomer.points}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-gray-500 uppercase">Total Spent</span>
                                    <span className="text-xl font-bold">₹{foundCustomer.totalSpent.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
