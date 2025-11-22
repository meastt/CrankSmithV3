import React from 'react';
import { Component } from '@/lib/validation';
import { Plus, Check, Scale, Ruler, Settings } from 'lucide-react';

interface PartCardProps {
    component: Component;
    onSelect: (component: Component) => void;
    isSelected: boolean;
}

export const PartCard: React.FC<PartCardProps> = ({ component, onSelect, isSelected }) => {
    // Helper to format attribute keys
    const formatKey = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // Helper to get icon for attribute
    const getIcon = (key: string) => {
        if (key.includes('weight')) return <Scale className="w-3 h-3 mr-1" />;
        if (key.includes('width') || key.includes('diameter') || key.includes('length')) return <Ruler className="w-3 h-3 mr-1" />;
        return <Settings className="w-3 h-3 mr-1" />;
    };

    return (
        <div
            className={`group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl border rounded-2xl p-5 flex flex-col justify-between h-full transition-all duration-300 ${isSelected
                ? 'border-primary/60 bg-gradient-to-br from-primary/20 to-primary/5 shadow-[0_8px_32px_rgba(30,64,175,0.3),0_0_0_1px_rgba(30,64,175,0.1)] ring-1 ring-primary/20'
                : 'border-white/[0.08] hover:border-primary/30 hover:from-white/[0.12] hover:to-white/[0.05] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)]'
                }`}
        >
            <div>
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className={`font-bold text-lg leading-tight mb-1 ${isSelected ? 'text-blue-400' : 'text-white group-hover:text-blue-400 transition-colors'}`}>
                            {component.name}
                        </h3>
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-white/10 text-gray-400 uppercase tracking-wider">
                            {component.type}
                        </span>
                    </div>
                    {isSelected && (
                        <div className="bg-primary text-white rounded-full p-1">
                            <Check className="w-3 h-3" />
                        </div>
                    )}
                </div>

                <div className="space-y-3 mt-4">
                    {/* Key Specs */}
                    {Object.keys(component.attributes).length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(component.attributes).slice(0, 4).map(([key, value]) => (
                                <div key={key} className="bg-white/5 rounded p-2 border border-white/5">
                                    <div className="flex items-center text-[10px] text-gray-500 uppercase tracking-wide mb-0.5">
                                        {getIcon(key)}
                                        {formatKey(key)}
                                    </div>
                                    <div className="text-sm font-medium text-gray-200 truncate">
                                        {value}
                                        {key.includes('weight') ? 'g' : ''}
                                        {key.includes('mm') ? 'mm' : ''}
                                        {key.includes('tooth') || key.includes('capacity') || key.includes('diff') ? 't' : ''}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Interfaces (Compact) */}
                    {Object.keys(component.interfaces).length > 0 && (
                        <div className="pt-2 border-t border-white/10">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1.5">Compatibility</p>
                            <div className="flex flex-wrap gap-1.5">
                                {Object.entries(component.interfaces).map(([key, value]) => (
                                    <span key={key} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-white/5 text-gray-400 border border-white/10">
                                        {value}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
                <button
                    onClick={() => onSelect(component)}
                    className={`flex items-center justify-center w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${isSelected
                        ? 'bg-primary text-white shadow-lg shadow-primary/25'
                        : 'bg-white/10 text-white hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                >
                    {isSelected ? (
                        <>Selected</>
                    ) : (
                        <>
                            <Plus className="w-4 h-4 mr-2" /> Add
                        </>
                    )}
                </button>

                <a
                    href={`https://www.competitivecyclist.com/search?q=${encodeURIComponent(component.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full py-2.5 rounded-lg text-sm font-semibold bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30 hover:border-green-500/50 transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    Buy Now
                </a>
            </div>
        </div>
    );
};
