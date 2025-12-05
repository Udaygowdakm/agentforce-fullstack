// index.ts - TypeScript Safe Lambda Handler
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const config = {
  instanceUrl: process.env.instanceUrl!,
  clientId: process.env.clientId!,
  clientSecret: process.env.clientSecret!,
  agentId: process.env.agentId!
};

let accessToken: string | null = null;
let sessionId: string | null = null;

interface AuthResponse {
  access_token: string;
}

interface SessionResponse {
  id: string;
}

async function getAccessToken(): Promise<string> {
  if (accessToken) return accessToken;
  
  const response = await fetch(`${config.instanceUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: config.clientId,
      client_secret: config.clientSecret
    })
  });
  
  const data = await response.json() as AuthResponse;
  if (data.access_token) {
    accessToken = data.access_token;
    console.log('✅ Access token obtained');
    return accessToken;
  }
  
  throw new Error('Failed to get access token');
}

async function createSession(): Promise<string> {
  if (sessionId) return sessionId;
  
  const token = await getAccessToken();
  const response = await fetch(`${config.instanceUrl}/services/data/v61.0/agentforce/sessions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ agentId: config.agentId })
  });
  
  const data = await response.json() as SessionResponse;
  if (data.id) {
    sessionId = data.id;
    console.log('✅ Session created:', sessionId);
    return sessionId;
  }
  
  throw new Error('Failed to create session');
}

export const handler = async (event: any) => {
  try {
    console.log('📨 Received:', event.body);
    
    const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    const message = body?.message ?? "";
    
    if (!message.trim()) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "No message provided" }),
      };
    }

    // Auth + Session
    await createSession();
    
    // Send message to Agentforce
    const token = await getAccessToken();
    const response = await fetch(`${config.instanceUrl}/services/data/v61.0/agentforce/sessions/${sessionId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        input: message,
        agentId: config.agentId 
      })
    });
    
    const data = await response.json();
    const reply = (data as any).output || (data as any).message || 'Agentforce processed your request';
    
    console.log('✅ Agentforce reply:', reply);
    
    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST,OPTIONS"
      },
      body: JSON.stringify({ reply }),
    };
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
};
