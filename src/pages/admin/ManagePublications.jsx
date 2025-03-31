// src/pages/admin/ManagePublications.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getPublications, 
  getCategories, 
  deletePublication 
} from '../../services/publicationService';
import Button from '../../components/common/Button';
import '../../styles/pages/ManagePublications.scss';

const ManagePublications = () => {
  const [publications, setPublications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch publications and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [publicationsData, categoriesData] = await Promise.all([
          getPublications(),
          getCategories()
        ]);
        
        setPublications(publicationsData);
        setCategories(['All', ...categoriesData.map(cat => cat.name)]);
        setLoading(false);
      } catch (err) {
        setError('Failed to load publications. Please try again later.');
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
  const handleDeleteConfirm = (id) => {
    setDeleteConfirm(id);
  };

  // Handle delete publication
  const handleDelete = async (id) => {
    try {
      await deletePublication(id);
      setPublications(publications.filter(pub => pub.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete publication. Please try again later.');
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Filter publications based on selected category and search query
  const filteredPublications = publications.filter(pub => {
    const matchesCategory = activeCategory === 'All' || pub.category === activeCategory;
    const matchesSearch = pub.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pub.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  if (loading) return <div className="admin-loading">Loading publications...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="manage-publications">
      <div className="admin-header">
        <h1>Manage Publications</h1>
        <Button to="/admin/publications/new" variant="accent">Add New Publication</Button>
      </div>

      <div className="admin-controls">
        <div className="admin-filter">
          <label htmlFor="categoryFilter">Filter by category:</label>
          <select 
            id="categoryFilter" 
            value={activeCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="admin-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="admin-search">
          <input
            type="text"
            placeholder="Search publications..."
            value={searchQuery}
            onChange={handleSearch}
            className="admin-search-input"
          />
        </div>
      </div>

      {filteredPublications.length > 0 ? (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Published Date</th>
                <th>File Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPublications.map(publication => (
                <tr key={publication.id}>
                  <td>{publication.title}</td>
                  <td>{publication.category}</td>
                  <td>{new Date(publication.published_date).toLocaleDateString()}</td>
                  <td>{(publication.file_size / 1024).toFixed(0)} KB</td>
                  <td className="admin-actions">
                    <Link 
                      to={`/admin/publications/${publication.id}`} 
                      className="admin-btn admin-btn-edit"
                    >
                      Edit
                    </Link>
                    {deleteConfirm === publication.id ? (
                      <div className="admin-confirm-delete">
                        <span>Are you sure?</span>
                        <button 
                          onClick={() => handleDelete(publication.id)}
                          className="admin-btn admin-btn-confirm"
                        >
                          Yes
                        </button>
                        <button 
                          onClick={cancelDelete}
                          className="admin-btn admin-btn-cancel"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleDeleteConfirm(publication.id)}
                        className="admin-btn admin-btn-delete"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty">
          <p>No publications found matching your criteria.</p>
          <Button to="/admin/publications/new" variant="primary">Add Publication</Button>
        </div>
      )}
    </div>
  );
};

export default ManagePublications;
