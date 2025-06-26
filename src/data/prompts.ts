// AI prompts for proposal generation and civic engagement

export const PROPOSAL_GENERATION_PROMPTS = {
  system: `You are CivicAI, an expert in civic governance and community engagement. Your role is to help communities create comprehensive, actionable civic proposals.

When generating proposals, ensure they:
- Address the specific problem clearly
- Provide practical, implementable solutions
- Consider budget implications and funding sources
- Include timeline and milestones
- Account for stakeholder interests
- Suggest success metrics
- Are written in clear, accessible language

Format your response as a structured proposal with clear sections.`,

  user: (problem: string, category: string, location?: string, urgency?: string) => 
    `Create a comprehensive civic proposal for the following:

Problem: ${problem}
Category: ${category}
${location ? `Location: ${location}` : ''}
${urgency ? `Urgency Level: ${urgency}` : ''}

Please structure the proposal with these sections:
1. Title (concise, action-oriented)
2. Executive Summary (2-3 sentences)
3. Problem Statement (detailed description)
4. Proposed Solution (specific actions and methodology)
5. Implementation Timeline (phases and milestones)
6. Budget Estimate (realistic cost breakdown)
7. Expected Outcomes (measurable benefits)
8. Stakeholder Impact (who benefits and how)
9. Success Metrics (how to measure success)
10. Risk Assessment (potential challenges and mitigation)

Make it practical, actionable, and suitable for ${location || 'a modern community'}.`
}

export const CATEGORY_SPECIFIC_PROMPTS = {
  transportation: {
    context: "Focus on mobility, accessibility, public transit, traffic management, and sustainable transportation options.",
    considerations: [
      "Traffic flow and congestion",
      "Public transportation accessibility",
      "Pedestrian and cyclist safety",
      "Environmental impact",
      "Economic feasibility",
      "Community connectivity"
    ]
  },
  
  infrastructure: {
    context: "Address physical infrastructure including utilities, buildings, roads, and digital infrastructure.",
    considerations: [
      "Public safety and accessibility",
      "Long-term maintenance costs",
      "Environmental sustainability",
      "Future growth planning",
      "Technology integration",
      "Community resilience"
    ]
  },
  
  environment: {
    context: "Focus on environmental protection, sustainability, climate action, and natural resource management.",
    considerations: [
      "Climate impact and adaptation",
      "Biodiversity and ecosystem health",
      "Waste management and circular economy",
      "Energy efficiency and renewable sources",
      "Community health and wellbeing",
      "Economic incentives for green practices"
    ]
  },
  
  governance: {
    context: "Address civic processes, transparency, citizen engagement, and administrative efficiency.",
    considerations: [
      "Democratic participation and inclusion",
      "Transparency and accountability",
      "Digital government services",
      "Community feedback mechanisms",
      "Policy effectiveness",
      "Institutional trust and legitimacy"
    ]
  },
  
  social: {
    context: "Focus on community wellbeing, social services, equity, and quality of life improvements.",
    considerations: [
      "Social equity and inclusion",
      "Community health and safety",
      "Education and skill development",
      "Cultural preservation and celebration",
      "Intergenerational needs",
      "Support for vulnerable populations"
    ]
  },
  
  economic: {
    context: "Address economic development, job creation, business support, and financial sustainability.",
    considerations: [
      "Local economic impact",
      "Job creation and skills matching",
      "Small business support",
      "Innovation and entrepreneurship",
      "Financial sustainability",
      "Economic equity and opportunity"
    ]
  }
}

export const URGENCY_MODIFIERS = {
  low: "This is a long-term planning initiative that can be implemented gradually over time.",
  medium: "This requires attention within the next 6-12 months to prevent escalation.",
  high: "This is an urgent issue requiring immediate action and rapid implementation.",
  critical: "This is a crisis situation requiring emergency response and immediate intervention."
}

export const LOCATION_CONTEXT = {
  island: "Consider island-specific challenges like resource limitations, transportation isolation, environmental vulnerability, and unique cultural factors.",
  coastal: "Address coastal-specific issues including sea-level rise, marine resources, tourism impact, and waterfront development.",
  urban: "Focus on urban density challenges, infrastructure capacity, diverse population needs, and metropolitan coordination.",
  rural: "Consider rural challenges like service accessibility, infrastructure gaps, economic diversification, and community connectivity.",
  mountain: "Address topographical challenges, seasonal accessibility, environmental conservation, and tourism management."
}

export const BUDGET_GUIDELINES = {
  micro: "Under $10,000 - Community-driven initiatives, volunteer coordination, minimal infrastructure",
  small: "$10,000 - $100,000 - Local improvements, equipment purchases, small-scale programs",
  medium: "$100,000 - $1,000,000 - Significant infrastructure, comprehensive programs, multi-stakeholder initiatives",
  large: "$1,000,000+ - Major infrastructure projects, transformative initiatives, multi-year programs"
}

export const SUCCESS_METRICS_TEMPLATES = {
  quantitative: [
    "Number of community members directly benefited",
    "Percentage improvement in target metrics",
    "Cost savings or revenue generated",
    "Timeline adherence and milestone completion",
    "Usage rates and adoption metrics"
  ],
  qualitative: [
    "Community satisfaction surveys",
    "Stakeholder feedback and testimonials",
    "Media coverage and public perception",
    "Expert assessments and peer reviews",
    "Long-term impact studies"
  ],
  environmental: [
    "Carbon footprint reduction",
    "Waste reduction or recycling rates",
    "Energy efficiency improvements",
    "Biodiversity impact measurements",
    "Air and water quality indicators"
  ],
  social: [
    "Community engagement levels",
    "Accessibility improvements",
    "Social equity indicators",
    "Public health outcomes",
    "Educational impact metrics"
  ]
}

export const generateContextualPrompt = (
  problem: string,
  category: keyof typeof CATEGORY_SPECIFIC_PROMPTS,
  location?: string,
  urgency?: keyof typeof URGENCY_MODIFIERS
) => {
  const categoryInfo = CATEGORY_SPECIFIC_PROMPTS[category]
  const urgencyInfo = urgency ? URGENCY_MODIFIERS[urgency] : ''
  
  return `${PROPOSAL_GENERATION_PROMPTS.user(problem, category, location, urgency)}

Additional Context:
- Category Focus: ${categoryInfo.context}
- Key Considerations: ${categoryInfo.considerations.join(', ')}
${urgencyInfo ? `- Urgency Context: ${urgencyInfo}` : ''}

Please ensure the proposal reflects these specific considerations and provides actionable solutions appropriate for the context.`
}

export default {
  PROPOSAL_GENERATION_PROMPTS,
  CATEGORY_SPECIFIC_PROMPTS,
  URGENCY_MODIFIERS,
  LOCATION_CONTEXT,
  BUDGET_GUIDELINES,
  SUCCESS_METRICS_TEMPLATES,
  generateContextualPrompt
}
