// Paula AI Core Logic (Cloudflare Workers)

type Env = {
  AI: any;
  PAULA_KV: KVNamespace;
};

// ------------------- CONSTANTS -------------------

const CRISIS_KEYWORDS = [
  "kill myself", "suicide", "want to die", "end my life",
  "self harm", "hurt myself", "no reason to live",
  "overdose", "hang myself"
];

const JAMAICAN_PARISHES = [
  "kingston", "st andrew", "st catherine", "clarendon",
  "manchester", "st elizabeth", "westmoreland",
  "hanover", "st james", "trelawny",
  "st ann", "st mary", "portland", "st thomas"
];

// ------------------- MAIN FUNCTION -------------------

export async function runPaulaAI(
  message: string,
  env: Env,
  sessionId?: string
): Promise<string> {

  // 🚨 Crisis detection FIRST
  if (isCrisis(message)) {
    return crisisResponse();
  }

  // 🧠 Load session context
  let context: any = null;

  if (sessionId) {
    const stored = await env.PAULA_KV.get(sessionId);
    if (stored) context = JSON.parse(stored);
  }

  // 🔁 Referral flow handling
  if (context?.stage === "awaiting_parish") {
    const parish = validateParish(message);

    if (parish) {
      await env.PAULA_KV.delete(sessionId!);
      return getProfessionalReferrals(parish);
    }

    return askForParish(2);
  }

  if (context?.stage === "offer_referral") {
    if (isPositiveResponse(message)) {
      await env.PAULA_KV.put(sessionId!, JSON.stringify({ stage: "awaiting_parish" }));
      return askForParish(1);
    } else {
      await env.PAULA_KV.delete(sessionId!);
    }
  }

  // 🔍 Direct referral request
  if (askingForReferral(message)) {
    if (sessionId) {
      await env.PAULA_KV.put(sessionId, JSON.stringify({ stage: "awaiting_parish" }));
    }
    return askForParish(1);
  }

  // 🤖 AI Response
  const aiResponse = await env.AI.run(
    "@cf/meta/llama-3-8b-instruct",
    {
      messages: [
        { role: "system", content: systemPrompt() },
        { role: "user", content: message }
      ]
    }
  );

  let reply = aiResponse.response || "I'm here for you. Tell me more.";

  // 📊 Behavioral indicators
  if (hasMultipleIndicators(message)) {
    if (sessionId) {
      await env.PAULA_KV.put(sessionId, JSON.stringify({ stage: "offer_referral" }));
    }

    reply += "\n\n" + gentleReferral();
  }

  return reply;
}

// ------------------- SYSTEM PROMPT -------------------

function systemPrompt(): string {
  return `
You are PAULA, a compassionate emotional support assistant for users in Jamaica.

Guidelines:
- Be warm, empathetic, and supportive
- Use clear, simple English
- DO NOT diagnose conditions
- Suggest healthy coping (talking, journaling, rest, prayer)
- Encourage professional help when needed
- In crisis, direct users to emergency help

Crisis Contacts:
- Emergency: 119
- Mental Health Helpline: 888-NEW-LIFE (639-5433)

Never provide harmful advice.
`;
}

// ------------------- CRISIS -------------------

function isCrisis(text: string): boolean {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some(k => lower.includes(k));
}

function crisisResponse(): string {
  return `🚨 I'm really concerned about you.

Please reach out immediately:
• Emergency Services: 119
• Jamaica Mental Health Helpline: 888-NEW-LIFE (639-5433)

You are not alone. There are people who want to help you right now.`;
}

// ------------------- REFERRALS -------------------

function askForParish(attempt = 1): string {
  if (attempt === 1) {
    return "To help you better, which parish are you located in? (e.g., Kingston, St. Andrew)";
  }

  return "Please tell me your parish so I can find support near you.";
}

function validateParish(text: string): string | null {
  const lower = text.toLowerCase();

  for (const parish of JAMAICAN_PARISHES) {
    if (lower.includes(parish)) {
      return parish.replace(/\b\w/g, c => c.toUpperCase());
    }
  }

  return null;
}

function isPositiveResponse(text: string): boolean {
  const positive = ["yes", "ok", "sure", "please", "help me"];
  const lower = text.toLowerCase();
  return positive.some(p => lower.includes(p));
}

function askingForReferral(text: string): boolean {
  const keywords = ["therapist", "psychologist", "counselor", "help near me"];
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

function getProfessionalReferrals(location: string): string {
  return `Here are some professionals near ${location}:

• Dr. Karen Brown (Kingston)
• Michael Thompson (Montego Bay)
• Dr. Patricia Williams (Kingston)

You can call and ask about their services.

Helpline: 888-NEW-LIFE (639-5433)`;
}

// ------------------- BEHAVIOR -------------------

function hasMultipleIndicators(text: string): boolean {
  const indicators = ["sad", "tired", "anxious", "hopeless", "can't sleep"];
  let count = 0;

  const lower = text.toLowerCase();

  indicators.forEach(i => {
    if (lower.includes(i)) count++;
  });

  return count >= 2;
}

function gentleReferral(): string {
  return "Many people find it helpful to speak with a professional. Would you like me to help you find one near you?";
}