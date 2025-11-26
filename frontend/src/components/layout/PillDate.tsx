'use client';
import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';
import { Calendar } from '../ui/calendar';
interface PillDateProps {
    label: string;
    date?: Date;
    onChange: (date: Date | undefined) => void;
}
const PillDate: React.FC<PillDateProps> = ({ label, date, onChange }) => {
    const [open, setOpen] = React.useState(false);
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
                    <span className="mr-2">{date ? format(date, 'MMM d, yyyy') : label}</span>
                    <ChevronDown className="h-5 w-5 opacity-70" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                        onChange(d);
                        setOpen(false);
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};
export default PillDate;
