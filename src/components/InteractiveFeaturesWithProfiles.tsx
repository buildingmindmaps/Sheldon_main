
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
    
    /* Override feature titles and descriptions based on data attributes */
    [data-feature-id="feature-1"] .feature-title {
      content: "Structured Thinking Practice";
    }
    [data-feature-id="feature-1"] .feature-description {
      content: "Transform how you approach problems with guided practice sessions and instant cognitive feedback.";
    }
    
    [data-feature-id="feature-2"] .feature-title {
      content: "Adaptive Difficulty";
    }
    [data-feature-id="feature-2"] .feature-description {
      content: "Your mental challenges evolve as you do-our system ensures you're always at the edge of your capabilities.";
    }
    
    [data-feature-id="feature-3"] .feature-title {
      content: "Live 1-v-1 Battles";
    }
    [data-feature-id="feature-3"] .feature-description {
      content: "Push your systems thinking beyond comfort zones with head-to-head challenges and immediate feedback.";
    }
    
    [data-feature-id="feature-4"] .feature-title {
      content: "Icon Playbooks";
    }
    [data-feature-id="feature-4"] .feature-description {
      content: "Master the mental models of visionaries with step-by-step breakdowns of their systems thinking approaches.";
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
