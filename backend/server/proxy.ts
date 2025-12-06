import * as dotenv from 'dotenv';
import AgentApiClient from 'salesforce-agent-api-client';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';

dotenv.config();

interface AgentConfig {
  instanceUrl: string;
  clientId: string;
  clientSecret: string;
  agentId: string;
}

const config: AgentConfig = {
  instanceUrl: process.env.instanceUrl || '',
  clientId: process.env.clientId || '',
  clientSecret: process.env.clientSecret || '',
  agentId: process.env.agentId || ''
};

console.log('🔍 .env Config:');
console.log('  instanceUrl:', config.instanceUrl ? '✅' : '❌ MISSING');
console.log('  clientId:', config.clientId ? '✅' : '❌ MISSING');
console.log('  agentId:', config.agentId ? '✅' : '❌ MISSING');

const client = new AgentApiClient(config);

// HTTP SERVER + WebSocket (Network IP fix)
const httpServer = createServer();
const wss = new WebSocketServer({ 
  server: httpServer,
  verifyClient: (info: any) => {
    console.log('🔗 Browser origin:', info.origin);
    return true; // Allow all browsers
  }
});

httpServer.listen(8080, '0.0.0.0', () => {
  console.log('🚀 Agentforce Proxy LIVE on port 8080');
  console.log('🌐 Frontend: http://10.80.115.49:5173');
  console.log('🌐 WebSocket: ws://10.80.115.49:8080');
});

wss.on('connection', async (ws: WebSocket) => {
  console.log('👤 NEW CLIENT CONNECTED');
  
  let sessionId: string | null = null;
  let isSessionClosed = false;

  try {
    console.log('🔐 Salesforce Auth...');
    await client.authenticate();
    console.log('✅ Salesforce authenticated');
    
    console.log('🤖 Creating Agentforce session...');
    sessionId = await client.createSession();
    console.log(`✅ Session ID: ${sessionId}`);
    
    // Frontend expects { message: "text" }
    ws.send(JSON.stringify({
  message: '🤖 Connected to Salesforce Agentforce! Try: "Article #123"'
}));

  } catch (err: any) {
  console.error('❌ Salesforce ERROR:', err.message);
  ws.send(JSON.stringify({ 
    message: '❌ Failed to connect to Agentforce. Check .env credentials.'
  }));
  // ws.close();  // Keep connection alive
  return;
}

  const closeSessionHandler = async () => {
    if (!isSessionClosed && sessionId) {
      console.log(`🔒 Closing session ${sessionId}`);
      isSessionClosed = true;
      try {
        await client.closeSession(sessionId);
      } catch (e) {
        console.error('Close session error:', e);
      }
    }
  };

  ws.on('close', async () => {
    console.log('👋 Client disconnected');
    await closeSessionHandler();
  });

  type StreamEvent = { data: string; event: string };

  ws.on('message', async (message: Buffer) => {
    if (!sessionId) {
      console.log('⚠️ No session - ignoring');
      return;
    }

    const prompt = message.toString().trim();
    console.log(`\n💬 USER: "${prompt}"`);
    console.log(`📋 Session: ${sessionId}`);

    try {
      const streamEventHandler = ({ data, event }: StreamEvent) => {
        console.log(`📥 EVENT: ${event}`);
        console.log(`📥 RAW DATA: ${data.substring(0, 200)}...`);
        
        if (event === 'INFORM') {
          try {
            const parsedData = JSON.parse(data);
            console.log('📋 PARSED:', JSON.stringify(parsedData, null, 2));
            
            const textResponse = parsedData.message?.message;
            console.log(`🤖 AGENT REPLY: "${textResponse?.substring(0, 100)}..."`);

            if (textResponse && typeof textResponse === 'string') {
              // Frontend expects { message: "text" }
              ws.send(JSON.stringify({
                message: textResponse
              }));
              console.log('📤 SENT TO BROWSER');
            }
          } catch (parseErr) {
            console.error('❌ Parse error:', parseErr);
            console.log('RAW DATA (unparsed):', data);
          }
        } else if (event === 'END_OF_TURN') {
          console.log('✅ Agentforce finished');
        }
      };

      console.log('🚀 Sending to Agentforce...');
      await client.sendStreamingMessage(
        sessionId,
        prompt,
        [],
        streamEventHandler,
        () => console.log('📡 Stream ended')
      );

    } catch (error: any) {
      console.error('❌ Message error:', error.message);
      ws.send(JSON.stringify({
        message: `Error: ${error.message}`
      }));
    }
  });
});
