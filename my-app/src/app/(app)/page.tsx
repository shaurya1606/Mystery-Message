'use client'
import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import Autoplay from "embla-carousel-autoplay"
import messages from "@/data/messages.json"

const Home = () => {
  return (
    <>
    <main className='flex flex-grow flex-col items-center justify-center px-4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-3xl font-bold mb-4 md:text-5xl'> Dive into the world of Anonymous Conversations</h1>
        <p className='mt-3 md:mt-4 text-base md:text-lg'>Explore Mystery Message - Where your identity remains a secret.</p>
      </section>
    <Carousel 
    plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
    className="w-full max-w-xs">
      <CarouselContent>
        {
          messages.map((message, index) => (
           
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardHeader className="border-b p-4">
                  <h3 className="text-lg font-bold">{message.title}</h3>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-6">
                  <span className="text-lg font-text">{message.content}</span>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <p className="text-sm text-muted-foreground">{message.receivedTime}</p>
                </CardFooter>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
    </main>
    <footer className="w-full border-t py-4 text-center">
      <p className="text-sm text-muted-foreground">© 2024 Mystery Message. All rights reserved.</p>
    </footer>
    {/* <Toaster position="bottom-right" richColors /> */}
    </>

  )
}

export default Home