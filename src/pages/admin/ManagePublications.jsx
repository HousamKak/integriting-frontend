// src/pages/admin/ManagePublications.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getPublications, 
  getCategories, 
  deletePublication 
} from '../../services/publicationService';
import { Button, Table, Input, Select, Card, Modal, LoadingSpinner } from '../../components/admin/ui';
import { useToast } from '../../components/admin/ui';
import '../../styles/pages/ManagePublications.scss';

const ManagePublications = () => {
  const [publications, setPublications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const { showToast } = useToast();

  // Fetch publications and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [publicationsData, categoriesData] = await Promise.all([
          getPublications(),
          getCategories()
        ]);
        
        // Ensure data is properly formatted as arrays
        const pubArray = Array.isArray(publicationsData) ? publicationsData : (publicationsData?.publications || publicationsData?.data || []);
        const catArray = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.categories || categoriesData?.data || []);
        
        setPublications(pubArray);
        setCategories(['All', ...catArray.map(cat => cat.name || cat)]);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load publications:', err);
        setError('Failed to load publications. Please try again later.');
        showToast('Failed to load publications', 'error');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle filter change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (publication) => {
    setSelectedPublication(publication);
    setDeleteModalOpen(true);
  };

  // Handle delete publication
  const handleDelete = async () => {
    try {
      await deletePublication(selectedPublication.id);
      setPublications(publications.filter(pub => pub.id !== selectedPublication.id));
      setDeleteModalOpen(false);
      setSelectedPublication(null);
      showToast('Publication deleted successfully', 'success');
    } catch (err) {
      console.error('Failed to delete publication:', err);
      showToast('Failed to delete publication', 'error');
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setSelectedPublication(null);
  };

  // Filter publications based on selected category and search query
  const filteredPublications = publications.filter(pub => {
    const matchesCategory = activeCategory === 'All' || pub.category === activeCategory;
    const matchesSearch = (pub.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (pub.summary || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  // Define table columns
  const columns = [
    { key: 'title', header: 'Title' },
    { key: 'category', header: 'Category' },
    { 
      key: 'published_date', 
      header: 'Published Date',
      render: (value) => new Date(value).toLocaleDateString()
    },
    { 
      key: 'file_size', 
      header: 'File Size',
      render: (value) => value ? `${(value / 1024).toFixed(0)} KB` : 'N/A'
    }
  ];

  const actions = [
    {
      label: 'Edit',
      variant: 'primary',
      onClick: (row) => window.location.href = `/admin/publications/${row.id}`
    },
    {
      label: 'Delete',
      variant: 'danger',
      onClick: (row) => handleDeleteConfirm(row)
    }
  ];

  if (loading) return <LoadingSpinner />;
  if (error) return <Card variant="error"><p>{error}</p></Card>;

  return (
    <div className="manage-publications">
      <Card>
        <div className="admin-header">
          <h1>Manage Publications</h1>
          <Link to="/admin/publications/new">
            <Button 
              variant="primary"
            >
              Add New Publication
            </Button>
          </Link>
        </div>

        <div className="admin-controls" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <Select
            label="Filter by category"
            value={activeCategory}
            onChange={(value) => handleCategoryChange(value)}
            options={categories.map(cat => ({ value: cat, label: cat }))}
          />

          <Input
            type="text"
            placeholder="Search publications..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {filteredPublications.length > 0 ? (
          <Table
            data={filteredPublications}
            columns={columns}
            actions={actions}
            pagination
          />
        ) : (
          <div className="admin-empty" style={{ textAlign: 'center', padding: '2rem' }}>
            <p>No publications found matching your criteria.</p>
            <Link to="/admin/publications/new">
              <Button 
                variant="primary"
                style={{ marginTop: '1rem' }}
              >
              Add Publication
            </Button>
            </Link>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={cancelDelete}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete "{selectedPublication?.title}"?</p>
        <p>This action cannot be undone.</p>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ManagePublications;
