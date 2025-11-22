import React from 'react';

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Components</h3>
                    <p className="text-4xl font-bold text-white mt-2">--</p>
                    <p className="text-sm text-gray-500 mt-1">Active parts in database</p>
                </div>

                <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">Total Users</h3>
                    <p className="text-4xl font-bold text-white mt-2">--</p>
                    <p className="text-sm text-gray-500 mt-1">Registered accounts</p>
                </div>

                <div className="bg-gray-900 p-6 rounded-xl border border-white/10">
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">System Status</h3>
                    <p className="text-4xl font-bold text-emerald-400 mt-2">Healthy</p>
                    <p className="text-sm text-gray-500 mt-1">All systems operational</p>
                </div>
            </div>
        </div>
    );
}
