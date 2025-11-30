'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Share2,
    Download,
    Copy,
    Check,
    Mountain,
    Gauge,
    Scale,
    Zap,
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

    const weightDisplay = toWeight(totalWeight / 1000, unitSystem).toFixed(1);
    const weightLabel = weightUnit(unitSystem);

    const speedMin = speedRange ? toSpeed(speedRange.min, unitSystem).toFixed(0) : '--';
    const speedMax = speedRange ? toSpeed(speedRange.max, unitSystem).toFixed(0) : '--';
    const speedLabel = speedUnit(unitSystem);

    const gearConfig = chainrings.length === 1 ? '1x' : '2x';
    const totalGears = chainrings.length * cassetteCogs.length;
    const cassetteRange = cassetteCogs.length > 0
        ? `${cassetteCogs[cassetteCogs.length - 1]}-${cassetteCogs[0]}`
        : '--';

    const getScoreLabel = (score: number) => {
        if (score >= 80) return { label: 'Excellent', color: 'text-emerald-400' };
        if (score >= 60) return { label: 'Good', color: 'text-lime-400' };
        if (score >= 40) return { label: 'Fair', color: 'text-amber-400' };
        if (score >= 20) return { label: 'Challenging', color: 'text-orange-400' };
        return { label: 'Difficult', color: 'text-red-400' };
    };

    const scoreInfo = getScoreLabel(climbingScore);

    // Generate shareable URL
    const getShareUrl = () => {
        // In a real app, this would be a short URL or saved build URL
        return typeof window !== 'undefined' ? window.location.origin + '/builder' : '';
    };

    // Download card as image
    const handleDownload = async () => {
        if (!cardRef.current) return;

        setDownloading(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                backgroundColor: '#0a0a0a',
                scale: 2,
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
        const text = `Check out my ${frameName} build on CrankSmith! ${gearConfig} ${chainrings.join('/')} x ${cassetteRange} with ${totalGears} gears.`;
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

    // Native share (mobile)
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
        <div
            ref={cardRef}
            className="bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 rounded-2xl p-6 border border-white/10 shadow-2xl"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white">{frameName}</h3>
                    <p className="text-xs text-stone-500">Built with CrankSmith</p>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">CS</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Speed Range */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-stone-500 mb-2">
                        <Zap className="w-4 h-4" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Speed Range @90rpm</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold font-mono text-white">{speedMin}</span>
                        <span className="text-stone-500">to</span>
                        <span className="text-2xl font-bold font-mono text-cyan-400">{speedMax}</span>
                        <span className="text-xs text-stone-500 ml-1">{speedLabel}</span>
                    </div>
                    <div className="text-[10px] text-stone-600 mt-1">Low gear → Top gear</div>
                </div>

                {/* Weight */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-stone-500 mb-2">
                        <Scale className="w-4 h-4" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Weight</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold font-mono text-white">{weightDisplay}</span>
                        <span className="text-xs text-stone-500">{weightLabel}</span>
                    </div>
                </div>

                {/* Gearing */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-stone-500 mb-2">
                        <Gauge className="w-4 h-4" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Gearing</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-violet-400">{gearConfig}</span>
                        <span className="text-sm text-stone-400">{chainrings.join('/')} x {cassetteRange}</span>
                    </div>
                    <div className="text-xs text-stone-600 mt-0.5">{totalGears} total gears</div>
                </div>

                {/* Climbing */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-stone-500 mb-2">
                        <Mountain className="w-4 h-4" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider">Climbing</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold font-mono ${scoreInfo.color}`}>
                            {climbingScore.toFixed(0)}
                        </span>
                        <span className="text-xs text-stone-500">/ 100</span>
                    </div>
                    <div className={`text-xs mt-0.5 ${scoreInfo.color}`}>{scoreInfo.label}</div>
                </div>
            </div>

            {/* Parts List - Compact */}
            <div className="bg-white/[0.02] rounded-xl p-3 border border-white/5">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    {Object.entries(parts).map(([type, part]) => (
                        part && (
                            <div key={type} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                                <span className="text-stone-600 truncate">{type}</span>
                                <span className="text-stone-400 truncate text-right max-w-[120px]">{part.name.split(' ').slice(0, 2).join(' ')}</span>
                            </div>
                        )
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] text-stone-600">cranksmith.app</span>
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-emerald-500">Compatible Build</span>
                </div>
            </div>
        </div>
    );

    const ShareButtons = (
        <div className="mt-4 space-y-3">
            {/* Social Share */}
            <div className="flex justify-center gap-2">
                <button
                    onClick={shareToTwitter}
                    className="p-3 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] transition-colors"
                    aria-label="Share on Twitter"
                >
                    <Twitter className="w-5 h-5" />
                </button>
                <button
                    onClick={shareToFacebook}
                    className="p-3 rounded-xl bg-[#4267B2]/10 hover:bg-[#4267B2]/20 text-[#4267B2] transition-colors"
                    aria-label="Share on Facebook"
                >
                    <Facebook className="w-5 h-5" />
                </button>
                <button
                    onClick={shareToLinkedIn}
                    className="p-3 rounded-xl bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] transition-colors"
                    aria-label="Share on LinkedIn"
                >
                    <Linkedin className="w-5 h-5" />
                </button>
                {'share' in navigator && (
                    <button
                        onClick={handleNativeShare}
                        className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
                        aria-label="More share options"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    <Download className="w-4 h-4" />
                    {downloading ? 'Saving...' : 'Save Image'}
                </button>
                <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-white/5 text-stone-300 rounded-xl font-medium hover:bg-white/10 transition-colors border border-white/10"
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            Copy Link
                        </>
                    )}
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
                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute -top-12 right-0 p-2 text-stone-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                    >
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
