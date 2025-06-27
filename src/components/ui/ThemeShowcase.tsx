'use client'

import { Button } from './Button'
import { Card } from './Card'

export default function ThemeShowcase() {
  return (
    <div className="space-y-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-logo-primary via-logo-accent to-logo-secondary bg-clip-text text-transparent">
          🎨 CivicAI Theme Showcase
        </h1>
        <p className="text-text-secondary text-lg">
          Logo-harmonized professional design
        </p>
      </div>

      {/* Logo Section */}
      <Card variant="glow" className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-logo-accent">Logo Integration</h2>
        <div className="flex justify-center items-center space-x-4">
          <div className="logo-container p-2 rounded-lg">
            <img 
              src="/images/logo.svg" 
              alt="CivicAI Logo" 
              className="w-16 h-16 logo-glow"
            />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-logo-primary via-logo-accent to-logo-secondary bg-clip-text text-transparent">
            CivicAI
          </span>
        </div>
      </Card>

      {/* Button Variants */}
      <Card variant="elevated" className="p-6">
        <h3 className="text-xl font-bold mb-4 text-logo-primary">Button Variants</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="glow">Glow</Button>
        </div>
      </Card>

      {/* Card Variants */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card variant="default" className="p-6">
          <h4 className="font-bold text-logo-primary mb-2">Default Card</h4>
          <p className="text-text-secondary">Standard card with gradient background</p>
        </Card>
        
        <Card variant="elevated" className="p-6">
          <h4 className="font-bold text-logo-accent mb-2">Elevated Card</h4>
          <p className="text-text-secondary">Enhanced shadow and elevation</p>
        </Card>
        
        <Card variant="outlined" className="p-6">
          <h4 className="font-bold text-logo-secondary mb-2">Outlined Card</h4>
          <p className="text-text-secondary">Logo accent border with glow</p>
        </Card>
        
        <Card variant="glow" className="p-6">
          <h4 className="font-bold text-logo-accent mb-2">Glow Card</h4>
          <p className="text-text-secondary">Animated glow effect</p>
        </Card>
        
        <Card variant="gradient" className="p-6">
          <h4 className="font-bold mb-2">Gradient Card</h4>
          <p className="opacity-90">Logo-based gradient background</p>
        </Card>
        
        <Card variant="default" hover className="p-6">
          <h4 className="font-bold text-accent-gold mb-2">Hover Card</h4>
          <p className="text-text-secondary">Hover me for effects!</p>
        </Card>
      </div>

      {/* Color Palette */}
      <Card variant="elevated" className="p-6">
        <h3 className="text-xl font-bold mb-4 text-logo-accent">Logo-Adaptive Color Palette</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-logo-primary rounded-lg mx-auto mb-2"></div>
            <p className="text-sm text-text-secondary">Primary</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-logo-secondary rounded-lg mx-auto mb-2"></div>
            <p className="text-sm text-text-secondary">Secondary</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-logo-accent rounded-lg mx-auto mb-2"></div>
            <p className="text-sm text-text-secondary">Accent</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent-electric rounded-lg mx-auto mb-2"></div>
            <p className="text-sm text-text-secondary">Electric</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent-purple rounded-lg mx-auto mb-2"></div>
            <p className="text-sm text-text-secondary">Purple</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent-gold rounded-lg mx-auto mb-2"></div>
            <p className="text-sm text-text-secondary">Gold</p>
          </div>
        </div>
      </Card>

      {/* Animations */}
      <Card variant="outlined" className="p-6">
        <h3 className="text-xl font-bold mb-4 text-logo-accent">Animations</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="animate-float bg-logo-primary w-8 h-8 rounded-full"></div>
          <div className="animate-glow bg-logo-accent w-8 h-8 rounded-full"></div>
          <div className="animate-pulse bg-logo-secondary w-8 h-8 rounded-full"></div>
          <div className="animate-bounce bg-accent-orange w-8 h-8 rounded-full"></div>
        </div>
      </Card>
    </div>
  )
}
