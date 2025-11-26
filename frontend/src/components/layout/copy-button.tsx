'use client';

import * as React from 'react';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CopyButtonProps {
    textToCopy: string;
    className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(
            () => {
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 2000);
            },
            (err) => {
                console.error('Failed to copy text: ', err);
            }
        );
    };

    return (
        <Button
            variant="ghost2"
            size='icon'
            onClick={handleCopy}
            className={cn("flex items-center border-none shadow-none rounded-md bg-transparent p-1 transition-all hover:scale-105", className)}
        >
            {copied ? (
                <Check className="h-5 w-5 text-black" />
            ) : (
                <Copy className="h-5 w-5 text-black" />
            )}
        </Button>
    );
};

export default CopyButton;
