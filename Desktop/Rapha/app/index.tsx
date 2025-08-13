import React from 'react';
import FlowRouter from '../components/FlowRouter';

/**
 * Root index component that delegates routing to FlowRouter
 * FlowRouter handles all the complex routing logic based on user flow completion
 */
export default function Index() {
  return <FlowRouter />;
} 