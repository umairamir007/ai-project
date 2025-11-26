"use client";

import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const BackButton = ({ className }: { className?: string }) => {
    const router = useRouter();

    return (
        <Button
            variant='outline2'
            onClick={() => router.back()}
            className={cn(className)}
            size='sm'
        >
            <ArrowLeft className='size-4' />
            Back
        </Button>
    );
};

export default BackButton;
