import React, { useState, useEffect, useRef, useCallback } from 'react';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: number;
}

const FormattedText: React.FC<{ text: string; sender: 'user' | 'agent' }> = ({ text, sender }) => {
  const getTextColorClass = () => (sender === 'user' ? '#ffffff' : '#1e293b');

  const processInline = (line: string) => {
    const boldRegex = /(\*\*.*?\*\*)/g;
    const parts = line.split(boldRegex);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong
            key={`bold-${i}`}
            style={{
              fontWeight: 'bold',
              color: getTextColorClass(),
            }}
          >
            {part.slice(2, -2)}
          </strong>
        );
      }
      return (
        <span key={i} style={{ color: getTextColorClass() }}>
          {part}
        </span>
      );
    });
  };

  const lines = text.split(/\r?\n/);

  return (
    <div style={{ lineHeight: '1.6' }}>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} style={{ height: '0.5rem' }} />;

        if (trimmed.startsWith('###')) {
          return (
            <div
              key={index}
              style={{
                fontSize: '0.875rem',
                fontWeight: 'bold',
                margin: '1rem 0 0.25rem 0',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: sender === 'user' ? '#f8fafc' : '#1e293b',
              }}
            >
              {processInline(trimmed.replace(/^###\s*/, ''))}
            </div>
          );
        }
        return (
          <div key={index} style={{ marginBottom: '0.5rem' }}>
            {processInline(line)}
          </div>
        );
      })}
    </div>
  );
};

export const ChatWidget: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ REST API ENDPOINT (No WebSocket!)
  const getApiUrl = () => {
    return import.meta.env.DEV 
      ? 'http://localhost:8080/chat' 
      : 'https://agentforce-backend-env.eba-gamrzbkh.us-east-1.elasticbeanstalk.com/chat';
  };

  // ✅ Send message via REST API
  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    try {
      console.log('🚀 Sending to Agentforce:', message);
      
      const response = await fetch(getApiUrl(), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📨 Agentforce reply:', data.reply);

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        text: data.reply || 'No response received',
        sender: 'agent',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, agentMsg]);
      setConnectionStatus('connected');

    } catch (error: any) {
      console.error('❌ REST Chat error:', error.message);
      
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        text: `Error: ${error.message}. Backend is live but check Salesforce credentials.`,
        sender: 'agent',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setConnectionStatus('error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Test connection on load
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔍 Testing REST connection...');
        const response = await fetch(getApiUrl().replace('/chat', ''), { method: 'GET' });
        if (response.ok) {
          console.log('✅ Backend LIVE:', await response.json());
          setConnectionStatus('connected');
        }
      } catch (error) {
        console.log('🔍 Backend check failed (normal on first load)');
      }
    };
    testConnection();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      text: input,
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    sendMessage(input);
    setInput('');
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return '#10b981';
      case 'connecting':
        return '#f59e0b';
      default:
        return '#ef4444';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 1000,
        width: '450px',
        height: '70vh',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
        border: '1px solid rgba(255,255,255,0.5)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '1.5rem',
          color: 'white',
          fontWeight: '700',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              background: getStatusColor(),
              borderRadius: '50%',
              boxShadow: `0 0 10px ${getStatusColor()}40`,
              animation: connectionStatus === 'connected' ? 'ping 2s infinite' : 'none',
            }}
          />
          <span style={{ fontSize: '1.25rem' }}>🤖 Agentforce AI</span>
          <span
            style={{
              fontSize: '0.75rem',
              opacity: 0.9,
              textTransform: 'uppercase',
              fontWeight: '600',
            }}
          >
            {connectionStatus === 'connected'
              ? 'Live'
              : connectionStatus === 'connecting'
              ? 'Ready'
              : 'Error'}
          </span>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: '1.5rem',
          overflowY: 'auto',
          background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: '#64748b',
              paddingTop: '4rem',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '0.5rem',
              }}
            >
              Welcome!
            </div>
            <div>Try: "Show me Article #123" or "What is Salesforce Agentforce?"</div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: '1.5rem',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: '1.25rem 1.5rem',
                  borderRadius: '20px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  background:
                    msg.sender === 'user'
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'rgba(255,255,255,0.9)',
                  color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                  marginLeft: msg.sender === 'user' ? '3rem' : '0',
                  marginRight: msg.sender === 'user' ? '0' : '3rem',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <FormattedText text={msg.text} sender={msg.sender} />
                <div
                  style={{
                    fontSize: '0.75rem',
                    opacity: 0.7,
                    marginTop: '0.5rem',
                    textAlign: msg.sender === 'user' ? 'right' : 'left',
                  }}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                padding: '1rem 1.5rem',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.9)',
                marginRight: '3rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#64748b',
                    borderRadius: '50%',
                    animation: 'bounce 1.5s infinite',
                  }}
                />
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#64748b',
                    borderRadius: '50%',
                    animation: 'bounce 1.5s infinite 0.2s',
                  }}
                />
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    background: '#64748b',
                    borderRadius: '50%',
                    animation: 'bounce 1.5s infinite 0.4s',
                  }}
                />
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  Agentforce typing...
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          padding: '1.5rem',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? 'Wait for reply...' : 'Ask Agentforce anything...'}
            style={{
              flex: 1,
              padding: '0.875rem 1.25rem',
              borderRadius: '24px',
              border: `2px solid ${connectionStatus === 'connected' ? '#e2e8f0' : '#f59e0b'}`,
              fontSize: '1rem',
              outline: 'none',
              background: '#ffffff',
              fontWeight: '500',
              opacity: isLoading ? 0.6 : 1,
            }}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            style={{
              padding: '0.875rem 2rem',
              background: isLoading 
                ? '#9ca3af' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '24px',
              border: 'none',
              fontWeight: '600',
              cursor: (!input.trim() || isLoading) ? 'not-allowed' : 'pointer',
              opacity: (!input.trim() || isLoading) ? 0.5 : 1,
            }}
          >
            Send →
          </button>
        </div>
      </form>
    </div>
  );
};
