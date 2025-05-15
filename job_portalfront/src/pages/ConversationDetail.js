import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ConversationDetail.css';
import NavbarEmployeur from './NavbarEmployeur';

const ConversationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [contenu, setContenu] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8000/api/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCurrentUserId(res.data.id);
      } catch (error) {
        console.error('Erreur utilisateur connecté', error);
      }
    };
    fetchUser();
  }, []);

  // Charger les messages et infos du contact
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8000/api/conversations/${id}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data.messages);
        setContactInfo(res.data.contact); // API doit renvoyer contact
        setLoading(false);
        scrollToBottom();
      } catch (error) {
        console.error('Erreur chargement messages', error);
        setLoading(false);
      }
    };
    fetchMessages();
  }, [id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!contenu.trim()) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/messages', {
        conversation_id: id,
        contenu
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContenu('');
      const res = await axios.get(`http://localhost:8000/api/conversations/${id}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.messages);
      scrollToBottom();
    } catch (error) {
      console.error('Erreur envoi message', error);
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const goToProfile = () => {
    if (contactInfo?.id) navigate(`/profil/${contactInfo.id}`);
  };

  return (
    <div className="conversation-detail-container">
      <main className='main-content'>
      <header className="conversation-header">
        <div className="back-button" onClick={() => navigate(-1)}>
          <span className="back-arrow">←</span>
        </div>

        {contactInfo && (
          <div className="contact-info" onClick={goToProfile} style={{ cursor: 'pointer' }}>
            <div className="contact-avatar">
              {contactInfo.avatar || contactInfo.name?.charAt(0).toUpperCase()}
            </div>
            <div className="contact-details">
              <h2>{contactInfo.name}</h2>
              <div className="contact-status">
                <span className="status-indicator"></span>
                <span>{contactInfo.status || 'en ligne'}</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Messages */}
      <div className="messages-container">
        {loading ? (
          <div className="loading-messages">
            <div className="loading-spinner"></div>
            <p>Chargement des messages...</p>
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg) => {
              const isMe = msg.user_id === currentUserId;
              return (
                <div key={msg.id} className={`message-row ${isMe ? 'left' : 'right'}`}>
                  {!isMe && <div className="message-avatar">{contactInfo?.avatar || 'C'}</div>}
                  <div className="message-bubble">
                    <div className="message-text">{msg.contenu}</div>
                    <div className="message-time">
                      {formatTime(msg.dateEnvoi)}
                      {isMe && <span className="message-status">✓✓</span>}
                    </div>
                  </div>
                  {isMe && <div className="message-avatar">ME</div>}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="message-input-container">
        <button className="input-action emoji-button"><span>😊</span></button>
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            placeholder="Écrire un message..."
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
        </div>
        {contenu.trim() ? (
          <button className="send-button" onClick={sendMessage}><span>➤</span></button>
        ) : (
          <>
            <button className="input-action attachment-button"><span>📎</span></button>
            <button className="input-action voice-button"><span>🎤</span></button>
          </>
        )}
      </div>
      </main>
    </div>
  );
};

export default ConversationDetail;
