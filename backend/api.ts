import { Admin, Customer } from '../types';
import { generateAiInsightsForData } from './gemini';

// --- In-memory "database" using localStorage for persistence ---
const DB_KEY = 'loyaltyAdmins_DB';

function getDatabase(): Record<string, Admin> {
    try {
        const item = window.localStorage.getItem(DB_KEY);
        return item ? JSON.parse(item) : {};
    } catch (error) {
        console.error("Error reading from localStorage", error);
        return {};
    }
}

function saveDatabase(db: Record<string, Admin>) {
    try {
        window.localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (error) {
        console.error("Error writing to localStorage", error);
    }
}
// --- End of "database" ---


const simulateLatency = (delay: number = 500) => new Promise(res => setTimeout(res, delay));

// --- Auth ---

export const register = async (name: string, username: string, password: string): Promise<{ success: boolean; message: string; admin?: { username: string; name: string } }> => {
    await simulateLatency();
    const db = getDatabase();
    if (db[username]) {
        return { success: false, message: 'Username already exists.' };
    }
    const newAdmin: Admin = {
        username,
        password, // In a real app, this should be hashed
        name,
        customers: [],
    };
    db[username] = newAdmin;
    saveDatabase(db);
    return { success: true, message: 'Registration successful!', admin: { username, name } };
};

export const login = async (username: string, password: string): Promise<{ success: boolean; message: string; admin?: { username: string; name: string } }> => {
    await simulateLatency();
    const db = getDatabase();
    const admin = db[username];
    if (admin && admin.password === password) { // Plain text password check for demo
        return { success: true, message: 'Login successful!', admin: { username: admin.username, name: admin.name } };
    }
    return { success: false, message: 'Invalid username or password.' };
};


// --- Data ---

export const getAdminData = async (username: string): Promise<Customer[]> => {
    await simulateLatency(800); // Simulate heavier data fetch
    const db = getDatabase();
    const admin = db[username];
    if (!admin) {
        throw new Error('Admin not found');
    }
    return admin.customers || [];
};

export const addTransaction = async (username: string, customerData: Customer, transaction: { bill: number, points: number }): Promise<{ success: boolean; message: string; }> => {
    await simulateLatency();
    const db = getDatabase();
    const admin = db[username];
    if (!admin) {
        return { success: false, message: 'Admin not found.' };
    }

    const existingCustomerIndex = admin.customers.findIndex(c => c.mobile === customerData.mobile);
    const newHistoryEntry = { date: new Date().toISOString(), bill: transaction.bill, points: transaction.points };

    if (existingCustomerIndex > -1) {
        const existingCustomer = admin.customers[existingCustomerIndex];
        admin.customers[existingCustomerIndex] = {
            ...existingCustomer,
            points: existingCustomer.points + transaction.points,
            totalSpent: existingCustomer.totalSpent + transaction.bill,
            history: [...(existingCustomer.history || []), newHistoryEntry]
        };
    } else {
        const newCustomer: Customer = {
            ...customerData,
            points: transaction.points,
            totalSpent: transaction.bill,
            history: [newHistoryEntry]
        };
        admin.customers.push(newCustomer);
    }
    saveDatabase(db);
    return { success: true, message: 'Transaction processed!' };
};

// --- AI Service ---
export const fetchAiInsights = async (username: string, prompt: string): Promise<string> => {
    await simulateLatency(200); // Simulate internal request to the AI service
    const db = getDatabase();
    const admin = db[username];
    if (!admin) {
        throw new Error('Admin not found');
    }
    if (admin.customers.length === 0) {
        return "There is no customer data to analyze. Please add transactions first.";
    }
    // The actual Gemini call can take time, so no extra latency needed here
    return await generateAiInsightsForData(admin.customers, prompt);
};
