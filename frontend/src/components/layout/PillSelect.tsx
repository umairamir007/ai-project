'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '../ui/select';
interface PillSelectProps<T extends string> {
    value: T;
    onChange: (value: T) => void;
    options: ReadonlyArray<{ value: T; label: string }>; // 👈 fix here
    placeholder?: string;
    className?: string;
    widthClass?: string;
}
const PillSelect = <T extends string>({
    value,
    onChange,
    options,
    placeholder = 'Select option',
    className,
    widthClass = 'sm:w-[240px]',
}: PillSelectProps<T>) => {
    return (
        <div className={cn('w-full sm:w-auto flex justify-center sm:justify-end', className)}>
            <Select value={value} onValueChange={(v) => onChange(v as T)}>
                <SelectTrigger
                    className={cn(
                        'h-12 min-h-12 w-full',
                        widthClass,
                        'rounded-full border-0 bg-backgroundCard',
                        'text-grey3 !hover:text-red-400 text-base leading-none px-4 shadow-none',
                        '[&>svg]:h-5 [&>svg]:w-5'
                    )}
                >
                    <SelectValue className='text-red-400' placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent align="end" className="min-w-[200px]">
                    {options.map((opt) => (
                        <SelectItem className='hover:text-red-500' key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
export default PillSelect;
