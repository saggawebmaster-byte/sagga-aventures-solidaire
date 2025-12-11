"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar, ChevronDown } from 'lucide-react';
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
}

export default function DateInput({
    id,
    value,
    onChange,
    label,
    placeholder = "Sélectionner une date",
    required = false,
    className = "",
    helpText,
    'aria-describedby': ariaDescribedBy
}: DateInputProps) {
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // Synchroniser avec la valeur externe
    useEffect(() => {
        if (value) {
            const [yearPart, monthPart, dayPart] = value.split('-');
            setYear(yearPart || '');
            // Retirer le zéro de devant pour le mois pour correspondre à notre format
            setMonth(monthPart ? parseInt(monthPart, 10).toString() : '');
            // Retirer le zéro de devant pour le jour pour correspondre à notre format  
            setDay(dayPart ? parseInt(dayPart, 10).toString() : '');
        } else {
            setDay('');
            setMonth('');
            setYear('');
        }
    }, [value]);

    // Mettre à jour la valeur quand les composants changent
    useEffect(() => {
        if (day && month && year) {
            const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            if (formattedDate !== value) {
                onChange(formattedDate);
            }
        } else if (value && (!day || !month || !year)) {
            onChange('');
        }
    }, [day, month, year, onChange, value]);

    // Générer les options pour les jours
    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month, 0).getDate();
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    const months = [
        { value: '1', label: 'Janvier' },
        { value: '2', label: 'Février' },
        { value: '3', label: 'Mars' },
        { value: '4', label: 'Avril' },
        { value: '5', label: 'Mai' },
        { value: '6', label: 'Juin' },
        { value: '7', label: 'Juillet' },
        { value: '8', label: 'Août' },
        { value: '9', label: 'Septembre' },
        { value: '10', label: 'Octobre' },
        { value: '11', label: 'Novembre' },
        { value: '12', label: 'Décembre' }
    ];

    const maxDays = month && year ? getDaysInMonth(parseInt(month), parseInt(year)) : 31;
    const days = Array.from({ length: maxDays }, (_, i) => i + 1);

    // Valider le jour quand le mois ou l'année change
    useEffect(() => {
        if (day && month && year) {
            const maxDaysInMonth = getDaysInMonth(parseInt(month), parseInt(year));
            if (parseInt(day) > maxDaysInMonth) {
                setDay(maxDaysInMonth.toString());
            }
        }
    }, [month, year, day]);

    const formatDisplayDate = () => {
        if (!day || !month || !year) return '';
        const monthName = months.find(m => m.value === month)?.label;
        if (!monthName) {
            console.warn('Month not found for value:', month);
            return `${day} Mois ${month} ${year}`;
        }
        return `${day} ${monthName} ${year}`;
    };

    const hasValue = day && month && year;

    return (
        <div className="space-y-2">
            {label && (
                <Label htmlFor={id} className="text-sm font-medium text-gray-700 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {label} {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
            )}

            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id={id}
                        variant="outline"
                        className={cn(
                            "w-full justify-start text-left font-normal transition-all duration-200 focus:ring-2 focus:ring-[#752D8B] focus:border-[#752D8B]",
                            !hasValue && "text-muted-foreground",
                            className
                        )}
                        aria-describedby={ariaDescribedBy}
                        aria-expanded={isOpen}
                        aria-haspopup="dialog"
                    >
                        <Calendar className="mr-2 h-4 w-4" />
                        {hasValue ? formatDisplayDate() : placeholder}
                        <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="w-full max-w-[min(20rem,calc(100vw-2rem))] p-0" align="start" side="bottom" sideOffset={4}>
                    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                        <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3 text-center">
                            Sélectionner une date
                        </div>

                        {/* Sélection de l'année - En premier pour une meilleure UX */}
                        <div className="space-y-1.5 sm:space-y-2">
                            <Label className="text-xs font-medium text-gray-600">Année</Label>
                            <Select value={year} onValueChange={setYear}>
                                <SelectTrigger className="focus:ring-[#752D8B] focus:border-[#752D8B] h-9 text-sm w-full">
                                    <SelectValue placeholder="Année" />
                                </SelectTrigger>
                                <SelectContent className="h-48 max-w-[min(20rem,calc(100vw-2rem))]">
                                    {years.map((yearOption) => (
                                        <SelectItem key={yearOption} value={yearOption.toString()}>
                                            {yearOption}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sélection du mois */}
                        <div className="space-y-1.5 sm:space-y-2">
                            <Label className="text-xs font-medium text-gray-600">Mois</Label>
                            <Select value={month} onValueChange={setMonth}>
                                <SelectTrigger className="focus:ring-[#752D8B] focus:border-[#752D8B] h-9 text-sm w-full">
                                    <SelectValue placeholder="Mois" />
                                </SelectTrigger>
                                <SelectContent className="max-w-[min(20rem,calc(100vw-2rem))]">
                                    {months.map((monthOption) => (
                                        <SelectItem key={monthOption.value} value={monthOption.value}>
                                            {monthOption.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sélection du jour */}
                        <div className="space-y-1.5 sm:space-y-2">
                            <Label className="text-xs font-medium text-gray-600">Jour</Label>
                            <Select value={day} onValueChange={setDay} disabled={!month || !year}>
                                <SelectTrigger className="focus:ring-[#752D8B] focus:border-[#752D8B] h-9 text-sm w-full">
                                    <SelectValue placeholder="Jour" />
                                </SelectTrigger>
                                <SelectContent className="h-48 max-w-[min(20rem,calc(100vw-2rem))]">
                                    {days.map((dayOption) => (
                                        <SelectItem key={dayOption} value={dayOption.toString()}>
                                            {dayOption.toString().padStart(2, '0')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex justify-between pt-2 sm:pt-3 border-t gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setDay('');
                                    setMonth('');
                                    setYear('');
                                    onChange('');
                                }}
                                className="text-xs flex-1 h-8"
                            >
                                Effacer
                            </Button>

                            <Button
                                type="button"
                                size="sm"
                                onClick={() => {
                                    const today = new Date();
                                    const todayYear = today.getFullYear().toString();
                                    const todayMonth = (today.getMonth() + 1).toString();
                                    const todayDay = today.getDate().toString();

                                    setYear(todayYear);
                                    setMonth(todayMonth);
                                    setDay(todayDay);
                                }}
                                className="text-xs bg-[#752D8B] hover:bg-[#5a2269] flex-1 h-8 whitespace-nowrap"
                            >
                                Aujourd'hui
                            </Button>

                            <Button
                                type="button"
                                size="sm"
                                onClick={() => setIsOpen(false)}
                                className="text-xs bg-[#752D8B] hover:bg-[#5a2269] flex-1 h-8"
                                disabled={!hasValue}
                            >
                                Valider
                            </Button>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            {helpText && (
                <p className="text-xs text-gray-500" id={ariaDescribedBy}>
                    {helpText}
                </p>
            )}
        </div>
    );
}
