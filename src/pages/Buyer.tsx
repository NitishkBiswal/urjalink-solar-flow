import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap, Users, Clock, ServerCrash, Loader } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface EnergyListing {
  _id: string;
  sellerId: {
    _id: string;
    name: string;
    walletAddress: string;
  };
  energyUnits: number;
  pricePerUnit: number;
  createdAt: string;
}

const fetchEnergyListings = async (): Promise<EnergyListing[]> => {
  const response = await fetch('http://localhost:5000/api/energy/listings');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Buyer: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: listings, isLoading, isError } = useQuery<EnergyListing[]>({
    queryKey: ['energyListings'],
    queryFn: fetchEnergyListings,
  });

  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  const handleBuyEnergy = async (listing: EnergyListing) => {
    if (!user) {
        toast({ title: "Please log in to purchase energy.", variant: "destructive" });
        return;
    }
    
    try {
        const response = await fetch('http://localhost:5000/api/transactions/buy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listingId: listing._id, buyerId: user.id }),
        });

        if (!response.ok) {
            throw new Error('Failed to purchase energy.');
        }

        toast({
            title: "Purchase Successful! ⚡",
            description: `You bought ${listing.energyUnits} kWh from ${listing.sellerId.name}.`,
        });

        queryClient.invalidateQueries({ queryKey: ['energyListings'] });
        queryClient.invalidateQueries({ queryKey: ['transactionHistory'] });

    } catch (error) {
        toast({ title: "Purchase Failed", description: "This listing may no longer be available.", variant: "destructive" });
    }
  };
  
  const totalAvailableEnergy = listings?.reduce((sum, l) => sum + l.energyUnits, 0) || 0;
  const averagePrice = (listings?.reduce((sum, l) => sum + l.pricePerUnit, 0) || 0) / (listings?.length || 1);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <div className="inline-flex items-center space-x-3 mb-6"><div className="p-3 bg-gradient-tech rounded-xl"><ShoppingCart className="w-8 h-8 text-white" /></div><div><h1 className="text-3xl font-bold text-foreground">Buyer Marketplace</h1><p className="text-muted-foreground">Purchase clean solar energy from verified sellers</p></div></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="card-glow"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">Available Energy</p><p className="text-2xl font-bold text-primary">{totalAvailableEnergy.toFixed(1)} kWh</p></div><Zap className="w-8 h-8 text-primary" /></div></CardContent></Card>
            <Card className="card-glow"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">Active Listings</p><p className="text-2xl font-bold text-secondary">{listings?.length || 0}</p></div><Users className="w-8 h-8 text-secondary" /></div></CardContent></Card>
            <Card className="card-glow"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">Average Price</p><p className="text-2xl font-bold text-accent">₹{averagePrice.toFixed(2)}/kWh</p></div><Zap className="w-8 h-8 text-accent" /></div></CardContent></Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="text-xl font-semibold text-foreground mb-6">Available Energy Listings</h2>
          
          {isLoading && (<div className="flex justify-center items-center py-12"><Loader className="w-8 h-8 animate-spin text-primary" /><p className="ml-4 text-muted-foreground">Fetching live listings...</p></div>)}
          {isError && (<div className="text-center py-12 text-destructive"><ServerCrash className="w-16 h-16 mx-auto mb-4" /><h3 className="text-xl font-semibold mb-2">Could not fetch listings</h3><p className="text-muted-foreground">There was an issue connecting to the server. Please try again later.</p></div>)}

          {!isLoading && !isError && listings && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing, index) => (
                <motion.div key={listing._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                  <Card className="card-energy h-full">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div><CardTitle className="text-lg font-semibold text-foreground">{listing.sellerId.name}</CardTitle><p className="text-sm text-muted-foreground">{formatAddress(listing.sellerId.walletAddress)}</p></div>
                        <Badge variant="default" className="bg-primary">Available</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Energy Units</span><span className="font-semibold text-foreground">{listing.energyUnits} kWh</span></div>
                        <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">Price per Unit</span><span className="font-semibold text-foreground">₹{listing.pricePerUnit}</span></div>
                        <div className="flex items-center justify-between border-t pt-2"><span className="text-sm font-medium text-foreground">Total Price</span><span className="text-lg font-bold text-primary">₹{(listing.energyUnits * listing.pricePerUnit).toFixed(2)}</span></div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center space-x-1"><Clock className="w-4 h-4 text-muted-foreground" /><span className="text-sm text-muted-foreground">{formatTimeAgo(listing.createdAt)}</span></div>
                        <Button onClick={() => handleBuyEnergy(listing)} className="btn-tech" size="sm"><ShoppingCart className="w-4 h-4 mr-2" />Buy Now</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && listings?.length === 0 && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12"><Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4" /><h3 className="text-xl font-semibold text-foreground mb-2">No Energy Available</h3><p className="text-muted-foreground">Check back later for new energy listings from our sellers.</p></motion.div>)}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Buyer;