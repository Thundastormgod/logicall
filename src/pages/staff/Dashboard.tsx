
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import StatCard from '@/components/dashboard/StatCard';
import { useToast } from '@/hooks/use-toast';

// Sample data - matching the actual artwork count in the inventory
const mockDashboardData = {
  totalArtworks: 9, // Updated to match the exact number of artworks in the inventory
  totalArtists: 9, // Updated to match the number of unique artists
  totalGalleries: 5, // Number of unique clients/galleries
  limitedAvailability: 3, // Number of artworks with low stock
  recentlyAcquired: 2, // Recent artworks
  clientBreakdown: [
    { id: 1, name: 'Lumina Gallery', itemCount: 2, type: 'Private Gallery' },
    { id: 2, name: 'Modern Art Foundation', itemCount: 2, type: 'Non-Profit' },
    { id: 3, name: 'Azure Collection', itemCount: 2, type: 'Private Collector' },
    { id: 4, name: 'City Museum', itemCount: 2, type: 'Public Institution' },
    { id: 5, name: 'Vista Exhibitions', itemCount: 1, type: 'Commercial Gallery' },
  ],
};

const StaffDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
          <h1>Staff Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <button 
            onClick={handleLogout}
            className="inventory-btn-secondary"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          title="Total Artworks" 
          value={mockDashboardData.totalArtworks} 
          color="primary" 
        />
        <StatCard 
          title="Featured Artists" 
          value={mockDashboardData.totalArtists} 
          color="secondary" 
        />
        <StatCard 
          title="Client Galleries" 
          value={mockDashboardData.totalGalleries} 
          color="secondary" 
        />
        <StatCard 
          title="Recently Acquired" 
          value={mockDashboardData.recentlyAcquired} 
          color="success" 
          change={{ value: 11, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 inventory-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Client Art Collections</h2>
            <Link to="/staff/clients" className="text-inventory-primary hover:underline text-sm">
              View All Clients
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artworks</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {mockDashboardData.clientBreakdown.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{client.name}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{client.type}</td>
                    <td className="py-4 px-4 text-sm text-gray-500">{client.itemCount}</td>
                    <td className="py-4 px-4 text-sm">
                      <Link to={`/staff/inventory?clientId=${client.id}`} className="text-inventory-primary hover:underline">
                        View Collection
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-center">
            <Link to="/staff/inventory" className="inventory-btn-primary text-sm">
              Manage All Art Collections
            </Link>
          </div>
        </div>

        <div className="lg:col-span-5 inventory-card">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          
          <div className="space-y-4">
            <Link to="/staff/inventory" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="bg-inventory-primary rounded-full p-2 mr-3">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Manage Art Collections</h3>
                  <p className="text-sm text-gray-600">Update artwork details and availability</p>
                </div>
              </div>
            </Link>
            
            <Link to="/staff/clients" className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="bg-inventory-secondary rounded-full p-2 mr-3">
                  <svg className="h-5 w-5 text-inventory-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Gallery & Collector Management</h3>
                  <p className="text-sm text-gray-600">View and manage client partnerships</p>
                </div>
              </div>
            </Link>

            <div className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center">
                <div className="bg-green-500 rounded-full p-2 mr-3">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Generate Reports</h3>
                  <p className="text-sm text-gray-600">Create collection analytics and artist reports</p>
                </div>
              </div>
            </div>

            <div className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center">
                <div className="bg-amber-500 rounded-full p-2 mr-3">
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Low Stock Alerts</h3>
                  <p className="text-sm text-gray-600">View items that need attention</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StaffDashboard;
