'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClerk, useUser } from '@clerk/nextjs';
import { ArrowLeft, Trash2, AlertTriangle, Shield, Mail, FileText } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/Toast';

export default function SettingsPage() {
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();
    const { toast } = useToast();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch('/api/user/delete', {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }

            toast({
                type: 'success',
                title: 'Account Deleted',
                message: 'Your account has been successfully deleted.',
            });

            // Sign out and redirect to home
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Error deleting account:', error);
            toast({
                type: 'error',
                title: 'Error',
                message: 'Failed to delete account. Please try again.',
            });
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    if (!isLoaded) return null;

    if (!user) {
        router.push('/sign-in');
        return null;
    }

    return (
        <div className="min-h-screen bg-stone-950 text-white">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-stone-950/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Link
                        href="/garage"
                        className="p-2 -ml-2 text-stone-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold">Settings</h1>
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
                {/* Profile Section */}
                <section className="space-y-4">
                    <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wider">
                        Profile
                    </h2>
                    <div className="p-6 rounded-2xl bg-stone-900/50 border border-white/5 flex items-center gap-4">
                        <img
                            src={user.imageUrl}
                            alt={user.fullName || 'User'}
                            className="w-16 h-16 rounded-full border-2 border-white/10"
                        />
                        <div>
                            <h3 className="text-lg font-bold text-white">
                                {user.fullName}
                            </h3>
                            <p className="text-stone-400 text-sm">
                                {user.primaryEmailAddress?.emailAddress}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Legal & Support */}
                <section className="space-y-4">
                    <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wider">
                        Legal & Support
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            href="/privacy"
                            className="p-4 rounded-xl bg-stone-900/30 border border-white/5 hover:bg-stone-900/50 hover:border-white/10 transition-all flex items-center gap-3"
                        >
                            <Shield className="w-5 h-5 text-emerald-500" />
                            <span className="font-medium text-stone-200">Privacy Policy</span>
                        </Link>
                        <Link
                            href="/terms"
                            className="p-4 rounded-xl bg-stone-900/30 border border-white/5 hover:bg-stone-900/50 hover:border-white/10 transition-all flex items-center gap-3"
                        >
                            <FileText className="w-5 h-5 text-blue-500" />
                            <span className="font-medium text-stone-200">Terms of Service</span>
                        </Link>
                        <Link
                            href="/contact"
                            className="p-4 rounded-xl bg-stone-900/30 border border-white/5 hover:bg-stone-900/50 hover:border-white/10 transition-all flex items-center gap-3 md:col-span-2"
                        >
                            <Mail className="w-5 h-5 text-violet-500" />
                            <span className="font-medium text-stone-200">Contact Support</span>
                        </Link>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="space-y-4 pt-8">
                    <h2 className="text-sm font-medium text-red-500 uppercase tracking-wider">
                        Danger Zone
                    </h2>
                    <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                        <h3 className="text-lg font-bold text-white mb-2">
                            Delete Account
                        </h3>
                        <p className="text-stone-400 text-sm mb-6 max-w-xl">
                            Permanently delete your account and all of your data. This action cannot be undone.
                            All saved builds and personal information will be removed.
                        </p>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete Account
                        </button>
                    </div>
                </section>
            </main>

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-stone-900 border border-white/10 rounded-2xl p-6 shadow-2xl">
                        <div className="flex items-center gap-3 text-red-500 mb-4">
                            <AlertTriangle className="w-8 h-8" />
                            <h2 className="text-xl font-bold">Delete Account?</h2>
                        </div>
                        <p className="text-stone-300 mb-8 leading-relaxed">
                            Are you absolutely sure? This action is <span className="font-bold text-white">irreversible</span>.
                            All your saved builds and data will be permanently lost.
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                disabled={isDeleting}
                                className="px-4 py-2 text-stone-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                {isDeleting ? 'Deleting...' : 'Yes, Delete My Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
