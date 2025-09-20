import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Wallet, Edit2, Save, X, Camera, Shield, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    walletAddress: user?.walletAddress || '',
  });

  const handleEditToggle = () => {
    if (isEditing) {
      setEditData({
        name: user?.name || '',
        email: user?.email || '',
        walletAddress: user?.walletAddress || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Simulate API update
    toast({
      title: "Profile Updated! ⚡",
      description: "Your profile information has been successfully updated.",
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const stats = [
    { label: 'Total Trades', value: '47', icon: Award, color: 'text-primary' },
    { label: 'Energy Traded', value: '1.2k kWh', icon: Wallet, color: 'text-secondary' },
    { label: 'Success Rate', value: '98.5%', icon: Shield, color: 'text-accent' },
  ];

  const achievements = [
    { name: 'Early Adopter', description: 'Joined UrjaLink in the first month', earned: true },
    { name: 'Green Trader', description: 'Traded over 1000 kWh of clean energy', earned: true },
    { name: 'Trust Builder', description: 'Maintained 98%+ success rate', earned: true },
    { name: 'Volume Master', description: 'Complete 100 successful trades', earned: false },
  ];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-energy rounded-xl">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
              <p className="text-muted-foreground">Manage your account information and preferences</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="card-energy">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isEditing ? handleEditToggle : handleEditToggle}
                    className="flex items-center space-x-2"
                  >
                    {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                    <span>{isEditing ? 'Cancel' : 'Edit'}</span>
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-primary/20">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="text-xl font-bold bg-gradient-solar text-white">
                        {getInitials(user?.name || 'U')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full bg-primary hover:bg-primary/90"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="text-center sm:text-left">
                    <h2 className="text-2xl font-bold text-foreground">{user?.name}</h2>
                    <p className="text-muted-foreground">UrjaLink Member</p>
                    <Badge className="mt-2 bg-primary/10 text-primary">Verified Trader</Badge>
                  </div>
                </div>

                {/* Profile Fields */}
                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="name"
                          value={editData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    ) : (
                      <div className="p-3 bg-muted/50 rounded-lg flex items-center space-x-3">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span>{user?.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={editData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    ) : (
                      <div className="p-3 bg-muted/50 rounded-lg flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{user?.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Wallet Address */}
                  <div className="space-y-2">
                    <Label htmlFor="wallet">Wallet Address</Label>
                    {isEditing ? (
                      <div className="relative">
                        <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="wallet"
                          value={editData.walletAddress}
                          onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                          className="pl-10"
                          placeholder="0x..."
                        />
                      </div>
                    ) : (
                      <div className="p-3 bg-muted/50 rounded-lg flex items-center space-x-3">
                        <Wallet className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-sm">
                          {user?.walletAddress?.slice(0, 6)}...{user?.walletAddress?.slice(-4)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Button onClick={handleSave} className="w-full btn-solar">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats and Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Stats Card */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-lg">Trading Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${stat.color}`} />
                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                      </div>
                      <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Achievements Card */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={achievement.name}
                    className={`p-3 rounded-lg border ${
                      achievement.earned 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'bg-muted/50 border-border opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-foreground text-sm">
                        {achievement.name}
                      </h4>
                      {achievement.earned && (
                        <Award className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-lg">Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Shield className="w-4 h-4 mr-3" />
                  Security Settings
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Wallet className="w-4 h-4 mr-3" />
                  Wallet Settings
                </Button>
                
                <Button
                  variant="destructive"
                  onClick={logout}
                  className="w-full justify-start"
                >
                  <X className="w-4 h-4 mr-3" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;