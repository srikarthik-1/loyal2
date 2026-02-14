import React, { useMemo, useState } from 'react';
import { Customer } from '../../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { DownloadIcon, DollarSignIcon, GiftIcon, TrendingUpIcon, UserPlusIcon } from '../icons/Icons';

type Timeframe = '7d' | '30d' | 'all';

interface KpiCardProps {
    label: string;
    value: string | number;
    icon: React.FC<{className?: string}>;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, icon: Icon }) => (
    <div className="bg-[#0a0a0a] border border-[#333] p-5 flex items-center gap-5 transition-all duration-300 hover:border-white/20 hover:-translate-y-1">
        <div className="bg-white/5 p-3 rounded-full">
            <Icon className="w-6 h-6 text-white"/>
        </div>
        <div>
            <span className="block text-sm text-gray-400 mb-1">{label}</span>
            <div className="text-2xl font-bold text-white font-serif">{value}</div>
        </div>
    </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111] border border-[#333] p-3 rounded-md shadow-lg">
          <p className="label text-sm text-white font-bold">{`${label}`}</p>
          <p className="intro text-xs text-green-400">{`Revenue : ₹${payload[0].value.toLocaleString('en-IN')}`}</p>
          <p className="intro text-xs text-cyan-400">{`Points : ${payload[1].value.toLocaleString('en-IN')}`}</p>
        </div>
      );
    }
    return null;
};

const Analytics: React.FC<{ customers: Customer[] }> = ({ customers }) => {
    const [timeframe, setTimeframe] = useState<Timeframe>('all');

    const analyticsData = useMemo(() => {
        const now = new Date();
        const timeframeDate = new Date();
        if (timeframe === '7d') timeframeDate.setDate(now.getDate() - 7);
        if (timeframe === '30d') timeframeDate.setDate(now.getDate() - 30);

        const filteredCustomers = timeframe === 'all' ? customers : customers.map(c => ({
            ...c,
            history: c.history.filter(h => new Date(h.date) >= timeframeDate)
        })).filter(c => c.history.length > 0);

        let totalRevenue = 0;
        let totalPoints = 0;
        let totalTxns = 0;
        const dailyData: { [key: string]: { revenue: number, points: number } } = {};

        filteredCustomers.forEach(c => {
            c.history.forEach(h => {
                totalRevenue += h.bill;
                totalPoints += h.points;
                totalTxns++;
                const date = new Date(h.date).toLocaleDateString('en-CA'); // YYYY-MM-DD
                if (!dailyData[date]) dailyData[date] = { revenue: 0, points: 0 };
                dailyData[date].revenue += h.bill;
                dailyData[date].points += h.points;
            });
        });

        const chartData = Object.keys(dailyData).sort().map(date => ({
            name: new Date(date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' }),
            Revenue: dailyData[date].revenue,
            Points: dailyData[date].points,
        }));

        const totalCustomers = filteredCustomers.length;
        const clv = totalCustomers > 0 ? Math.round(totalRevenue / totalCustomers) : 0;
        const avgTxnsPerUser = totalCustomers > 0 ? (totalTxns / totalCustomers).toFixed(2) : '0.00';
        
        const spendingBrackets = { '<1k': 0, '1k-5k': 0, '5k-10k': 0, '>10k': 0 };
        customers.forEach(c => {
            if (c.totalSpent > 10000) spendingBrackets['>10k']++;
            else if (c.totalSpent > 5000) spendingBrackets['5k-10k']++;
            else if (c.totalSpent > 1000) spendingBrackets['1k-5k']++;
            else spendingBrackets['<1k']++;
        });
        const spendingDistData = Object.entries(spendingBrackets).map(([name, value]) => ({ name, users: value }));
        
        const topCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

        return {
            totalRevenue: `₹${totalRevenue.toLocaleString('en-IN')}`,
            clv: `₹${clv.toLocaleString('en-IN')}`,
            totalPoints: totalPoints.toLocaleString('en-IN'),
            avgTxnsPerUser,
            chartData,
            spendingDistData,
            topCustomers,
        };
    }, [customers, timeframe]);

    const exportData = () => {
        let csv = "Name,Mobile,TotalSpent,Points\n";
        customers.forEach(c => {
            csv += `"${c.name}",${c.mobile},${c.totalSpent},${c.points}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "loyalty_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const timeframeButtons: {id: Timeframe, label: string}[] = [
        {id: '7d', label: '7 Days'},
        {id: '30d', label: '30 Days'},
        {id: 'all', label: 'All Time'}
    ];

    return (
        <div className="space-y-6">
            <style>{`
                .chart-container, .kpi-grid > div, .leaderboard {
                    animation: fade-slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                    transform: translateY(20px);
                }
                ${Array.from({length: 8}, (_, i) => `.kpi-grid > div:nth-child(${i+1}), .leaderboard li:nth-child(${i+1}) { animation-delay: ${i * 0.05}s; }`)}
            `}</style>

            <div className="flex flex-wrap justify-between items-center gap-4 pb-5 border-b border-[#333]">
                <h1 className="text-4xl font-serif">Intelligence Hub</h1>
                <button onClick={exportData} className="flex items-center gap-2 px-4 py-2 text-sm border border-[#444] rounded-md text-gray-300 hover:border-white hover:text-white transition-all duration-300">
                    <DownloadIcon className="w-4 h-4"/> Export CSV
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 kpi-grid">
                <KpiCard label="Total Revenue" value={analyticsData.totalRevenue} icon={DollarSignIcon} />
                <KpiCard label="CLV" value={analyticsData.clv} icon={TrendingUpIcon} />
                <KpiCard label="Points Liability" value={analyticsData.totalPoints} icon={GiftIcon} />
                <KpiCard label="Avg. Txns/User" value={analyticsData.avgTxnsPerUser} icon={UserPlusIcon} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#0a0a0a] border border-[#333] p-4 chart-container" style={{ animationDelay: '0.2s' }}>
                    <div className="flex justify-between items-center mb-4 px-2">
                        <h3 className="text-sm text-gray-300 uppercase tracking-wider">Revenue Velocity</h3>
                        <div className="flex items-center bg-[#1a1a1a] border border-[#333] rounded-md p-0.5">
                            {timeframeButtons.map(btn => (
                                <button key={btn.id} onClick={() => setTimeframe(btn.id)} className={`px-3 py-1 text-xs rounded transition-colors ${timeframe === btn.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5'}`}>{btn.label}</button>
                            ))}
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={analyticsData.chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4}/>
                                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                            <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: number) => `₹${value/1000}k`} />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                            <Area type="monotone" dataKey="Points" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorPoints)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-[#0a0a0a] border border-[#333] p-6 chart-container leaderboard" style={{ animationDelay: '0.25s' }}>
                    <h3 className="text-sm text-gray-300 uppercase tracking-wider mb-4">Top "Whale" Customers</h3>
                    <ul className="space-y-3">
                        {analyticsData.topCustomers.map((c, i) => (
                            <li key={c.mobile} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-500 w-5 text-center">{i + 1}</span>
                                    <div>
                                        <p className="text-white font-medium">{c.name}</p>
                                        <p className="text-gray-400 text-xs">{c.mobile}</p>
                                    </div>
                                </div>
                                <span className="font-bold text-white">₹{c.totalSpent.toLocaleString('en-IN')}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-[#333] p-6 chart-container" style={{ animationDelay: '0.3s' }}>
                <h3 className="text-sm text-gray-300 uppercase tracking-wider mb-4">Spending Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analyticsData.spendingDistData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                        <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} />
                        <Bar dataKey="users" name="Number of Users" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Analytics;
