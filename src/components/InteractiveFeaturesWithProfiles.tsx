
import React from 'react';
import { motion } from 'framer-motion';
import { InteractiveFeatures as BaseInteractiveFeatures } from './InteractiveFeatures';

// Updated images for the competitors
const competitor1Image = "/lovable-uploads/57780257-3f19-4fb3-99d6-002738aa752f.png";
const competitor2Image = "/lovable-uploads/17b4bc10-d43f-4d5f-a166-f8b276281c3d.png";

// Create a style patch for the live battle feature
const injectCompetitorStyles = () => {
  // Create a style element
  const styleElement = document.createElement('style');
  styleElement.id = 'competitor-profile-styles';
  
  // Add styles to override the profile images
  styleElement.innerHTML = `
    /* Target the specific profile images for the battle feature */
    [data-testid="live-battle-competitor-1"] {
      background-image: url('${competitor1Image}') !important;
      background-size: cover;
      background-position: center;
    }
    
    [data-testid="live-battle-competitor-2"] {
      background-image: url('${competitor2Image}') !important;
      background-size: cover;
      background-position: center;
    }
  `;
  
  // Append to head if it doesn't exist already
  if (!document.getElementById('competitor-profile-styles')) {
    document.head.appendChild(styleElement);
  }
};

export function InteractiveFeaturesWithProfiles() {
  // Inject the styles when the component mounts
  React.useEffect(() => {
    injectCompetitorStyles();
    return () => {
      // Clean up on unmount
      const styleElement = document.getElementById('competitor-profile-styles');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);
  
  // Return the base component with data attributes that will be targeted by our CSS
  return <BaseInteractiveFeatures />;
}
