"use client";
import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button";

const HeroSection = () => {
    const imageRef = useRef();
    useEffect(() => {
        const imageElement = imageRef.current;
        const handlescroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThershold = 100;
            if (scrollPosition > scrollThershold) {
                imageElement.classList.add("scrolled");
            } else {
                imageElement.classList.remove("scrolled");
            }
        }
        window.addEventListener("scroll", handlescroll);
        return () => window.removeEventListener("scroll", handlescroll);
    }, []);

    return (
        <div className='pb-20 px-8 pt-20'>
            <div className='container mx-auto text-center '>
                <h1 className='text-5xl md:text-8xl lg:text-[105px] pd-6 gradient-title'>
                    Manage Your Finance <br /> With Intelligence
                </h1>
                <p className='text-xl text-gray-600 mb-8 mt-8 max-w-2xl mx-auto'>
                    An AI-powered finance management platform that helps you track,
                    analyze, and optimize your spending with real-time insights.
                </p>
                <div className='flex justify-center space-x-4 mb-5'>
                    <Link href="/dashboard">
                        <Button size="lg" className="px-8">Get Started</Button>
                    </Link>
                    <Link href="https://www.google.com">
                        <Button size="lg" className="px-8" variant="outline">Watch Demo</Button>
                    </Link>
                </div>
                <div className='hero-image-wrapper'>
                    <div ref={imageRef} className='hero-image'>
                        <Image
                            src="/banner.jpeg"
                            alt="hero image"
                            height={1600}
                            width={780}
                            className="rounded-lg shadow-2xl border mx-auto"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
