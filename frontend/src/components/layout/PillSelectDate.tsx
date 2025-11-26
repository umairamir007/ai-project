'use client';
import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';

interface YearSortProps {
    year: number;
    onChange: (year: number) => void;
}

const YearSort: React.FC<YearSortProps> = ({ year, onChange }) => {
    const [open, setOpen] = React.useState(false);
    const years = [2025, 2024, 2023, 2022, 2021];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        'h-12 min-h-12 rounded-full bg-backgroundCard text-grey3',
                        'text-base leading-none px-4 whitespace-nowrap',
                        'hover:bg-[#E9E9E9]'
                    )}
                >
                    <span className="mr-2">{year}</span>
                    <ChevronDown className="h-5 w-5 opacity-70" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="p-0"
                align="start"
                side="bottom"
                avoidCollisions={false}  >
                <div className="space-y-2">
                    {years.map((y) => (
                        <Button
                            key={y}
                            variant="ghost"
                            className="w-full text-left"
                            onClick={() => {
                                onChange(y);
                                setOpen(false);
                            }}
                        >
                            {y}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default YearSort;
