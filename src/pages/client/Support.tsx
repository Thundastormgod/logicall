import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/hooks/use-toast';

// Sample chatbot responses
const botResponses = {
  greeting: ["Hello! Welcome to Logicall support. How can I assist you today?"],
  artwork: ["Our team carefully handles all artwork with museum-grade protocols.", "Each piece is stored in climate-controlled environments to ensure preservation."],
  storage: ["Your artwork is stored in our secure, climate-controlled facility.", "We maintain optimal temperature and humidity levels to preserve your valuable pieces."],
  pickup: ["To schedule a pickup or delivery, please use the 'Request Service' button on your dashboard or contact your account manager."],
  delivery: ["We offer white-glove delivery services with specialized art handlers.", "All transportation is fully insured and uses vehicles designed for artwork."],
  insurance: ["All artwork stored with Logicall is covered by our comprehensive insurance policy.", "You can request additional coverage for high-value items."],
  contact: ["You can reach our support team at support@logicall.com or call us at (555) 123-4567.", "Our office hours are Monday to Friday, 9 AM to 5 PM."],
  hours: ["Our facility is open Monday through Friday from 9 AM to 5 PM.", "Weekend appointments are available by request."],
  fees: ["Storage fees are calculated based on the size and value of your collection.", "Please check your account dashboard for current billing information."],
  default: ["I'm not sure I understand. Could you please rephrase your question?", "If you need immediate assistance, please email support@logicall.com or call (555) 123-4567."]
};

// Function to get bot response based on user message
const getBotResponse = (message: string) => {
  const lowerCase = message.toLowerCase();
  
  if (lowerCase.includes('hello') || lowerCase.includes('hi') || lowerCase.includes('hey')) {
    return botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)];
  } else if (lowerCase.includes('artwork') || lowerCase.includes('art') || lowerCase.includes('piece')) {
    return botResponses.artwork[Math.floor(Math.random() * botResponses.artwork.length)];
  } else if (lowerCase.includes('store') || lowerCase.includes('storage')) {
    return botResponses.storage[Math.floor(Math.random() * botResponses.storage.length)];
  } else if (lowerCase.includes('pickup') || lowerCase.includes('pick up')) {
    return botResponses.pickup[Math.floor(Math.random() * botResponses.pickup.length)];
  } else if (lowerCase.includes('deliver') || lowerCase.includes('delivery')) {
    return botResponses.delivery[Math.floor(Math.random() * botResponses.delivery.length)];
  } else if (lowerCase.includes('insure') || lowerCase.includes('insurance')) {
    return botResponses.insurance[Math.floor(Math.random() * botResponses.insurance.length)];
  } else if (lowerCase.includes('contact') || lowerCase.includes('email') || lowerCase.includes('phone')) {
    return botResponses.contact[Math.floor(Math.random() * botResponses.contact.length)];
  } else if (lowerCase.includes('hour') || lowerCase.includes('time') || lowerCase.includes('open')) {
    return botResponses.hours[Math.floor(Math.random() * botResponses.hours.length)];
  } else if (lowerCase.includes('fee') || lowerCase.includes('cost') || lowerCase.includes('price')) {
    return botResponses.fees[Math.floor(Math.random() * botResponses.fees.length)];
  } else {
    return botResponses.default[Math.floor(Math.random() * botResponses.default.length)];
  }
};

// Message interface
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ClientSupport = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm the Logicall support assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [showHumanSupport, setShowHumanSupport] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      toast({
        title: "Not authenticated",
        description: "Please log in to continue",
        variant: "destructive",
      });
      navigate('/client/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.type !== 'client') {
      toast({
        title: "Access denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    setUser(parsedUser);
    setLoading(false);
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/');
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    // Simulate bot thinking
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: getBotResponse(message),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };
  
  const submitSupportTicket = () => {
    if (ticketSubject.trim() === '' || ticketDescription.trim() === '') {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send the ticket to a database
    // For now, we'll just show a success message
    toast({
      title: "Support ticket submitted",
      description: "A support agent will contact you soon",
    });
    
    setShowHumanSupport(false);
    setTicketSubject('');
    setTicketDescription('');
    
    // Add confirmation message to chat
    const confirmationMessage: Message = {
      id: messages.length + 1,
      text: `Your support ticket "${ticketSubject}" has been submitted. A support agent will contact you soon.`,
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, confirmationMessage]);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-inventory-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1>Logicall Support</h1>
          <p className="text-gray-600">Get help with your artwork storage and management</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <button 
            onClick={() => navigate('/client/dashboard')}
            className="inventory-btn-secondary"
          >
            Back to Dashboard
          </button>
          <button 
            onClick={handleLogout}
            className="inventory-btn-secondary"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Live Chat Support</h2>
            <button
              onClick={() => setShowHumanSupport(true)}
              className="inventory-btn-primary text-sm"
            >
              Request Human Support
            </button>
          </div>
          
          {/* Chat Messages */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4 h-96 overflow-y-auto">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <div 
                  className={`inline-block max-w-md p-3 rounded-lg ${
                    msg.sender === 'user' 
                      ? 'bg-inventory-primary text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${
                    msg.sender === 'user' 
                      ? 'text-blue-100' 
                      : 'text-gray-500'
                  }`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              placeholder="Type your message here..."
              className="inventory-input flex-grow"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button 
              type="submit"
              className="inventory-btn-primary"
            >
              Send
            </button>
          </form>
        </div>
        
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">Support Options</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-inventory-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>support@logicall.com</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-inventory-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-inventory-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Mon-Fri, 9am - 5pm</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-3">FAQ</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-inventory-primary">How is my artwork stored?</h4>
                <p className="text-sm text-gray-600">All artwork is stored in climate-controlled environments with 24/7 security monitoring.</p>
              </div>
              <div>
                <h4 className="font-medium text-inventory-primary">How do I schedule a pickup?</h4>
                <p className="text-sm text-gray-600">You can schedule pickups through your dashboard or by contacting your account manager.</p>
              </div>
              <div>
                <h4 className="font-medium text-inventory-primary">Is my artwork insured?</h4>
                <p className="text-sm text-gray-600">Yes, all stored artwork is covered by our comprehensive insurance policy.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Human Support Modal */}
      {showHumanSupport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Request Human Support</h3>
              <button onClick={() => setShowHumanSupport(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input 
                  type="text" 
                  className="inventory-input" 
                  placeholder="What is your inquiry about?"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  className="inventory-input" 
                  rows={4} 
                  placeholder="Please provide details about your issue or question"
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowHumanSupport(false)} 
                  className="inventory-btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={submitSupportTicket} 
                  className="inventory-btn-primary"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ClientSupport;
