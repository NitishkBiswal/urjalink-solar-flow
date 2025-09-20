import React, { useState } from 'react';
import { motion } from 'framer-motion';
// CHANGE HERE: Import IndianRupee instead of DollarSign
import { IndianRupee, Zap, Plus, CheckCircle, Info } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext'; 

const API_BASE_URL = 'http://localhost:5000/api';

const Seller: React.FC = () => {
  const [formData, setFormData] = useState({
    energyUnits: '',
    pricePerUnit: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.energyUnits || !formData.pricePerUnit) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
        toast({
            title: "Authentication Error",
            description: "You must be logged in to list energy.",
            variant: "destructive",
        });
        return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/energy/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          energyUnits: parseFloat(formData.energyUnits),
          pricePerUnit: parseFloat(formData.pricePerUnit),
          sellerId: user.id
        }),
      });

      if (response.ok) {
        toast({
          title: "Energy Listed Successfully! ⚡",
          description: `${formData.energyUnits} kWh listed at ₹${formData.pricePerUnit} per unit.`,
        });
        setFormData({ energyUnits: '', pricePerUnit: '' });
      } else {
        const errorData = await response.json();
        toast({ title: "Failed to list energy", description: errorData.message || "Please try again.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "An error occurred", description: "Could not connect to the server.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalValue = formData.energyUnits && formData.pricePerUnit 
    ? (parseFloat(formData.energyUnits) * parseFloat(formData.pricePerUnit)).toFixed(2)
    : '0.00';

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-solar rounded-xl">
              {/* CHANGE HERE: Replaced DollarSign icon with IndianRupee icon */}
              <IndianRupee className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Seller Dashboard</h1>
              <p className="text-muted-foreground">List your excess solar energy for sale</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Listing Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="card-energy">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-primary" />
                  <span>List New Energy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Energy Units */}
                  <div className="space-y-2">
                    <Label htmlFor="energyUnits">Your Surplus Energy (kWh) *</Label>
                    <div className="relative">
                      <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="energyUnits"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g., 50.5"
                        value={formData.energyUnits}
                        onChange={(e) => handleInputChange('energyUnits', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Price per Unit */}
                  <div className="space-y-2">
                    <Label htmlFor="pricePerUnit">Price per kWh (₹) *</Label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                      <Input
                        id="pricePerUnit"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="e.g., 4.75"
                        value={formData.pricePerUnit}
                        onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
                        className="pl-8"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.energyUnits || !formData.pricePerUnit}
                    className="w-full btn-solar group"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Listing Energy...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Plus className="w-4 h-4" />
                        <span>List Energy</span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Information Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Listing Summary Card */}
            {formData.energyUnits && formData.pricePerUnit && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="card-glow border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <Info className="w-5 h-5 text-primary" />
                      <span>Listing Summary</span>
                    </CardTitle>
                    <CardDescription>
                      This is what your listing will look like.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-muted-foreground">Surplus to sell:</span>
                      <span className="text-foreground">{parseFloat(formData.energyUnits).toFixed(2)} kWh</span>
                    </div>
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-muted-foreground">Price per kWh:</span>
                      <span className="text-foreground">₹{parseFloat(formData.pricePerUnit).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold border-t pt-3 mt-3">
                      <span className="text-primary">Total Value:</span>
                      <span className="text-primary">₹{totalValue}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* How it Works */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-lg">How Selling Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">List Your Energy</h4>
                    <p className="text-sm text-muted-foreground">
                      Enter the amount of excess solar energy and your desired price
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Blockchain Verification</h4>
                    <p className="text-sm text-muted-foreground">
                      Your listing is recorded on the blockchain for transparency
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium text-foreground">Get Paid</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive instant payments when buyers purchase your energy
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Seller;