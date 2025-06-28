
import React, { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import ClassificationResult from './ClassificationResult';
import { WasteClassificationResult, classifyWasteImage, initializeModel } from '@/lib/wastelessModel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ClassifySection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<WasteClassificationResult | null>(null);
  const [modelInitialized, setModelInitialized] = useState(false);

  useEffect(() => {
    const loadModel = async () => {
      const initialized = await initializeModel();
      setModelInitialized(initialized);
    };

    loadModel();
  }, []);

  const handleImageSelect = async (file: File) => {
    setIsLoading(true);
    setResult(null);
    
    try {
      const classificationResult = await classifyWasteImage(file);
      if (classificationResult) {
        setResult(classificationResult);
      }
    } catch (error) {
      console.error("Error processing image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetClassification = () => {
    setResult(null);
  };

  return (
    <section id="classify" className="py-24">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-eco-dark">Waste Classification</h2>
          <p className="text-muted-foreground text-lg">
            Upload an image or use your camera to identify whether an item is recyclable or not.
            Our AI model will analyze the image and provide recommendations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="image" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-8">
              <TabsTrigger value="image" className="text-lg">Image Classification</TabsTrigger>
              <TabsTrigger value="guide" className="text-lg">Waste Categories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="image" className="relative">
              {!modelInitialized && (
                <Alert className="mb-6 bg-yellow-50 border-yellow-200">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-700">
                    Loading classification model. Please wait a moment...
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col items-center">
                <div className="w-full max-w-md relative">
                  {result ? (
                    <ClassificationResult result={result} onReset={resetClassification} />
                  ) : (
                    <ImageUploader onImageSelect={handleImageSelect} isLoading={isLoading} />
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="guide">
              <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-bold mb-4">Dataset Categories</h3>
                <p className="mb-4 text-muted-foreground">
                  Our waste classification model is trained to recognize the following types of waste items:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mb-8">
                  <CategorySection title="Glass" items={['Glass beverage bottles', 'Glass cosmetic containers', 'Glass food jars']} recyclable={true} />
                  
                  <CategorySection title="Paper" items={['Magazines', 'Newspaper', 'Office paper', 'Paper cups']} recyclable={true} />
                  
                  <CategorySection title="Cardboard" items={['Cardboard boxes', 'Cardboard packaging']} recyclable={true} />
                  
                  <CategorySection title="Plastic" 
                    items={[
                      'Plastic cutlery', 
                      'Plastic cup lids',
                      'Plastic detergent bottles',
                      'Plastic food containers',
                      'Plastic shopping bags',
                      'Plastic soda bottles',
                      'Plastic water bottles'
                    ]} 
                    recyclable={true} 
                  />
                  
                  <CategorySection title="Metal" 
                    items={[
                      'Aerosol cans',
                      'Aluminum food cans', 
                      'Aluminum soda cans', 
                      'Steel food cans'
                    ]} 
                    recyclable={true} 
                  />
                  
                  <CategorySection title="Organic" 
                    items={[
                      'Coffee grounds', 
                      'Eggshells', 
                      'Food waste', 
                      'Tea bags'
                    ]} 
                    recyclable={true} 
                    note="Compostable" 
                  />
                  
                  <CategorySection title="Non-Recyclable" 
                    items={[
                      'Clothing', 
                      'Shoes', 
                      'Styrofoam cups', 
                      'Styrofoam food containers',
                      'Plastic straws',
                      'Plastic trash bags'
                    ]} 
                    recyclable={false} 
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

const CategorySection = ({ 
  title, 
  items, 
  recyclable, 
  note 
}: { 
  title: string; 
  items: string[]; 
  recyclable: boolean;
  note?: string;
}) => (
  <div className="mb-6">
    <h4 className="font-bold mb-2 flex items-center gap-2">
      {title}
      {note && <span className="text-xs font-normal px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">{note}</span>}
      {recyclable ? 
        <div className="h-3 w-3 rounded-full bg-green-500 ml-1"></div> : 
        <div className="h-3 w-3 rounded-full bg-red-500 ml-1"></div>
      }
    </h4>
    <ul className="text-sm space-y-1">
      {items.map((item, index) => (
        <li key={index} className="flex items-center gap-2">
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const CheckCircleItem = ({ label }: { label: string }) => (
  <>
    <div className="h-4 w-4 rounded-full bg-green-500 flex-shrink-0"></div>
    <span>{label}</span>
  </>
);

const XCircleItem = ({ label }: { label: string }) => (
  <>
    <div className="h-4 w-4 rounded-full bg-red-500 flex-shrink-0"></div>
    <span>{label}</span>
  </>
);

export default ClassifySection;
