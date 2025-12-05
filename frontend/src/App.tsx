import React from 'react';
import { ChatWidget } from './components/ChatWidget';

const App: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgb(30,27,75) 0%, rgba(49,46,129,0.3) 50%, rgb(26,27,65) 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Elegant Animated Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.15,
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute', top: '5rem', left: '5rem',
          width: '18rem', height: '18rem',
          background: 'linear-gradient(45deg, rgb(139,92,246), rgb(236,72,153))',
          borderRadius: '50%',
          mixBlendMode: 'multiply',
          filter: 'blur(40px)',
          animation: 'blob 7s infinite'
        }} />
        <div style={{
          position: 'absolute', top: '10rem', right: '5rem',
          width: '18rem', height: '18rem',
          background: 'linear-gradient(45deg, rgb(245,158,11), rgb(249,115,22))',
          borderRadius: '50%',
          mixBlendMode: 'multiply',
          filter: 'blur(40px)',
          animation: 'blob2 7s infinite 2s'
        }} />
        <div style={{
          position: 'absolute', bottom: '-2rem', left: '10rem',
          width: '18rem', height: '18rem',
          background: 'linear-gradient(45deg, rgb(16,185,129), rgb(6,182,212))',
          borderRadius: '50%',
          mixBlendMode: 'multiply',
          filter: 'blur(40px)',
          animation: 'blob3 7s infinite 4s'
        }} />
      </div>

      {/* Header */}
      <header style={{
        marginBottom: '3rem',
        textAlign: 'center',
        zIndex: 10,
        position: 'relative'
      }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: '900',
          background: 'linear-gradient(45deg, #ffffff, rgb(192,132,252), rgb(147,197,253))',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1.5rem',
          textShadow: '0 25px 50px rgba(0,0,0,0.3)',
          animation: 'pulse 2s infinite'
        }}>
          Agentforce Service Agent
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: 'rgb(226,232,240)',
          maxWidth: '32rem',
          margin: '0 auto',
          backdropFilter: 'blur(20px)',
          background: 'rgba(255,255,255,0.15)',
          padding: '1rem 2rem',
          borderRadius: '24px',
          border: '1px solid rgba(255,255,255,0.25)',
          fontWeight: '700',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
        }}>
          Custom frontend connected to Salesforce Agent API via secure WebSocket proxy.
        </p>
      </header>

      {/* Main Content */}
      <main style={{
        width: '100%',
        maxWidth: '80rem',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '2rem',
        zIndex: 10,
        position: 'relative'
      }}>
        {/* STATUS CARD */}
        <div style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(20px)',
          padding: '2rem',
          borderRadius: '24px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          border: '1px solid rgba(255,255,255,0.25)',
          transition: 'all 0.5s ease',
          cursor: 'pointer'
        }} 
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 35px 80px rgba(139,92,246,0.3)';
          e.currentTarget.style.borderColor = 'rgba(139,92,246,0.5)';
        }} 
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.25)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '900',
            background: 'linear-gradient(45deg, #ffffff, rgb(196,181,253))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            textShadow: '0 25px 50px rgba(0,0,0,0.3)'
          }}>
            Status
          </h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
            padding: '1.5rem',
            background: 'rgba(255,255,255,0.12)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <span style={{ position: 'relative', display: 'flex' }}>
              <span style={{
                position: 'absolute',
                width: '2rem', height: '2rem',
                background: 'linear-gradient(45deg, rgb(52,211,153), rgb(6,182,212))',
                borderRadius: '50%',
                animation: 'ping 2s infinite',
                opacity: 0.8,
                boxShadow: '0 0 20px rgba(52,211,153,0.5)'
              }} />
              <span style={{
                position: 'relative',
                width: '2rem', height: '2rem',
                background: 'linear-gradient(45deg, rgb(5,150,105), rgb(8,145,178))',
                borderRadius: '50%',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                border: '4px solid rgba(52,211,153,0.4)'
              }} />
            </span>
            <div>
              <p style={{
                fontSize: '1.5rem',
                fontWeight: '900',
                color: 'rgb(52,211,153)',
                textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                margin: 0
              }}>
                System Operational
              </p>
              <p style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                color: 'rgba(255,255,255,0.9)',
                margin: 0
              }}>
                100% Uptime
              </p>
            </div>
          </div>
          <p style={{
            fontSize: '1.125rem',
            fontWeight: '700',
            color: 'rgb(226,232,240)',
            textShadow: '0 5px 15px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            lineHeight: '1.6'
          }}>
            Chat widget appears bottom-right. Click to interact with Agentforce AI.
          </p>
        </div>

        {/* FEATURES CARD */}
        <div style={{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(20px)',
          padding: '2rem',
          borderRadius: '24px',
          boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          border: '1px solid rgba(255,255,255,0.25)',
          transition: 'all 0.5s ease',
          cursor: 'pointer'
        }} 
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 35px 80px rgba(236,72,153,0.3)';
          e.currentTarget.style.borderColor = 'rgba(236,72,153,0.5)';
        }} 
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 25px 50px rgba(0,0,0,0.25)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '900',
            background: 'linear-gradient(45deg, #ffffff, rgb(249,115,22))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            textShadow: '0 25px 50px rgba(0,0,0,0.3)'
          }}>
            Features
          </h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: 'rgba(255,255,255,0.12)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
              marginBottom: '0.75rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            }}>
              <span style={{
                width: '1.25rem', height: '1.25rem',
                background: 'linear-gradient(45deg, rgb(52,211,153), rgb(6,182,212))',
                borderRadius: '50%',
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                animation: 'pulse 2s infinite'
              }} />
              <span style={{
                fontSize: '1.25rem',
                fontWeight: '900',
                color: 'white',
                textShadow: '0 10px 20px rgba(0,0,0,0.3)',
                flex: 1
              }}>
                Real-time Streaming API
              </span>
            </li>
            <li style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: 'rgba(255,255,255,0.12)',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
              marginBottom: '0.75rem',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.25)';
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            }}>
              <span style={{
                width: '1.25rem', height: '1.25rem',
                background: 'linear-gradient(45deg, rgb(99,102,241), rgb(139,92,246))',
                borderRadius: '50%',
                boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                animation: 'pulse 2s infinite'
              }} />
              <span style={{
                fontSize: '1.25rem',
                fontWeight: '900',
                color: 'white',
                textShadow: '0 10px 20px rgba(0,0,0,0.3)',
                flex: 1
              }}>
                WebSocket Connection
              </span>
            </li>
          </ul>
        </div>
      </main>

      {/* Floating ChatWidget - AUTOMATICALLY POSITIONED */}
      <ChatWidget />
    </div>
  );
};

export default App;
