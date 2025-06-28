
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RecycleIcon, CheckCircle } from 'lucide-react';

const Deployed = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-green-700 mb-2">Successfully Deployed!</h1>
        
        <p className="text-gray-600 mb-6">
          Your Wasteless application has been successfully deployed and is now available online.
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-8">
          <RecycleIcon className="h-8 w-8 text-eco-primary animate-pulse-slow" />
          <span className="text-xl font-bold text-eco-primary">Wasteless</span>
        </div>
        
        <Link to="/">
          <Button className="w-full bg-eco-primary hover:bg-eco-primary/90">
            Return to Application
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Deployed;
