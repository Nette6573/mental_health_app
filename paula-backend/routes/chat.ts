import { Hono } from 'hono';
import { AIService } from '../services/aiService';
import { ChatMemory } from '../db/chatMemory';
import { detectCrisis, CrisisResponse } from '../ai/crisisDetection';
import { paulaPrompt } from '../ai/paulaPrompt';

// Define environment bindings
interface Env {
  AI_GATEWAY_URL: string;
  OPENAI_API_KEY: string;
  CHAT_SESSIONS?: KVNamespace;
}

// Define message interface
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

// Define chat session interface
interface ChatSession {
  sessionId: string;
  userId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// Define request interfaces
interface SendMessageRequest {
  message: string;
  sessionId?: string;
  userId: string;
}

// Define response interfaces
interface SendMessageResponse {
  response: string;
  sessionId: string;
  crisisDetected: boolean;
  crisisResponse?: {
    message: string;
    resources: {
      name: string;
      contact: string;
      description: string;
    }[];
  };
  timestamp: string;
}

export const chatRouter = new Hono<{ Bindings: Env }>();

// Send a message and get AI response
chatRouter.post('/send', async (c) => {
  try {
    const body = await c.req.json<SendMessageRequest>();
    const { message, userId, sessionId } = body;

    if (!message || !userId) {
      return c.json({ error: 'Message and userId are required' }, 400);
    }

    // Check for crisis
    const crisisResult = detectCrisis(message);
    
    // Get or create chat session
    const chatMemory = new ChatMemory();
    const currentSessionId = sessionId || crypto.randomUUID();
    
    let chatSession = await chatMemory.getSession(currentSessionId, userId);
    
    if (!chatSession) {
      chatSession = {
        sessionId: currentSessionId,
        userId,
        messages: [{
          role: 'system',
          content: paulaPrompt,
          timestamp: new Date().toISOString()
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    
    chatSession.messages.push(userMessage);
    chatSession.updatedAt = new Date().toISOString();

    // Get AI response
    const aiService = new AIService(c.env.AI_GATEWAY_URL, c.env.OPENAI_API_KEY);
    const aiResponse = await aiService.getChatResponse(chatSession.messages);

    // Add assistant message
    const assistantMessage: Message = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString()
    };
    
    chatSession.messages.push(assistantMessage);

    // Save session
    await chatMemory.saveSession(chatSession);

    // Prepare response
    const response: SendMessageResponse = {
      response: aiResponse,
      sessionId: currentSessionId,
      crisisDetected: crisisResult.crisisDetected,
      timestamp: new Date().toISOString()
    };

    if (crisisResult.crisisDetected) {
      response.crisisResponse = {
        message: crisisResult.message || "I'm concerned about what you're sharing. Please reach out for help.",
        resources: crisisResult.resources || []
      };
    }

    return c.json(response);

  } catch (error) {
    console.error('Chat error:', error);
    return c.json({ error: 'Failed to process message' }, 500);
  }
});

// Get chat history for a session
chatRouter.get('/history/:sessionId', async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    const userId = c.req.query('userId');

    if (!userId) {
      return c.json({ error: 'userId is required' }, 400);
    }

    const chatMemory = new ChatMemory();
    const session = await chatMemory.getSession(sessionId, userId);

    if (!session) {
      return c.json({ error: 'Session not found' }, 404);
    }

    // Remove system message from response
    const messages = session.messages.filter(m => m.role !== 'system');
    
    return c.json({ sessionId, messages });

  } catch (error) {
    console.error('History error:', error);
    return c.json({ error: 'Failed to fetch history' }, 500);
  }
});

// Get all sessions for a user
chatRouter.get('/sessions/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const chatMemory = new ChatMemory();
    const sessions = await chatMemory.getUserSessions(userId);
    
    // Return simplified session list without full message history
    const sessionList = sessions.map(s => ({
      sessionId: s.sessionId,
      userId: s.userId,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      messageCount: s.messages.filter(m => m.role !== 'system').length
    }));
    
    return c.json({ sessions: sessionList });

  } catch (error) {
    console.error('Sessions error:', error);
    return c.json({ error: 'Failed to fetch sessions' }, 500);
  }
});

// Delete a session
chatRouter.delete('/session/:sessionId', async (c) => {
  try {
    const sessionId = c.req.param('sessionId');
    const userId = c.req.query('userId');

    if (!userId) {
      return c.json({ error: 'userId is required' }, 400);
    }

    const chatMemory = new ChatMemory();
    const deleted = await chatMemory.deleteSession(sessionId, userId);
    
    if (!deleted) {
      return c.json({ error: 'Session not found' }, 404);
    }
    
    return c.json({ message: 'Session deleted successfully' });

  } catch (error) {
    console.error('Delete error:', error);
    return c.json({ error: 'Failed to delete session' }, 500);
  }
});