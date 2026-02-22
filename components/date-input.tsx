"use client";

import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateInputProps {
    id: string;
    value: string; // Format: YYYY-MM-DD
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    required?: boolean;
    className?: string;
    helpText?: string;
    'aria-describedby'?: string;
    min?: string; // Format: YYYY-MM-DD
    max?: string; // Format: YYYY-MM-DD
}

export default function DateInput({
    id,
    value,
    onChange,
    label,
    placeholder,
    required = false,
    className = "",
    helpText,
    'aria-describedby': ariaDescribedBy,
    min,
    max
}: DateInputProps) {
    // Formater la date pour l'affichage (optionnel - pour améliorer l'UX)
    const formatDateForDisplay = (dateStr: string) => {
        if (!dateStr) return '';
        try {
            const [year, month, day] = dateStr.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="space-y-2">
            {label && (
                <Label htmlFor={id} className="text-sm font-medium text-gray-700 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {label} {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
            )}

            <div className="relative">
                <input
                    type="date"
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                    aria-describedby={ariaDescribedBy}
                    placeholder={placeholder}
                    min={min}
                    max={max}
                    className={cn(
                        "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm",
                        "focus:outline-none focus:ring-2 focus:ring-[#752D8B] focus:border-[#752D8B]",
                        "text-sm text-gray-900 bg-white",
                        "hover:border-gray-400 transition-colors duration-200",
                        "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
                        // Style pour le calendrier natif
                        "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
                        "[&::-webkit-calendar-picker-indicator]:opacity-70",
                        "[&::-webkit-calendar-picker-indicator]:hover:opacity-100",
                        className
                    )}
                    style={{
                        // Assure que le picker s'affiche correctement
                        colorScheme: 'light',
                    }}
                />
            </div>

            {/* Afficher la date formatée si une valeur est sélectionnée */}
            {value && (
                <p className="text-xs text-gray-600 mt-1">
                    Date sélectionnée : {formatDateForDisplay(value)}
                </p>
            )}

            {helpText && (
                <p className="text-xs text-gray-500" id={ariaDescribedBy}>
                    {helpText}
                </p>
            )}
        </div>
    );
}
