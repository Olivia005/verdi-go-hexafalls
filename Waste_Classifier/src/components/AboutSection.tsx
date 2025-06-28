
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Recycle, BookOpen, AlertTriangle } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-eco-dark">About Wasteless</h2>
          <p className="text-muted-foreground text-lg">
            Our mission is to simplify waste segregation through AI-powered technology,
            helping individuals make more environmentally conscious decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<Trash2 className="h-10 w-10 text-recycling-red" />}
            title="The Problem"
            description="Improper waste disposal is a significant environmental issue. Many recyclable items end up in landfills due to confusion about what can be recycled."
          />
          
          <StatCard 
            icon={<Recycle className="h-10 w-10 text-recycling-green" />}
            title="Our Solution"
            description="Wasteless uses machine learning to instantly identify whether an item is recyclable, reducing confusion and promoting proper waste segregation."
          />
          
          <StatCard 
            icon={<BookOpen className="h-10 w-10 text-recycling-blue" />}
            title="Educational"
            description="Beyond classification, we provide educational resources to help users understand why certain items are recyclable and how to prepare them properly."
          />
          
          <StatCard 
            icon={<AlertTriangle className="h-10 w-10 text-recycling-yellow" />}
            title="Global Impact"
            description="By improving recycling rates, we can reduce landfill waste, conserve natural resources, and decrease greenhouse gas emissions."
          />
        </div>
      </div>
    </section>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const StatCard = ({ icon, title, description }: StatCardProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-none shadow-md hover:shadow-lg transition-shadow">
      <CardContent className="pt-6 flex flex-col items-center text-center">
        <div className="mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default AboutSection;
