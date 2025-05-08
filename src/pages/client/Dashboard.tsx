
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import { useToast } from '@/hooks/use-toast';

// Sample data - in a real app, this would come from the database
const mockInventoryData = {
  totalArtworks: 127,
  artists: 24,
  mediums: 8,
  recentlyAcquired: 12,
  lowStock: 5,
};

const ClientDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in and is a client
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
          <h1>Welcome, {user.name}</h1>
          <p className="text-gray-600">Client dashboard for art collection management</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <button 
            onClick={handleLogout}
            className="inventory-btn-secondary"
          >
            Logout
          </button>
          <Link 
            to="/client/inventory" 
            className="inventory-btn-primary"
          >
            View Inventory
          </Link>
          <Link 
            to="/client/support" 
            className="inventory-btn-secondary"
          >
            Support Chat
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total Artworks" 
          value={mockInventoryData.totalArtworks} 
          color="primary" 
        />
        <StatCard 
          title="Featured Artists" 
          value={mockInventoryData.artists} 
          color="secondary" 
        />
        <StatCard 
          title="Recently Acquired" 
          value={mockInventoryData.recentlyAcquired} 
          color="success" 
          change={{ value: 8, isPositive: true }}
        />
        <StatCard 
          title="Limited Availability" 
          value={mockInventoryData.lowStock} 
          color="warning" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="inventory-card">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start pb-3 border-b border-gray-200">
                <div className="flex-shrink-0 bg-inventory-secondary rounded-full p-2 mr-3">
                  <svg className="h-4 w-4 text-inventory-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Collection Update</p>
                  <p className="text-sm text-gray-600">
                    {i === 1 ? 'New Emily Chen artwork "Morning Light" added' :
                     i === 2 ? 'Three pieces from Michael Rivera acquired' :
                     i === 3 ? 'Last Sarah Johnson piece now limited availability' :
                     'Art collection report generated'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {i === 1 ? '2 hours ago' :
                     i === 2 ? 'Yesterday' :
                     i === 3 ? '3 days ago' :
                     'Last week'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="inventory-card">
          <h2 className="text-xl font-semibold mb-4">Inventory Status</h2>
          <div className="mb-6">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Gallery Space Utilization</span>
              <span className="text-sm font-medium">68%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-inventory-primary h-2.5 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>

          <h3 className="font-medium mb-3">Art Medium Breakdown</h3>
          <div className="space-y-3">
            {['Oil Paintings', 'Acrylics', 'Watercolors', 'Mixed Media', 'Digital Art'].map((category, i) => (
              <div key={category} className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  i === 0 ? 'bg-blue-500' :
                  i === 1 ? 'bg-green-500' :
                  i === 2 ? 'bg-amber-500' :
                  i === 3 ? 'bg-purple-500' :
                  'bg-red-500'
                }`}></div>
                <span className="flex-grow">{category}</span>
                <span className="font-medium">
                  {i === 0 ? '38%' :
                   i === 1 ? '25%' :
                   i === 2 ? '18%' :
                   i === 3 ? '12%' :
                   '7%'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClientDashboard;
