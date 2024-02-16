import { useState, useEffect, useRef } from 'react';
import { UserRound, Bot } from 'lucide-react';
import axios from 'axios';
import './App.css';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Mock da mensagem inicial do bot ao montar o componente
    const initialBotMessage = {
      text:
        'Olá! Agradecemos por entrar em contato com o serviço de consignado do grupo AMP. Podemos te ajudar com isso. Para começar, informe seu nome para darmos início ao atendimento',
      type: 'system',
    };

    setMessages([initialBotMessage]);
  }, []);

  useEffect(() => {
    // Scroll automático quando novas mensagens são adicionadas
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { text: input, type: 'user' }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await axios.post('http://localhost:3000/', {
        message: input,
      });

      const botMessage = { text: response.data.response, type: 'system' };
      setMessages([...newMessages, botMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem para o chatbot', error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="container">
      <div className="header">Atendimento</div>
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.type === 'user' ? 'userChat' : 'systemChat'}`}
          >
            {message.type === 'user' ? (
              <div className="icon-container userIconContainer">
                <UserRound className='userIcon' />
              </div>
            ) : (
              <div className="icon-container botIconContainer">
                <Bot className='botIcon' />
              </div>
            )}
            <div
              className={`message-text ${message.type === 'user' ? 'userChat' : 'systemChat'}`}
            >
              <span>{message.text}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          className="input"
        />
        <button onClick={sendMessage} className="neon-button">
          Enviar
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <div>
      <Chatbot />
    </div>
  );
}

export default App;
