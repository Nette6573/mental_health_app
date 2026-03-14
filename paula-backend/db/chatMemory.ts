interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

interface ChatSession {
  sessionId: string;
  userId: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export class ChatMemory {
  // Using Cloudflare KV for persistence (in production)
  // For now, using in-memory storage (development only)
  private sessions: Map<string, ChatSession> = new Map();

  async getSession(sessionId: string, userId: string): Promise<ChatSession | null> {
    const session = this.sessions.get(sessionId);
    
    // Verify ownership
    if (session && session.userId === userId) {
      return session;
    }
    
    return null;
  }

  async saveSession(session: ChatSession): Promise<void> {
    this.sessions.set(session.sessionId, session);
  }

  async getUserSessions(userId: string): Promise<ChatSession[]> {
    const userSessions: ChatSession[] = [];
    
    for (const session of this.sessions.values()) {
      if (session.userId === userId) {
        userSessions.push(session);
      }
    }
    
    // Sort by updatedAt descending (most recent first)
    return userSessions.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async deleteSession(sessionId: string, userId: string): Promise<boolean> {
    const session = await this.getSession(sessionId, userId);
    
    if (session) {
      return this.sessions.delete(sessionId);
    }
    
    return false;
  }

  // For production with Cloudflare KV
  async getSessionKV(env: any, sessionId: string, userId: string): Promise<ChatSession | null> {
    const session = await env.CHAT_SESSIONS.get(sessionId, 'json');
    
    if (session && session.userId === userId) {
      return session as ChatSession;
    }
    
    return null;
  }

  async saveSessionKV(env: any, session: ChatSession): Promise<void> {
    await env.CHAT_SESSIONS.put(session.sessionId, JSON.stringify(session));
  }
}