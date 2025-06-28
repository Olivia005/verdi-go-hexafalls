
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GuideSection = () => {
  return (
    <section id="guide" className="py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-eco-dark">Recycling Guide</h2>
          <p className="text-muted-foreground text-lg">
            Learn about the proper ways to prepare and sort different materials for recycling
            to maximize the efficiency of the recycling process.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="preparation" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-8">
              <TabsTrigger value="preparation" className="text-lg">Preparation</TabsTrigger>
              <TabsTrigger value="materials" className="text-lg">Materials</TabsTrigger>
              <TabsTrigger value="tips" className="text-lg">Tips & Tricks</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preparation">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PreparationCard 
                  title="Clean Containers"
                  description="Rinse food residue from containers. They don't need to be spotless, but should be free of major food waste."
                />
                <PreparationCard 
                  title="Flatten Cardboard"
                  description="Break down cardboard boxes to save space. Remove any tape, labels, or other non-paper materials when possible."
                />
                <PreparationCard 
                  title="Remove Lids & Caps"
                  description="In most areas, plastic caps and metal lids should be removed from bottles and jars before recycling."
                />
                <PreparationCard 
                  title="Separate Materials"
                  description="If an item contains multiple materials, try to separate them if possible (e.g., paper labels from plastic bottles)."
                />
              </div>
            </TabsContent>
            
            <TabsContent value="materials">
              <div className="grid grid-cols-1 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm shadow-md">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <MaterialTypeCard 
                        color="blue" 
                        title="Plastic" 
                        types={["#1 PET", "#2 HDPE", "#5 PP"]} 
                        nonTypes={["#3 PVC", "#6 PS", "#7 Other"]}
                      />
                      <MaterialTypeCard 
                        color="green" 
                        title="Paper" 
                        types={["Newspapers", "Office paper", "Cardboard"]} 
                        nonTypes={["Waxed paper", "Soiled paper", "Receipts"]}
                      />
                      <MaterialTypeCard 
                        color="amber" 
                        title="Glass" 
                        types={["Bottles", "Jars", "Clear or colored glass"]} 
                        nonTypes={["Ceramics", "Window glass", "Crystal"]}
                      />
                      <MaterialTypeCard 
                        color="red" 
                        title="Metal" 
                        types={["Aluminum cans", "Steel cans", "Clean foil"]} 
                        nonTypes={["Paint cans", "Aerosols", "Electronics"]}
                      />
                      <MaterialTypeCard 
                        color="purple" 
                        title="Electronics" 
                        types={["Requires special recycling", "Drop-off locations", "Retailer take-back"]} 
                        nonTypes={["Don't put in regular bin", "Contains hazardous materials"]}
                      />
                      <MaterialTypeCard 
                        color="orange" 
                        title="Hazardous" 
                        types={["Special collection sites", "Community events"]} 
                        nonTypes={["Never in regular trash", "Batteries", "Chemicals"]}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="tips">
              <Card className="bg-white/80 backdrop-blur-sm shadow-md">
                <CardContent className="p-6">
                  <ul className="space-y-4">
                    <li className="pb-3 border-b">
                      <h3 className="font-semibold text-lg mb-1">Check Local Guidelines</h3>
                      <p className="text-muted-foreground">
                        Recycling rules vary by location. Check with your local waste management authority to confirm what can be recycled in your area.
                      </p>
                    </li>
                    <li className="pb-3 border-b">
                      <h3 className="font-semibold text-lg mb-1">When in Doubt, Throw it Out</h3>
                      <p className="text-muted-foreground">
                        Contamination can cause entire batches of recyclables to be rejected. If you're unsure if something can be recycled, it's better to put it in the trash.
                      </p>
                    </li>
                    <li className="pb-3 border-b">
                      <h3 className="font-semibold text-lg mb-1">Avoid Wishcycling</h3>
                      <p className="text-muted-foreground">
                        "Wishcycling" is putting items in the recycling bin hoping they'll be recycled. This can contaminate recyclable materials and cause problems.
                      </p>
                    </li>
                    <li className="pb-3 border-b">
                      <h3 className="font-semibold text-lg mb-1">Reduce and Reuse First</h3>
                      <p className="text-muted-foreground">
                        Remember that recycling is the last of the "3 Rs". Reducing consumption and reusing items when possible are even more environmentally friendly.
                      </p>
                    </li>
                    <li>
                      <h3 className="font-semibold text-lg mb-1">Buy Recycled Products</h3>
                      <p className="text-muted-foreground">
                        Complete the recycling loop by purchasing products made from recycled materials. This creates demand for recyclables and supports the recycling industry.
                      </p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

interface PreparationCardProps {
  title: string;
  description: string;
}

const PreparationCard = ({ title, description }: PreparationCardProps) => {
  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-md border-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

interface MaterialTypeCardProps {
  color: string;
  title: string;
  types: string[];
  nonTypes: string[];
}

const MaterialTypeCard = ({ color, title, types, nonTypes }: MaterialTypeCardProps) => {
  // Mapping color names to Tailwind classes
  const colorMap: Record<string, string> = {
    blue: 'bg-recycling-blue',
    green: 'bg-recycling-green',
    amber: 'bg-recycling-yellow',
    red: 'bg-recycling-red',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };
  
  return (
    <div className="rounded-md overflow-hidden shadow-sm">
      <div className={`${colorMap[color] || 'bg-gray-500'} p-3`}>
        <h3 className="font-bold text-white">{title}</h3>
      </div>
      <div className="p-3 bg-white">
        <h4 className="font-medium text-sm mb-1 text-green-600">Usually Recyclable:</h4>
        <ul className="text-sm mb-3 ml-4 list-disc">
          {types.map((type, index) => (
            <li key={`type-${index}`} className="text-gray-700">{type}</li>
          ))}
        </ul>
        
        <h4 className="font-medium text-sm mb-1 text-red-600">Not Usually Recyclable:</h4>
        <ul className="text-sm ml-4 list-disc">
          {nonTypes.map((type, index) => (
            <li key={`nontype-${index}`} className="text-gray-700">{type}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GuideSection;
