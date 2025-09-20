import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import SignupForm from '@/components/auth/SignupForm';

const Signup: React.FC = () => {
  return (
    <AuthLayout
      title="Join UrjaLink"
      subtitle="Create your account and start trading solar energy on the blockchain"
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default Signup;