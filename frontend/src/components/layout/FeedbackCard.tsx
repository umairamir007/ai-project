import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Heading } from './heading'
import { Button } from '../ui/button'
import Image from 'next/image'

const FeedbackCard = () => {

    const platforms = [
        '/images/google_white.svg',
        '/images/facebook_white.svg',
        '/images/zocdoc_white.svg',
        '/images/healthgrades_white.svg',
        '/images/yelp_white.svg',
    ];

    return (
        <Card className='p-4'>
            <CardContent className='p-0 flex flex-col md:flex-row items-center justify-between'>
                <Heading size='lg' title='Review your clinic on other platforms and earn eye coins!' />
                <div className='flex flex-wrap justify-center md:justify-between gap-2 mt-4 md:mt-0'>
                    {
                        platforms.map((src, i) => (
                            <Button key={i} variant='icon' className='bg-alpha py-2'>
                                <Image src={src} alt='google' height={24} width={24} />
                            </Button>
                        ))
                    }
                </div>
            </CardContent>
        </Card>
    )
}

export default FeedbackCard
