
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle, Recycle, Trash2 } from 'lucide-react';
import { WasteClassificationResult } from '@/lib/wastelessModel';
import { Button } from './ui/button';

interface ClassificationResultProps {
  result: WasteClassificationResult;
  onReset: () => void;
}

const ClassificationResult: React.FC<ClassificationResultProps> = ({ result, onReset }) => {
  const { category, mainCategory, confidence, recyclable, recommendations } = result;
  
  const renderIcon = () => {
    if (recyclable) {
      return <CheckCircle className="h-16 w-16 text-green-500" />;
    }
    return <XCircle className="h-16 w-16 text-red-500" />;
  };
  
  const getResultTitle = () => {
    if (recyclable) {
      return "Recyclable";
    }
    return "Non-Recyclable";
  };

  const getConfidenceLabel = () => {
    if (confidence > 0.8) return "High Confidence";
    if (confidence > 0.6) return "Medium Confidence";
    return "Low Confidence";
  };
  
  return (
    <div className="animate-fade-in">
      <Card className={`bg-white/90 backdrop-blur-sm shadow-lg ${recyclable ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-red-500'}`}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0 flex justify-center">
              {renderIcon()}
            </div>
            
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-sm px-2 py-0.5 rounded-full ${confidence > 0.6 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {getConfidenceLabel()} ({Math.round(confidence * 100)}%)
                </span>
              </div>
              
              <h3 className="text-2xl font-bold mb-1 flex items-center gap-2">
                {getResultTitle()}
                {recyclable ? 
                  <Recycle className="h-5 w-5 text-green-500" /> : 
                  <Trash2 className="h-5 w-5 text-red-500" />
                }
              </h3>
              
              <div className="mb-3">
                <p className="text-lg font-medium capitalize">
                  Material: <span className="text-eco-primary">{mainCategory}</span>
                </p>
                <p className="text-sm text-muted-foreground capitalize">
                  Detected as: {category.replace(/_/g, ' ')}
                </p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md mb-4 border border-gray-100">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">
                    {recommendations}
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={onReset}
                className="w-full sm:w-auto bg-eco-primary hover:bg-eco-primary/90"
              >
                Classify Another Item
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassificationResult;
