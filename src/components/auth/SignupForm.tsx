import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Wallet, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { GoogleLogin } from '@react-oauth/google';

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    walletAddress: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup, googleLogin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const success = await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.walletAddress
      );
      
      if (success) {
        toast({
          title: "Welcome to UrjaLink! ⚡",
          description: "Account created successfully. You're now logged in.",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const success = await googleLogin(credentialResponse.credential);
      if (success) {
        toast({
          title: "Welcome to UrjaLink! ⚡",
          description: "Successfully signed in with Google.",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: "Google Signup Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const generateWalletAddress = () => {
    const randomAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
    handleInputChange('walletAddress', randomAddress);
    toast({
      title: "Wallet Generated! ⚡",
      description: "A new wallet address has been generated for you.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="pl-10 pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Wallet Address Field */}
      <div className="space-y-2">
        <Label htmlFor="walletAddress">Wallet Address (Optional)</Label>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="walletAddress"
              type="text"
              placeholder="0x... or generate one"
              value={formData.walletAddress}
              onChange={(e) => handleInputChange('walletAddress', e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={generateWalletAddress}
            className="shrink-0"
          >
            Generate
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          A wallet address will be generated automatically if not provided.
        </p>
      </div>

      {/* Signup Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full btn-solar group"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Creating Account...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </Button>

      {/* Google Sign-up */}
      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            toast({
              title: "Google Signup Failed",
              description: "Something went wrong. Please try again.",
              variant: "destructive",
            });
          }}
        />
      </div>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary hover:text-primary-glow font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};

export default SignupForm;