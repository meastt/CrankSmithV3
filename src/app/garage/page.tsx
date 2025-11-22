import { Garage } from '@/components/dashboard/Garage';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function GaragePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect('/api/auth/signin');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white">My Garage</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-400">Welcome, {session.user?.name || session.user?.email}</span>
                    </div>
                </div>
                <Garage />
            </div>
        </div>
    );
}
