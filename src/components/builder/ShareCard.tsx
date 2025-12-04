'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Share2,
    Download,
    Copy,
    Check,
    Bike,
    X,
    Twitter,
    Facebook,
    Linkedin,
} from 'lucide-react';
import { Component } from '@/lib/validation';
import html2canvas from 'html2canvas';
import { toSpeed, speedUnit, toWeight, weightUnit } from '@/lib/unitConversions';

interface ShareCardProps {
    frameName: string;
    parts: Record<string, Component | null>;
    chainrings: number[];
    cassetteCogs: number[];
    totalWeight: number;
    climbingScore: number;
    speedRange?: { min: number; max: number };
    unitSystem: 'imperial' | 'metric';
    onClose?: () => void;
    isModal?: boolean;
}

export const ShareCard: React.FC<ShareCardProps> = ({
    frameName,
    parts,
    chainrings,
    cassetteCogs,
    totalWeight,
    climbingScore,
    speedRange,
    unitSystem,
    onClose,
    isModal = false,
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);

    // Format Data
    const weightDisplay = toWeight(totalWeight / 1000, unitSystem).toFixed(2);
    const weightLabel = weightUnit(unitSystem);
    const speedMin = speedRange ? toSpeed(speedRange.min, unitSystem).toFixed(0) : '--';
    const speedMax = speedRange ? toSpeed(speedRange.max, unitSystem).toFixed(0) : '--';
    const speedLabel = speedUnit(unitSystem);
    const activeParts = Object.entries(parts).filter(([_, part]) => part !== null) as [string, Component][];

    // Generate shareable URL
    const getShareUrl = () => {
        return typeof window !== 'undefined' ? window.location.origin + '/builder' : '';
    };

    // Download card as image
    const handleDownload = async () => {
        if (!cardRef.current) return;

        setDownloading(true);
        try {
            // Wait for fonts
            await document.fonts.ready;

            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: '#0c0a09', // stone-950
                scale: 2, // Retina quality
                logging: false,
                useCORS: true
            });

            const link = document.createElement('a');
            link.download = `${frameName.replace(/\s+/g, '-').toLowerCase()}-build.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error('Failed to download:', err);
        } finally {
            setDownloading(false);
        }
    };

    // Copy link to clipboard
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(getShareUrl());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    // Social share handlers
    const shareToTwitter = () => {
        const text = `Check out my ${frameName} build on CrankSmith! ${weightDisplay}${weightLabel}.`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getShareUrl())}`;
        window.open(url, '_blank');
    };

    const shareToFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`;
        window.open(url, '_blank');
    };

    const shareToLinkedIn = () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`;
        window.open(url, '_blank');
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${frameName} Build`,
                    text: `Check out my ${frameName} build on CrankSmith!`,
                    url: getShareUrl(),
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        }
    };

    const CardContent = (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-stone-950 shadow-2xl relative group">
            {/* Capture Area - The "Receipt" */}
            <div
                ref={cardRef}
                className="p-8 bg-stone-950 text-white relative overflow-hidden min-w-[350px]"
                style={{ fontFamily: 'monospace' }}
            >
                {/* Background Accents */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                {/* Header */}
                <div className="border-b-2 border-dashed border-white/20 pb-6 mb-6 text-center relative z-10">
                    <div className="flex justify-center mb-3">
                        <div className="w-10 h-10 bg-white text-stone-950 rounded-full flex items-center justify-center">
                            <Bike className="w-6 h-6" />
                        </div>
                    </div>
                    <h2 className="text-xl font-bold uppercase tracking-widest mb-1">CrankSmith</h2>
                    <p className="text-stone-500 text-[10px] uppercase tracking-[0.2em]">Build Manifest</p>
                </div>

                {/* Build Name */}
                <div className="mb-6 text-center relative z-10">
                    <h1 className="text-lg font-bold text-blue-400 mb-1">{frameName}</h1>
                    <div className="text-[10px] text-stone-500 uppercase tracking-wider">
                        {new Date().toLocaleDateString()}
                    </div>
                </div>

                {/* Performance Specs */}
                <div className="grid grid-cols-2 gap-4 mb-6 relative z-10 border-b-2 border-dashed border-white/20 pb-6">
                    <div className="text-center">
                        <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-1">Climbing Score</p>
                        <p className={`text-xl font-bold ${climbingScore >= 80 ? 'text-emerald-400' : 'text-white'}`}>
                            {climbingScore.toFixed(0)}<span className="text-xs text-stone-500 font-normal">/100</span>
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-stone-500 uppercase tracking-wider mb-1">Speed Range</p>
                        <p className="text-xl font-bold text-white">
                            {speedMax}<span className="text-xs text-stone-500 font-normal">{speedLabel}</span>
                        </p>
                    </div>
                </div>

                {/* Parts List */}
                <div className="space-y-2 mb-8 relative z-10">
                    {activeParts.map(([type, part]) => (
                        <div key={type} className="flex justify-between items-baseline text-xs">
                            <span className="text-stone-500 uppercase w-20 shrink-0">{type}</span>
                            <span className="text-stone-300 truncate text-right flex-1 mx-2">{part.name}</span>
                            <span className="text-stone-500 font-mono shrink-0 w-10 text-right">
                                {part.attributes.weight_g ? `${part.attributes.weight_g}` : '-'}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="border-t-2 border-dashed border-white/20 pt-6 relative z-10">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-stone-500 text-[10px] uppercase tracking-wider mb-1">Total Weight</p>
                            <p className="text-3xl font-bold text-white">
                                {weightDisplay}<span className="text-lg text-stone-500 font-normal">{weightLabel}</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="w-12 h-12 border border-white/20 rounded flex items-center justify-center bg-white/5">
                                <div className="text-center">
                                    <span className="block text-[8px] text-stone-500 uppercase">Grade</span>
                                    <span className="block text-lg font-bold text-blue-400">A+</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-4 border-t border-white/5 text-center relative z-10">
                    <p className="text-[8px] text-stone-600 uppercase tracking-widest">Generated by CrankSmith.com</p>
                </div>
            </div>
        </div>
    );

    const ShareButtons = (
        <div className="mt-4 space-y-3">
            <div className="flex justify-center gap-2">
                <button onClick={shareToTwitter} className="p-3 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] transition-colors"><Twitter className="w-5 h-5" /></button>
                <button onClick={shareToFacebook} className="p-3 rounded-xl bg-[#4267B2]/10 hover:bg-[#4267B2]/20 text-[#4267B2] transition-colors"><Facebook className="w-5 h-5" /></button>
                <button onClick={shareToLinkedIn} className="p-3 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] transition-colors"><Linkedin className="w-5 h-5" /></button>
                {'share' in navigator && (
                    <button onClick={handleNativeShare} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors"><Share2 className="w-5 h-5" /></button>
                )}
            </div>
            <div className="grid grid-cols-2 gap-2">
                <button onClick={handleDownload} disabled={downloading} className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-colors disabled:opacity-50">
                    <Download className="w-4 h-4" /> {downloading ? 'Saving...' : 'Save Image'}
                </button>
                <button onClick={handleCopyLink} className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 text-stone-300 rounded-xl font-medium hover:bg-white/10 transition-colors border border-white/10">
                    {copied ? <><Check className="w-4 h-4 text-emerald-400" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
                </button>
            </div>
        </div>
    );

    if (isModal) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={onClose} className="absolute -top-12 right-0 p-2 text-stone-400 hover:text-white transition-colors rounded-lg hover:bg-white/10">
                        <X className="w-6 h-6" />
                    </button>
                    {CardContent}
                    {ShareButtons}
                </motion.div>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto">
            {CardContent}
            {ShareButtons}
        </div>
    );
};

// Compact share button for use in other places
export const ShareButton: React.FC<{
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
}> = ({ onClick, variant = 'secondary', size = 'md' }) => {
    const sizeClasses = {
        sm: 'p-2 text-xs',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    const variantClasses = {
        primary: 'bg-gradient-to-r from-violet-500 to-cyan-500 text-white hover:from-violet-600 hover:to-cyan-600',
        secondary: 'bg-white/5 text-stone-300 hover:bg-white/10 border border-white/10'
    };

    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center gap-2 rounded-xl font-medium transition-colors ${sizeClasses[size]} ${variantClasses[variant]}`}
        >
            <Share2 className="w-4 h-4" />
            Share Build
        </button>
    );
};
