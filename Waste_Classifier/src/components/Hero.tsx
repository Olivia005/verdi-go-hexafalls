
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, RecycleIcon } from 'lucide-react';

const Hero = () => {
  const scrollToClassify = () => {
    const element = document.getElementById('classify');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full recycling-gradient opacity-30" />
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-eco-primary opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-recycling-blue opacity-20 blur-3xl" />
      </div>
      
      <div className="container relative">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <div className="p-3 bg-eco-primary/10 rounded-full mb-6">
            <RecycleIcon className="h-12 w-12 text-eco-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-eco-dark">
            Smarter Waste Sorting with <span className="text-eco-primary">Wasteless</span>
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Use AI-powered image recognition to identify recyclable items and reduce landfill waste. 
            Together, we can make a difference for our planet.
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={scrollToClassify}
              className="bg-eco-primary hover:bg-eco-primary/90"
              size="lg"
            >
              Classify Waste
            </Button>
            <Button 
              variant="outline" 
              className="border-eco-primary text-eco-primary hover:bg-eco-primary/10"
              size="lg"
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-eco-primary" />
      </div>
    </section>
  );
};

export default Hero;
