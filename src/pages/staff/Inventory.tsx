import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/hooks/use-toast';

// Sample art data with reliable image sources that will work for the demo presentation
const mockArtData = [
  { id: 1, name: 'Starry Night', description: 'Oil on Canvas, 30" x 36"', artist: 'Vincent van Gogh', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/300px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg', quantity: 3, status: 'In Stock', clientId: 1, clientName: 'Lumina Gallery', dateUpdated: '2023-04-15' },
  { id: 2, name: 'The Persistence of Memory', description: 'Oil on Canvas, 24" x 33"', artist: 'Salvador Dali', imageUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/The_Persistence_of_Memory.jpg/300px-The_Persistence_of_Memory.jpg', quantity: 5, status: 'In Stock', clientId: 1, clientName: 'Lumina Gallery', dateUpdated: '2023-04-10' },
  { id: 3, name: 'Water Lilies', description: 'Oil on Canvas, 40" x 40"', artist: 'Claude Monet', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg/300px-Claude_Monet_-_Water_Lilies_-_1906%2C_Ryerson.jpg', quantity: 2, status: 'Low Stock', clientId: 2, clientName: 'Modern Art Foundation', dateUpdated: '2023-04-05' },
  { id: 4, name: 'The Great Wave', description: 'Woodblock Print, 10" x 15"', artist: 'Hokusai', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/300px-Great_Wave_off_Kanagawa2.jpg', quantity: 4, status: 'In Stock', clientId: 2, clientName: 'Modern Art Foundation', dateUpdated: '2023-04-03' },
  { id: 5, name: 'The Scream', description: 'Oil, Tempera & Pastel on Board, 36" x 29"', artist: 'Edvard Munch', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/250px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg', quantity: 1, status: 'Low Stock', clientId: 3, clientName: 'Azure Collection', dateUpdated: '2023-04-01' },
  { id: 6, name: 'Girl with a Pearl Earring', description: 'Oil on Canvas, 18" x 15"', artist: 'Johannes Vermeer', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/240px-1665_Girl_with_a_Pearl_Earring.jpg', quantity: 0, status: 'Out of Stock', clientId: 3, clientName: 'Azure Collection', dateUpdated: '2023-03-28' },
  { id: 7, name: 'The Birth of Venus', description: 'Tempera on Canvas, 68" x 110"', artist: 'Sandro Botticelli', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/300px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg', quantity: 2, status: 'In Stock', clientId: 4, clientName: 'City Museum', dateUpdated: '2023-03-25' },
  { id: 8, name: 'Nighthawks', description: 'Oil on Canvas, 33" x 60"', artist: 'Edward Hopper', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nighthawks_by_Edward_Hopper_1942.jpg/300px-Nighthawks_by_Edward_Hopper_1942.jpg', quantity: 6, status: 'In Stock', clientId: 4, clientName: 'City Museum', dateUpdated: '2023-03-20' },
  { id: 9, name: 'The Kiss', description: 'Oil on Canvas, 71" x 71"', artist: 'Gustav Klimt', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/240px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg', quantity: 1, status: 'Low Stock', clientId: 5, clientName: 'Vista Exhibitions', dateUpdated: '2023-03-15' },
];

const StaffInventory = () => {
  const [artworks, setArtworks] = useState(mockArtData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>(null);
  const [selectedArtworks, setSelectedArtworks] = useState<number[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentArtwork, setCurrentArtwork] = useState<any>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get unique clients for filter
  const clients = [...new Set(artworks.map(item => item.clientName))];
  
  // Get unique artists for filter
  const artists = [...new Set(artworks.map(item => item.artist))];
  
  // Filter artworks based on search term and filters
  const filteredItems = artworks.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      item.name.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.artist.toLowerCase().includes(searchLower) ||
      item.clientName.toLowerCase().includes(searchLower);
    
    const matchesClient = selectedClient ? item.clientName === selectedClient : true;
    const matchesArtist = selectedArtist ? item.artist === selectedArtist : true;
    
    return matchesSearch && matchesClient && matchesArtist;
  });
  
  // Handle sorting
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  // Get sort direction indicator
  const getSortDirectionIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
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
  
  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedClient(null);
    setSelectedArtist(null);
  };
  
  // Handle selection of an artwork
  const toggleArtworkSelection = (artworkId: number) => {
    setSelectedArtworks(prev => {
      if (prev.includes(artworkId)) {
        return prev.filter(id => id !== artworkId);
      } else {
        return [...prev, artworkId];
      }
    });
  };
  
  // Handle selection of all artworks
  const toggleSelectAll = () => {
    if (selectedArtworks.length === sortedItems.length) {
      setSelectedArtworks([]);
    } else {
      setSelectedArtworks(sortedItems.map(item => item.id));
    }
  };
  
  // Handle edit button click
  const handleEdit = (artwork: any) => {
    setCurrentArtwork(artwork);
    setShowEditModal(true);
  };
  
  // Handle delete button click
  const handleDelete = (artwork: any) => {
    setCurrentArtwork(artwork);
    setShowDeleteModal(true);
  };
  
  // Handle add new artwork
  const handleAddNew = () => {
    setShowAddModal(true);
  };
  
  // Handle saving edited artwork
  const handleSaveEdit = () => {
    // In a real application, this would update the database
    // For demo purposes, we'll just update the local state
    toast({
      title: "Artwork Updated",
      description: `${currentArtwork.name} has been updated successfully.`,
    });
    setShowEditModal(false);
  };
  
  // Handle saving new artwork
  const handleSaveNew = () => {
    // In a real application, this would add to the database
    // For demo purposes, just show a toast
    toast({
      title: "Artwork Added",
      description: "New artwork has been added to the inventory.",
    });
    setShowAddModal(false);
  };
  
  // Handle confirming delete
  const handleConfirmDelete = () => {
    // In a real application, this would delete from the database
    // For demo purposes, we'll remove from local state
    setArtworks(prev => prev.filter(art => art.id !== currentArtwork.id));
    toast({
      title: "Artwork Deleted",
      description: `${currentArtwork.name} has been removed from inventory.`,
    });
    setShowDeleteModal(false);
    setSelectedArtworks(prev => prev.filter(id => id !== currentArtwork.id));
  };
  
  // Handle bulk delete
  const handleBulkDelete = () => {
    // In a real application, this would delete from the database
    // For demo purposes, we'll remove from local state
    setArtworks(prev => prev.filter(art => !selectedArtworks.includes(art.id)));
    toast({
      title: "Multiple Artworks Deleted",
      description: `${selectedArtworks.length} artworks have been removed from inventory.`,
    });
    setSelectedArtworks([]);
  };
  
  // Handle updating status
  const handleStatusUpdate = (artwork: any, newStatus: string) => {
    // In a real application, this would update the database
    // For demo purposes, we'll update local state
    setArtworks(prev => 
      prev.map(art => 
        art.id === artwork.id ? {...art, status: newStatus} : art
      )
    );
    toast({
      title: "Status Updated",
      description: `${artwork.name} is now ${newStatus}.`,
    });
  };
  
  // Handle bulk status update
  const handleBulkStatusUpdate = (newStatus: string) => {
    // In a real application, this would update the database
    // For demo purposes, we'll update local state
    setArtworks(prev => 
      prev.map(art => 
        selectedArtworks.includes(art.id) ? {...art, status: newStatus} : art
      )
    );
    toast({
      title: "Status Updated",
      description: `${selectedArtworks.length} artworks are now ${newStatus}.`,
    });
  };

  return (
    <MainLayout>
      {/* Add Artwork Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Artwork</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Artwork Name</label>
                <input type="text" className="inventory-input" placeholder="Enter artwork name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                <input type="text" className="inventory-input" placeholder="Enter artist name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="inventory-input" rows={3} placeholder="Enter description"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client/Gallery</label>
                  <select className="inventory-input">
                    {clients.map(client => (
                      <option key={client} value={client}>{client}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="inventory-input">
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input type="number" className="inventory-input" placeholder="Enter quantity" min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input type="text" className="inventory-input" placeholder="Enter image URL" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="inventory-btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleSaveNew} 
                  className="inventory-btn-primary"
                >
                  Add Artwork
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Artwork Modal */}
      {showEditModal && currentArtwork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Edit Artwork</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Artwork Name</label>
                <input type="text" className="inventory-input" defaultValue={currentArtwork.name} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Artist</label>
                <input type="text" className="inventory-input" defaultValue={currentArtwork.artist} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="inventory-input" rows={3} defaultValue={currentArtwork.description}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client/Gallery</label>
                  <select className="inventory-input" defaultValue={currentArtwork.clientName}>
                    {clients.map(client => (
                      <option key={client} value={client}>{client}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="inventory-input" defaultValue={currentArtwork.status}>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input type="number" className="inventory-input" defaultValue={currentArtwork.quantity} min="0" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input type="text" className="inventory-input" defaultValue={currentArtwork.imageUrl} />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)} 
                  className="inventory-btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleSaveEdit} 
                  className="inventory-btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && currentArtwork && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="mb-4">
              <div className="flex items-center justify-center mb-4 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Delete Artwork</h3>
              <p className="text-center text-gray-600">Are you sure you want to delete <span className="font-semibold">{currentArtwork.name}</span>? This action cannot be undone.</p>
            </div>
            <div className="flex justify-center space-x-3 pt-4">
              <button 
                type="button" 
                onClick={() => setShowDeleteModal(false)} 
                className="inventory-btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleConfirmDelete} 
                className="inventory-btn-destructive"
              >
                Delete Artwork
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1>Logicall Art Management System</h1>
          <p className="text-gray-600">Manage all artwork in the warehouse</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <button 
            onClick={() => navigate('/staff/dashboard')}
            className="inventory-btn-secondary"
          >
            Back to Dashboard
          </button>
          <button 
            onClick={handleAddNew}
            className="inventory-btn-primary flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Artwork
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-semibold">Logicall Art Management</h2>
            <p className="text-gray-600 text-sm">Showing {filteredItems.length} of {artworks.length} artworks</p>
          </div>
          <div className="w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search by artwork name, artist, client..."
              className="inventory-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Bulk Actions Bar - Only visible when artworks are selected */}
        {selectedArtworks.length > 0 && (
          <div className="mb-6 bg-inventory-primary/10 border border-inventory-primary/30 p-3 rounded-md flex flex-wrap justify-between items-center">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                checked={selectedArtworks.length === sortedItems.length} 
                onChange={toggleSelectAll}
                className="mr-2 h-4 w-4 text-inventory-primary"
              />
              <span className="text-sm font-medium">{selectedArtworks.length} artwork{selectedArtworks.length !== 1 ? 's' : ''} selected</span>
            </div>
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <div className="relative group">
                <button className="inventory-btn-secondary text-sm py-1">
                  Set Status
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button onClick={() => handleBulkStatusUpdate('In Stock')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Set to In Stock</button>
                    <button onClick={() => handleBulkStatusUpdate('Low Stock')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Set to Low Stock</button>
                    <button onClick={() => handleBulkStatusUpdate('Out of Stock')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Set to Out of Stock</button>
                  </div>
                </div>
              </div>
              <button onClick={() => handleBulkDelete()} className="inventory-btn-destructive text-sm py-1">
                Delete Selected
              </button>
              <button onClick={() => setSelectedArtworks([])} className="inventory-btn-secondary text-sm py-1">
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Client</label>
            <select
              className="inventory-input"
              value={selectedClient || ''}
              onChange={(e) => setSelectedClient(e.target.value || null)}
            >
              <option value="">All Clients</option>
              {clients.map((client) => (
                <option key={client} value={client}>{client}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Artist</label>
            <select
              className="inventory-input"
              value={selectedArtist || ''}
              onChange={(e) => setSelectedArtist(e.target.value || null)}
            >
              <option value="">All Artists</option>
              {artists.map((artist) => (
                <option key={artist} value={artist}>{artist}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={clearAllFilters}
              className="inventory-btn-secondary w-full"
            >
              Clear Filters
            </button>
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
            onClick={() => requestSort('clientName')} 
            className="text-sm text-gray-600 hover:text-inventory-primary flex items-center"
          >
            Sort by Client {getSortDirectionIndicator('clientName')}
          </button>
        </div>

        {sortedItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedItems.map((item) => (
              <div key={item.id} className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-200">
                <div className="relative aspect-square">
                  {/* Selection checkbox */}
                  <div className="absolute top-3 left-3 z-10 flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      checked={selectedArtworks.includes(item.id)}
                      onChange={() => toggleArtworkSelection(item.id)}
                      className="h-4 w-4 text-inventory-primary rounded"
                    />
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.clientName}
                    </span>
                  </div>
                  
                  {/* Status badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <div className="relative group">
                      <button className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                        item.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                        item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div className="hidden group-hover:block absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                        <div className="py-1">
                          <button onClick={() => handleStatusUpdate(item, 'In Stock')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Set to In Stock</button>
                          <button onClick={() => handleStatusUpdate(item, 'Low Stock')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Set to Low Stock</button>
                          <button onClick={() => handleStatusUpdate(item, 'Out of Stock')} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Set to Out of Stock</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <img 
                    src={item.imageUrl} 
                    alt={item.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1 text-gray-900">{item.name}</h3>
                  <p className="text-inventory-primary mb-2">by {item.artist}</p>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Qty:</span> {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Updated:</span> {item.dateUpdated}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-2 text-inventory-primary hover:bg-inventory-primary/10 rounded-md"
                        title="Edit artwork"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(item)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                        title="Delete artwork"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No artworks match your search criteria.</p>
            <button 
              onClick={clearAllFilters}
              className="mt-4 inventory-btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default StaffInventory;
