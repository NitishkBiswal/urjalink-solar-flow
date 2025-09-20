import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// CHANGE HERE
import { Zap, IndianRupee, ShoppingCart, TrendingUp, Users, Battery } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const roleCards = [
    {
      title: 'I am a Seller',
      description: 'List your excess solar energy and earn money',
      // CHANGE HERE
      icon: IndianRupee,
      path: '/seller',
      gradient: 'bg-gradient-solar',
      delay: 0.1,
    },
    {
      title: 'I am a Buyer',
      description: 'Purchase clean solar energy from verified sellers',
      icon: ShoppingCart,
      path: '/buyer',
      gradient: 'bg-gradient-tech',
      delay: 0.2,
    },
  ];

  const statsCards = [
    {
      title: 'Active Trades',
      value: '127',
      icon: TrendingUp,
      color: 'text-primary',
    },
    {
      title: 'Total Users',
      value: '2.4K+',
      icon: Users,
      color: 'text-secondary',
    },
    {
      title: 'Energy Traded',
      value: '45.7K kWh',
      icon: Battery,
      color: 'text-accent',
    },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center space-x-3 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="p-4 bg-gradient-solar rounded-xl"
            >
              <Zap className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-solar bg-clip-text text-transparent">
                UrjaLink
              </h1>
              <p className="text-lg text-muted-foreground">
                Blockchain-based Solar Energy Marketplace
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-lg text-muted-foreground">
              Ready to trade clean energy on the blockchain? Choose your role below to get started.
            </p>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="card-glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Role Selection Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {roleCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: card.delay }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Link to={card.path}>
                  <Card className="card-energy h-full overflow-hidden">
                    <CardContent className="p-8">
                      <div className="text-center">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`inline-flex p-4 rounded-xl ${card.gradient} mb-6`}
                        >
                          <Icon className="w-8 h-8 text-white" />
                        </motion.div>
                        
                        <h3 className="text-xl font-semibold text-foreground mb-3">
                          {card.title}
                        </h3>
                        
                        <p className="text-muted-foreground mb-6">
                          {card.description}
                        </p>
                        
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="inline-flex items-center text-primary font-medium"
                        >
                          Get Started
                          <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Energy Particles Animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 10,
              }}
              animate={{
                y: -10,
                x: Math.random() * window.innerWidth,
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;