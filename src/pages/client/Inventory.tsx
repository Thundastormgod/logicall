
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/hooks/use-toast';

// Sample data with reliable image sources that will work for the demo presentation
const mockInventoryItems = [
  { id: 1, name: 'Starry Night', description: 'Oil on Canvas, 30" x 36"', artist: 'Vincent van Gogh', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/300px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg', quantity: 3, status: 'In Stock', dateUpdated: '2023-04-15' },
  { id: 2, name: 'The Persistence of Memory', description: 'Oil on Canvas, 24" x 33"', artist: 'Salvador Dali', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/The_Persistence_of_Memory.jpg/300px-The_Persistence_of_Memory.jpg', quantity: 5, status: 'In Stock', dateUpdated: '2023-04-10' },
  { id: 3, name: 'Water Lilies', description: 'Oil on Canvas, 40" x 40"', artist: 'Claude Monet', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg/300px-Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg', quantity: 2, status: 'Low Stock', dateUpdated: '2023-04-05' },
  { id: 4, name: 'The Great Wave', description: 'Woodblock Print, 10" x 15"', artist: 'Hokusai', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/300px-Great_Wave_off_Kanagawa2.jpg', quantity: 4, status: 'In Stock', dateUpdated: '2023-04-03' },
  { id: 5, name: 'The Scream', description: 'Oil, Tempera & Pastel on Board, 36" x 29"', artist: 'Edvard Munch', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/250px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg', quantity: 1, status: 'Low Stock', dateUpdated: '2023-04-01' },
  { id: 6, name: 'Girl with a Pearl Earring', description: 'Oil on Canvas, 18" x 15"', artist: 'Johannes Vermeer', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/240px-1665_Girl_with_a_Pearl_Earring.jpg', quantity: 0, status: 'Out of Stock', dateUpdated: '2023-03-28' },
  { id: 7, name: 'The Birth of Venus', description: 'Tempera on Canvas, 68" x 110"', artist: 'Sandro Botticelli', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/300px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg', quantity: 2, status: 'In Stock', dateUpdated: '2023-03-25' },
];

const ClientInventory = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryItems, setInventoryItems] = useState(mockInventoryItems);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  
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

  // Filter inventory items based on search term
  const filteredItems = inventoryItems.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.artist.toLowerCase().includes(searchLower) ||
      item.status.toLowerCase().includes(searchLower)
    );
  });

  // Handle sorting
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Sort items
  const sortedItems = React.useMemo(() => {
    const sortableItems = [...filteredItems];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredItems, sortConfig]);

  // Get sort direction indicator
  const getSortDirectionIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

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
          <h1>Logicall Art Gallery</h1>
          <p className="text-gray-600">View and manage your stored artwork</p>
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

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-semibold">Logicall Art Collection</h2>
            <p className="text-gray-600 text-sm">Showing {filteredItems.length} of {inventoryItems.length} artworks</p>
          </div>
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search by artwork name, artist..."
              className="inventory-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end mb-4 space-x-4">
          <button 
            onClick={() => requestSort('name')} 
            className="text-sm text-gray-600 hover:text-inventory-primary flex items-center"
          >
            Sort by Name {getSortDirectionIndicator('name')}
          </button>
          <button 
            onClick={() => requestSort('artist')} 
            className="text-sm text-gray-600 hover:text-inventory-primary flex items-center"
          >
            Sort by Artist {getSortDirectionIndicator('artist')}
          </button>
          <button 
            onClick={() => requestSort('status')} 
            className="text-sm text-gray-600 hover:text-inventory-primary flex items-center"
          >
            Sort by Status {getSortDirectionIndicator('status')}
          </button>
        </div>

        {sortedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedItems.map((item) => (
              <div key={item.id} className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-200">
                <div className="relative aspect-square">
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                      item.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                      item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="p-5 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-1 text-gray-900">{item.name}</h3>
                  <p className="text-inventory-primary mb-2">by {item.artist}</p>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Quantity:</span> {item.quantity}
                    </div>
                    <div className="text-gray-500">
                      Updated: {item.dateUpdated}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No artwork found matching your search
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ClientInventory;
