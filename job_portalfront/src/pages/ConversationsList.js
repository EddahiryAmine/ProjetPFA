
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Search, ChevronRight, Users, Bell, Clock } from 'lucide-react';
import './ConversationList.css';
import NavbarEmployeur from './NavbarEmployeur';

const ConversationsList = () => {
  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
  axios.get('http://localhost:8000/api/conversations/employeur', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }
  })
  .then(res => {
    setConversations(res.data);
    setLoading(false);
  })
  .catch(err => {
    console.error(err);
    setLoading(false);
  });
}, []);

   const filteredConversations = conversations.filter(conv => 
    conv.candidat.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRandomTime = () => {
    const hours = Math.floor(Math.random() * 12) + 1;
    const minutes = Math.floor(Math.random() * 60);
    const ampm = Math.random() > 0.5 ? 'AM' : 'PM';
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  };

  const getRandomMessage = () => {
    const messages = [
      "Bonjour, j'ai vu votre offre...",
      "Merci pour votre réponse !",
      "Pouvons-nous discuter de...",
      "Je suis disponible pour...",
      "J'ai bien reçu votre message"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  
    const handleNavigate = (path) => {
  navigate(path); 
};
  

  return (
    <div className="conversations-container">
  <NavbarEmployeur />

  <main className="main-content">
            <div className="search-container">
        <div className="search-input-wrapper">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher une conversation..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="conversations-section">
        <h2 className="section-title">Conversations approuvées</h2>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="empty-state">
            <MessageCircle className="empty-icon" />
            <p>Aucune conversation trouvée</p>
          </div>
        ) : (
          <ul className="conversation-list">
            {filteredConversations.map((conv) => (
              <li 
                key={conv.id} 
                className="conversation-item"
                onClick={() => navigate(`/messagerie/${conv.id}`)}

              >
                <div className="conversation-content">
                  <div className="avatar">
                    {conv.candidat.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="conversation-details">
                    <div className="conversation-header">
                      <h3 className="contact-name">{conv.candidat.user.name}</h3>
                      <span className="message-time">
                        <Clock className="time-icon" />
                        {getRandomTime()}
                      </span>
                    </div>
                    <p className="message-preview">{getRandomMessage()}</p>
                  </div>
                  <ChevronRight className="chevron-icon" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Floating Action Button */}
      <button className="fab">
        <MessageCircle className="fab-icon" />
      </button>
      </main>
    </div>
  );
};

export default ConversationsList;

