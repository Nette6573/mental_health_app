export interface CrisisResponse {
  crisisDetected: boolean;
  message?: string;
  resources?: {
    name: string;
    contact: string;
    description: string;
  }[];
}

// Crisis keywords and patterns
const crisisPatterns = [
  // Suicide related
  /\b(kill myself|end my life|commit suicide|take my own life|suicidal|want to die)\b/i,
  // Self harm
  /\b(cut myself|hurt myself|self-?harm|harm myself)\b/i,
  // Severe distress
  /\b(can't go on|no reason to live|better off without me|everyone would be better off)\b/i,
  // Harm to others
  /\b(kill someone|hurt someone|harm someone|going to hurt)\b/i,
];

// Crisis resources
const crisisResources = [
  {
    name: "988 Suicide & Crisis Lifeline",
    contact: "Call or text 988",
    description: "24/7, free and confidential support for people in distress"
  },
  {
    name: "Crisis Text Line",
    contact: "Text HOME to 741741",
    description: "24/7 text-based crisis support"
  },
  {
    name: "Emergency Services",
    contact: "Call 911",
    description: "For immediate emergency assistance"
  }
];

export function detectCrisis(message: string): CrisisResponse {
  const crisisDetected = crisisPatterns.some(pattern => pattern.test(message));

  if (crisisDetected) {
    return {
      crisisDetected: true,
      message: "I'm very concerned about what you're sharing. Your safety is the most important thing right now. Please reach out to these crisis resources immediately:",
      resources: crisisResources
    };
  }

  return { crisisDetected: false };
}