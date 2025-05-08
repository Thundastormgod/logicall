import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/hooks/use-toast';

// Mock support tickets data
const mockTickets = [
  {
    id: 1,
    subject: 'Need assistance with artwork pickup',
    description: 'I would like to schedule a pickup for three paintings next week. What are the available time slots?',
    status: 'open',
    priority: 'medium',
    client: 'Lumina Gallery',
    clientId: 1,
    createdAt: '2023-04-16T09:30:00',
    updatedAt: '2023-04-16T09:30:00',
    assignedTo: null,
    messages: [
      {
        id: 1,
        ticketId: 1,
        sender: 'client',
        senderName: 'Lumina Gallery',
        message: 'I would like to schedule a pickup for three paintings next week. What are the available time slots?',
        timestamp: '2023-04-16T09:30:00'
      }
    ]
  },
  {
    id: 2,
    subject: 'Damaged frame reported',
    description: 'One of our clients reported a damaged frame on "The Scream" painting. We need immediate assessment and repair options.',
    status: 'urgent',
    priority: 'high',
    client: 'Modern Art Foundation',
    clientId: 2,
    createdAt: '2023-04-15T14:22:00',
    updatedAt: '2023-04-15T16:45:00',
    assignedTo: 'Sarah',
    messages: [
      {
        id: 2,
        ticketId: 2,
        sender: 'client',
        senderName: 'Modern Art Foundation',
        message: 'One of our clients reported a damaged frame on "The Scream" painting. We need immediate assessment and repair options.',
        timestamp: '2023-04-15T14:22:00'
      },
      {
        id: 3,
        ticketId: 2,
        sender: 'staff',
        senderName: 'Sarah',
        message: 'I\'ve assigned our conservation specialist to assess the damage. We\'ll send someone tomorrow morning. Please provide more details about the damage if possible.',
        timestamp: '2023-04-15T16:45:00'
      }
    ]
  },
  {
    id: 3,
    subject: 'Billing question',
    description: 'I noticed a discrepancy in our last invoice. Can someone from accounting review this?',
    status: 'in-progress',
    priority: 'medium',
    client: 'Azure Collection',
    clientId: 3,
    createdAt: '2023-04-14T11:05:00',
    updatedAt: '2023-04-15T10:30:00',
    assignedTo: 'Michael',
    messages: [
      {
        id: 4,
        ticketId: 3,
        sender: 'client',
        senderName: 'Azure Collection',
        message: 'I noticed a discrepancy in our last invoice. Can someone from accounting review this?',
        timestamp: '2023-04-14T11:05:00'
      },
      {
        id: 5,
        ticketId: 3,
        sender: 'staff',
        senderName: 'Michael',
        message: 'I\'ll review this with accounting and get back to you. Could you please specify which line items seem incorrect?',
        timestamp: '2023-04-15T10:30:00'
      }
    ]
  },
  {
    id: 4,
    subject: 'New acquisition - special handling required',
    description: 'We\'re acquiring a delicate glass sculpture that will need specialized storage. Can you provide information on your handling protocols for fragile items?',
    status: 'open',
    priority: 'high',
    client: 'City Museum',
    clientId: 4,
    createdAt: '2023-04-13T16:40:00',
    updatedAt: '2023-04-13T16:40:00',
    assignedTo: null,
    messages: [
      {
        id: 6,
        ticketId: 4,
        sender: 'client',
        senderName: 'City Museum',
        message: 'We\'re acquiring a delicate glass sculpture that will need specialized storage. Can you provide information on your handling protocols for fragile items?',
        timestamp: '2023-04-13T16:40:00'
      }
    ]
  },
  {
    id: 5,
    subject: 'Exhibition loan request',
    description: 'We\'d like to borrow the Van Gogh from Lumina Gallery for an upcoming exhibition. Can you help coordinate this?',
    status: 'closed',
    priority: 'medium',
    client: 'Vista Exhibitions',
    clientId: 5,
    createdAt: '2023-04-10T13:15:00',
    updatedAt: '2023-04-12T15:20:00',
    assignedTo: 'Emily',
    messages: [
      {
        id: 7,
        ticketId: 5,
        sender: 'client',
        senderName: 'Vista Exhibitions',
        message: 'We\'d like to borrow the Van Gogh from Lumina Gallery for an upcoming exhibition. Can you help coordinate this?',
        timestamp: '2023-04-10T13:15:00'
      },
      {
        id: 8,
        ticketId: 5,
        sender: 'staff',
        senderName: 'Emily',
        message: 'I\'ve spoken with Lumina Gallery and they\'re open to the loan. I\'ll need exhibition dates, venue details, and your insurance coverage to proceed.',
        timestamp: '2023-04-11T09:45:00'
      },
      {
        id: 9,
        ticketId: 5,
        sender: 'client',
        senderName: 'Vista Exhibitions',
        message: 'Great! The exhibition runs from May 15 to July 30. I\'ve attached our venue specifications and insurance details for your review.',
        timestamp: '2023-04-11T14:20:00'
      },
      {
        id: 10,
        ticketId: 5,
        sender: 'staff',
        senderName: 'Emily',
        message: 'All documentation has been approved. We\'ll arrange transportation for May 10th. Please confirm this works for your team.',
        timestamp: '2023-04-12T11:30:00'
      },
      {
        id: 11,
        ticketId: 5,
        sender: 'client',
        senderName: 'Vista Exhibitions',
        message: 'May 10th works perfectly. Thank you for your assistance!',
        timestamp: '2023-04-12T15:20:00'
      }
    ]
  }
];

const StaffSupportTickets = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is logged in and is a staff member
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      toast({
        title: "Not authenticated",
        description: "Please log in to continue",
        variant: "destructive",
      });
      navigate('/staff/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.type !== 'staff') {
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
  
  const selectTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setReplyMessage('');
  };
  
  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus ? ticket.status === filterStatus : true;
    const matchesPriority = filterPriority ? ticket.priority === filterPriority : true;
    const matchesSearch = searchTerm ? 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.client.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    return matchesStatus && matchesPriority && matchesSearch;
  });
  
  const handleReply = () => {
    if (!replyMessage.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message before sending",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send to a database
    // For demo, we'll update the local state
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === selectedTicket.id) {
        const newMessage = {
          id: Math.max(...ticket.messages.map(m => m.id)) + 1,
          ticketId: ticket.id,
          sender: 'staff',
          senderName: user.name,
          message: replyMessage,
          timestamp: new Date().toISOString()
        };
        
        // If ticket was open, mark as in-progress
        const newStatus = ticket.status === 'open' ? 'in-progress' : ticket.status;
        
        return {
          ...ticket,
          messages: [...ticket.messages, newMessage],
          status: newStatus,
          assignedTo: ticket.assignedTo || user.name,
          updatedAt: new Date().toISOString()
        };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    setSelectedTicket(updatedTickets.find(t => t.id === selectedTicket.id));
    setReplyMessage('');
    
    toast({
      title: "Reply sent",
      description: "Your response has been sent to the client",
    });
  };
  
  const updateTicketStatus = (ticketId: number, newStatus: string) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    setSelectedTicket(updatedTickets.find(t => t.id === ticketId));
    
    toast({
      title: "Status updated",
      description: `Ticket status changed to ${newStatus}`,
    });
  };
  
  const updateTicketPriority = (ticketId: number, newPriority: string) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          priority: newPriority,
          updatedAt: new Date().toISOString()
        };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    setSelectedTicket(updatedTickets.find(t => t.id === ticketId));
    
    toast({
      title: "Priority updated",
      description: `Ticket priority changed to ${newPriority}`,
    });
  };
  
  const assignTicket = (ticketId: number) => {
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return {
          ...ticket,
          assignedTo: user.name,
          updatedAt: new Date().toISOString()
        };
      }
      return ticket;
    });
    
    setTickets(updatedTickets);
    setSelectedTicket(updatedTickets.find(t => t.id === ticketId));
    
    toast({
      title: "Ticket assigned",
      description: `Ticket has been assigned to you`,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
          <h1>Logicall Support Tickets</h1>
          <p className="text-gray-600">Manage client support requests and inquiries</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <button 
            onClick={() => navigate('/staff/dashboard')}
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
        {/* Tickets List */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search tickets..."
                className="inventory-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="inventory-input"
                  value={filterStatus || ''}
                  onChange={(e) => setFilterStatus(e.target.value || null)}
                >
                  <option value="">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="urgent">Urgent</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  className="inventory-input"
                  value={filterPriority || ''}
                  onChange={(e) => setFilterPriority(e.target.value || null)}
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Showing {filteredTickets.length} tickets</p>
              <button 
                onClick={() => {
                  setFilterStatus(null);
                  setFilterPriority(null);
                  setSearchTerm('');
                }}
                className="text-sm text-inventory-primary hover:underline"
              >
                Clear Filters
              </button>
            </div>
          </div>
          
          <div className="divide-y max-h-[calc(100vh-350px)] overflow-y-auto">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedTicket?.id === ticket.id ? 'bg-blue-50' : ''}`}
                  onClick={() => selectTicket(ticket)}
                >
                  <div className="flex justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate">{ticket.subject}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ticket.status === 'open' ? 'bg-blue-100 text-blue-800' :
                      ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                      ticket.status === 'urgent' ? 'bg-red-100 text-red-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {ticket.status === 'in-progress' ? 'In Progress' : 
                       ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1 truncate">{ticket.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{ticket.client}</span>
                    <span>{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No tickets match your search criteria
              </div>
            )}
          </div>
        </div>
        
        {/* Ticket Details */}
        <div className="lg:col-span-7 xl:col-span-8">
          {selectedTicket ? (
            <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{selectedTicket.subject}</h2>
                    <div className="flex space-x-4 mt-1">
                      <span className="text-sm text-gray-600">Client: <span className="font-medium">{selectedTicket.client}</span></span>
                      <span className="text-sm text-gray-600">Created: <span className="font-medium">{formatDate(selectedTicket.createdAt)}</span></span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative group">
                      <button className="inventory-btn-secondary text-sm py-1">
                        Set Status
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          <button 
                            onClick={() => updateTicketStatus(selectedTicket.id, 'open')} 
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Open
                          </button>
                          <button 
                            onClick={() => updateTicketStatus(selectedTicket.id, 'in-progress')} 
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            In Progress
                          </button>
                          <button 
                            onClick={() => updateTicketStatus(selectedTicket.id, 'urgent')} 
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Urgent
                          </button>
                          <button 
                            onClick={() => updateTicketStatus(selectedTicket.id, 'closed')} 
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Closed
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative group">
                      <button className="inventory-btn-secondary text-sm py-1">
                        Set Priority
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          <button 
                            onClick={() => updateTicketPriority(selectedTicket.id, 'low')} 
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Low
                          </button>
                          <button 
                            onClick={() => updateTicketPriority(selectedTicket.id, 'medium')} 
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Medium
                          </button>
                          <button 
                            onClick={() => updateTicketPriority(selectedTicket.id, 'high')} 
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            High
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {!selectedTicket.assignedTo && (
                      <button 
                        onClick={() => assignTicket(selectedTicket.id)}
                        className="inventory-btn-primary text-sm py-1"
                      >
                        Assign to Me
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <div className="bg-gray-200 rounded-full h-8 w-8 flex items-center justify-center">
                      <span className="text-gray-600 font-medium">{selectedTicket.client.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{selectedTicket.description}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between text-xs text-gray-500">
                    <span>Ticket #{selectedTicket.id}</span>
                    <div className="flex space-x-4">
                      <span>Priority: <span className={`${
                        selectedTicket.priority === 'high' ? 'text-red-600 font-medium' :
                        selectedTicket.priority === 'medium' ? 'text-yellow-600 font-medium' :
                        'text-green-600 font-medium'
                      }`}>
                        {selectedTicket.priority.charAt(0).toUpperCase() + selectedTicket.priority.slice(1)}
                      </span></span>
                      <span>Status: <span className={`${
                        selectedTicket.status === 'open' ? 'text-blue-600 font-medium' :
                        selectedTicket.status === 'in-progress' ? 'text-yellow-600 font-medium' :
                        selectedTicket.status === 'urgent' ? 'text-red-600 font-medium' :
                        'text-green-600 font-medium'
                      }`}>
                        {selectedTicket.status === 'in-progress' ? 'In Progress' : 
                        selectedTicket.status.charAt(0).toUpperCase() + selectedTicket.status.slice(1)}
                      </span></span>
                      <span>Assigned: <span className="font-medium">{selectedTicket.assignedTo || 'Unassigned'}</span></span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex-1 overflow-y-auto">
                <h3 className="font-medium text-gray-900 mb-4">Conversation</h3>
                <div className="space-y-6">
                  {selectedTicket.messages.map((message: any) => (
                    <div key={message.id} className="flex items-start space-x-3">
                      <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                        message.sender === 'staff' ? 'bg-inventory-primary text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        <span className="font-medium">{message.senderName.charAt(0)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-900">{message.senderName}</span>
                          <span className="text-xs text-gray-500">{formatDate(message.timestamp)}</span>
                        </div>
                        <p className="text-gray-700">{message.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedTicket.status !== 'closed' && (
                <div className="p-6 border-t">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reply</label>
                    <textarea 
                      rows={3} 
                      className="inventory-input" 
                      placeholder="Type your response here..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={handleReply}
                      className="inventory-btn-primary"
                    >
                      Send Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col items-center justify-center text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Ticket Selected</h3>
              <p className="text-gray-500 max-w-md">
                Select a ticket from the list to view details and respond to client inquiries.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StaffSupportTickets;
