import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen energy-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card-energy">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 mb-4"
            >
              <div className="p-3 bg-gradient-solar rounded-xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-solar bg-clip-text text-transparent">
                UrjaLink
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-foreground mb-2"
            >
              {title}
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground"
            >
              {subtitle}
            </motion.p>
          </div>

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
        
        {/* Footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-muted-foreground mt-6"
        >
          Powered by Blockchain Technology
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AuthLayout;