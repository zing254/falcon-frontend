import React, { useState, useRef, useEffect } from 'react';
import { useWebSocket } from '../../services/websocket';

const RadioChannel: React.FC = () => {
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [status, setStatus] = useState('Ready');
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const { sendMessage, isConnected } = useWebSocket();

  const startTransmission = async () => {
    try {
      // Request audio access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      
      // Set up audio analysis
      const context = new AudioContext();
      audioContextRef.current = context;
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = context.createMediaStreamSource(stream);
      source.connect(analyser);
      
      // Signal server we're transmitting
      sendMessage(JSON.stringify({
        type: 'TRANSMIT',
        channel: 'ALPHA-OPS'
      }));
      
      setIsTransmitting(true);
      setStatus('Transmitting...');
      
      // Start audio analysis loop
      const data = new Uint8Array(analyser.frequencyBinCount);
      const updateAudioLevel = () => {
        if (!analyserRef.current || !audioContextRef.current) return;
        
        analyserRef.current.getByteFrequencyData(data);
        const volume = data.reduce((a, b) => a + b, 0) / data.length;
        setAudioLevel(volume / 255);
        
        if (isTransmitting) {
          requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setStatus('Microphone access denied');
    }
  };

  const stopTransmission = () => {
    // Stop audio stream
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop());
      audioStreamRef.current = null;
    }
    
    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    // Signal server we're done
    sendMessage(JSON.stringify({
      type: 'RELEASE',
      channel: 'ALPHA-OPS'
    }));
    
    setIsTransmitting(false);
    setStatus('Ready');
  };

  const handlePTT = (isPressed: boolean) => {
    if (!isConnected) return;
    
    if (isPressed) {
      startTransmission();
    } else {
      stopTransmission();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isTransmitting) {
        stopTransmission();
      }
    };
  }, []);

  return (
    <div className="radio-container">
      <div className="radio-header">
        <h2>RADIO CHANNEL: ALPHA-OPS</h2>
        <div className="radio-status">
          {isConnected ? (
            isTransmitting ? (
              <span className="status-transmitting">TRANSMITTING</span>
            ) : (
              <span className="status-ready">READY</span>
            )
          ) : (
            <span className="status-disconnected">DISCONNECTED</span>
          )}
        </div>
      </div>

      <div className="waveform-container">
        <div className="waveform">
          {Array(30).fill(0).map((_, i) => {
            const height = isTransmitting ? 
              `${Math.min(90, 10 + audioLevel * 100)}%` : 
              '5%';
            return (
              <div 
                key={i} 
                className="wave-bar"
                style={{ 
                  height,
                  backgroundColor: isTransmitting ? '#00ff9c' : '#444'
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="ptt-container">
        <button
          className={`ptt-button ${isTransmitting ? 'active' : ''}`}
          onMouseDown={() => handlePTT(true)}
          onMouseUp={() => handlePTT(false)}
          onMouseLeave={() => isTransmitting && handlePTT(false)}
          disabled={!isConnected}
        >
          {isTransmitting ? 'RELEASING' : 'HOLD TO TALK'}
        </button>
        <div className="status-text">{status}</div>
      </div>

      <div className="radio-footer">
        <div className="channel-info">
          <span>Channel: ALPHA-OPS</span>
          <span>Latency: 210ms</span>
        </div>
      </div>
    </div>
  );
};

export default RadioChannel;