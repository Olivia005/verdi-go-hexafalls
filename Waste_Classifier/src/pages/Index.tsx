
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ClassifySection from '@/components/ClassifySection';
import GuideSection from '@/components/GuideSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <AboutSection />
        <ClassifySection />
        <GuideSection />
        <div className="container my-8 text-center">
          <p className="text-sm text-muted-foreground">
            <Link to="/deployed" className="text-eco-primary hover:underline">
              View deployment success page
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
