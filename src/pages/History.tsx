import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, TrendingUp, TrendingDown, ServerCrash, Loader, Filter, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

interface Transaction {
  _id: string;
  sellerId: { _id: string; name: string; };
  buyerId: { _id: string; name: string; };
  energyUnits: number;
  pricePerUnit: number;
  totalAmount: number;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

const fetchHistory = async (userId: string | undefined): Promise<Transaction[]> => {
    if (!userId) return [];
    const response = await fetch(`http://localhost:5000/api/transactions/history/${userId}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const History: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const { data: transactions, isLoading, isError } = useQuery<Transaction[]>({
    queryKey: ['transactionHistory', user?.id],
    queryFn: () => fetchHistory(user?.id),
    enabled: !!user,
  });

  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

  const totalSold = transactions
    ?.filter(t => t.sellerId._id === user?.id)
    .reduce((sum, t) => sum + t.totalAmount, 0) || 0;
  
  const totalBought = transactions
    ?.filter(t => t.buyerId._id === user?.id)
    .reduce((sum, t) => sum + t.totalAmount, 0) || 0;

  const filteredTransactions = transactions?.filter(transaction => {
    const transactionType = transaction.sellerId._id === user?.id ? 'sell' : 'buy';
    const counterpartyName = transactionType === 'sell' ? transaction.buyerId.name : transaction.sellerId.name;
    
    const matchesSearch = counterpartyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transactionType === filterType;
    
    return matchesSearch && matchesType;
  }) || [];

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-energy rounded-xl"><HistoryIcon className="w-8 h-8 text-white" /></div>
            <div><h1 className="text-3xl font-bold text-foreground">Transaction History</h1><p className="text-muted-foreground">View all your energy trading transactions</p></div>
          </div>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="card-glow"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">Total Sold</p><p className="text-2xl font-bold text-primary">₹{totalSold.toFixed(2)}</p></div><TrendingUp className="w-8 h-8 text-primary" /></div></CardContent></Card>
            <Card className="card-glow"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground mb-1">Total Bought</p><p className="text-2xl font-bold text-secondary">₹{totalBought.toFixed(2)}</p></div><TrendingDown className="w-8 h-8 text-secondary" /></div></CardContent></Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
            <Card className="card-glow"><CardHeader><CardTitle className="flex items-center space-x-2"><Filter className="w-5 h-5" /><span>Filter Transactions</span></CardTitle></CardHeader><CardContent><div className="flex flex-col md:flex-row gap-4"><div className="flex-1"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search by counterparty..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" /></div></div><Select value={filterType} onValueChange={setFilterType}><SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="buy">Buy</SelectItem><SelectItem value="sell">Sell</SelectItem></SelectContent></Select></div></CardContent></Card>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-4">
          {isLoading && (<div className="flex justify-center items-center py-12"><Loader className="w-8 h-8 animate-spin text-primary" /><p className="ml-4 text-muted-foreground">Loading history...</p></div>)}
          {isError && (<div className="text-center py-12 text-destructive"><ServerCrash className="w-16 h-16 mx-auto mb-4" /><h3 className="text-xl font-semibold mb-2">Could not fetch history</h3><p className="text-muted-foreground">There was an issue connecting to the server.</p></div>)}
          
          {!isLoading && !isError && filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => {
              const isSell = transaction.sellerId._id === user?.id;
              const counterparty = isSell ? transaction.buyerId : transaction.sellerId;
              return (
              <motion.div key={transaction._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="card-glow hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <Badge className={`${isSell ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>{isSell ? 'SELL' : 'BUY'}</Badge>
                          <Badge className="bg-primary/20 text-primary">{transaction.status.toUpperCase()}</Badge>
                          <span className="text-sm text-muted-foreground">{formatDate(transaction.createdAt)}</span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">{isSell ? `Sold to ${counterparty.name}` : `Bought from ${counterparty.name}`}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{formatAddress(counterparty._id)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${isSell ? 'text-primary' : 'text-secondary'}`}>{isSell ? '+' : '-'} ₹{transaction.totalAmount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{transaction.energyUnits} kWh @ ₹{transaction.pricePerUnit}/kWh</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )})
          ) : null}

          {!isLoading && !isError && transactions?.length === 0 && (
            <Card className="card-glow"><CardContent className="p-12 text-center"><HistoryIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" /><h3 className="text-xl font-semibold text-foreground mb-2">No Transactions Found</h3><p className="text-muted-foreground">Your transaction history will appear here once you start buying or selling energy.</p></CardContent></Card>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default History;