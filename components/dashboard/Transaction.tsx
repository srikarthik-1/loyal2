import React, { useState, useEffect, useCallback } from 'react';
import { Customer } from '../../types';

interface TransactionProps {
  customers: Customer[];
  onTransaction: (customer: Customer, transaction: { bill: number, points: number }) => Promise<{success: boolean, message: string}>;
}

const Transaction: React.FC<TransactionProps> = ({ customers, onTransaction }) => {
    const [mobile, setMobile] = useState('');
    const [name, setName] = useState('');
    const [pin, setPin] = useState('');
    const [billAmount, setBillAmount] = useState('');
    const [cashGiven, setCashGiven] = useState('');
    
    const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);
    const [showPinSection, setShowPinSection] = useState(false);
    const [showTransactionForm, setShowTransactionForm] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const [pinError, setPinError] = useState('');
    const [pointsPreview, setPointsPreview] = useState(0);

    useEffect(() => {
        const bill = parseFloat(billAmount) || 0;
        const cash = parseFloat(cashGiven) || 0;
        if (cash >= bill && bill > 0) {
            setPointsPreview(Math.floor(cash - bill));
        } else {
            setPointsPreview(0);
        }
    }, [billAmount, cashGiven]);

    const handleMobileBlur = () => {
        if (mobile.length >= 10) {
            const existingCustomer = customers.find(c => c.mobile === mobile);
            if (existingCustomer) {
                setName(existingCustomer.name);
                setIsExistingUser(true);
            } else {
                setName('');
                setIsExistingUser(false);
            }
            setShowPinSection(true);
            setShowTransactionForm(false);
            setPin('');
            setPinError('');
        }
    };

    const handlePinVerify = () => {
        setPinError('');
        if (isExistingUser) {
            const customer = customers.find(c => c.mobile === mobile);
            if (customer && customer.pin === pin) {
                setShowTransactionForm(true);
            } else {
                setPinError('Incorrect PIN code.');
            }
        } else {
            if (pin.length === 4) {
                setShowTransactionForm(true);
            } else {
                setPinError('PIN must be 4 digits.');
            }
        }
    };
    
    const resetForm = useCallback(() => {
        setMobile('');
        setName('');
        setPin('');
        setBillAmount('');
        setCashGiven('');
        setIsExistingUser(null);
        setShowPinSection(false);
        setShowTransactionForm(false);
        setPinError('');
        setPointsPreview(0);
    }, []);

    const handleSubmitTransaction = async (e: React.FormEvent) => {
        e.preventDefault();
        const bill = parseFloat(billAmount);
        const cash = parseFloat(cashGiven);

        if (!bill || bill <= 0) { alert("Please enter a valid Bill Amount"); return; }
        if (!cash || cash < bill) { alert("Cash Given cannot be less than Bill Amount"); return; }
        
        setIsProcessing(true);

        const newCustomerData: Customer = {
            mobile,
            name: name || `Guest-${mobile.slice(-4)}`,
            pin,
            points: 0,
            totalSpent: 0,
            history: []
        };
        
        const response = await onTransaction(newCustomerData, { bill, points: pointsPreview });
        alert(response.message);
        if(response.success) {
            resetForm();
        }
        setIsProcessing(false);
    };

    return (
        <div>
            <h1 className="text-4xl font-serif pb-5 mb-8 border-b border-[#333]">New Entry</h1>
            <div className="bg-[#0a0a0a] border border-[#333] p-6 md:p-8 max-w-2xl mx-auto">
                <form onSubmit={handleSubmitTransaction}>
                    <fieldset disabled={isProcessing}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Mobile Number</label>
                                <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} onBlur={handleMobileBlur} placeholder="Search or Enter..." className="w-full bg-[#111] border border-[#333] p-3 focus:outline-none focus:border-white transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Name</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} readOnly={isExistingUser === true} placeholder="Customer Name" className="w-full bg-[#111] border border-[#333] p-3 read-only:bg-[#1a1a1a] focus:outline-none focus:border-white transition-colors" />
                            </div>
                        </div>

                        {showPinSection && (
                            <div className="mt-6 border-t border-[#333] pt-6">
                                <label className="block text-sm text-gray-300 mb-2">Security PIN</label>
                                <p className="text-xs text-gray-500 mb-4">{isExistingUser ? "Enter existing user's PIN for verification." : "Set a new 4-digit PIN for this user."}</p>
                                <div className="flex items-start gap-4">
                                    <div className="flex-grow">
                                        <input type="password" value={pin} onChange={e => setPin(e.target.value)} maxLength={4} placeholder="••••" className="w-full bg-[#111] border border-[#333] p-3 text-center text-xl tracking-[1rem] focus:outline-none focus:border-white transition-colors" />
                                        {pinError && <p className="text-red-500 text-xs mt-2">{pinError}</p>}
                                    </div>
                                    <button type="button" onClick={handlePinVerify} className="px-6 py-3 bg-white/10 border border-[#333] rounded-md text-white transition-all duration-300 hover:bg-white/20">Verify</button>
                                </div>
                            </div>
                        )}
                        
                        {showTransactionForm && (
                            <div className="mt-6 border-t border-[#333] pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Bill Amount (₹)</label>
                                        <input type="number" value={billAmount} onChange={e => setBillAmount(e.target.value)} placeholder="e.g. 900" className="w-full bg-[#111] border border-[#333] p-3 focus:outline-none focus:border-white transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">Cash Given (₹)</label>
                                        <input type="number" value={cashGiven} onChange={e => setCashGiven(e.target.value)} placeholder="e.g. 1000" className="w-full bg-[#111] border border-[#333] p-3 focus:outline-none focus:border-white transition-colors" />
                                    </div>
                                </div>
                                <div className="bg-black/30 border border-[#222] p-4 mb-6 flex justify-between items-center">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider">Points to Add</span>
                                    <span className="text-2xl font-bold text-white">{pointsPreview}</span>
                                </div>
                                <button type="submit" className="w-full mt-4 py-4 bg-white rounded-md text-black font-semibold transition-all duration-300 hover:bg-gray-200 disabled:bg-gray-500 disabled:cursor-wait">
                                    {isProcessing ? 'Processing...' : 'Process Transaction'}
                                </button>
                            </div>
                        )}
                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default Transaction;
