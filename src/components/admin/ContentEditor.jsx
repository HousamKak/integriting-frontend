// src/components/admin/ContentEditor.jsx
import React, { useState, useEffect } from 'react';
import '../../styles/components/ContentEditor.scss';

const ContentEditor = ({ content, onSave, contentType = 'text' }) => {
  const [editorContent, setEditorContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(false);

  useEffect(() => {
    setEditorContent(content || '');
  }, [content]);

  const handleKeyDown = (e) => {
    // Handle tab key to indent instead of changing focus
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newContent = editorContent.substring(0, start) + '  ' + editorContent.substring(end);
      setEditorContent(newContent);
      // Set cursor position after the inserted tab
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleChange = (e) => {
    setEditorContent(e.target.value);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editorContent);
      setToolbarVisible(false);
    } catch (error) {
      console.error('Error saving content:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToolbarAction = (action) => {
    let newContent = editorContent;
    const textArea = document.getElementById('content-editor');
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const selectedText = editorContent.substring(start, end);

    switch (action) {
      case 'bold':
        newContent = editorContent.substring(0, start) + `**${selectedText}**` + editorContent.substring(end);
        break;
      case 'italic':
        newContent = editorContent.substring(0, start) + `*${selectedText}*` + editorContent.substring(end);
        break;
      case 'heading':
        newContent = editorContent.substring(0, start) + `## ${selectedText}` + editorContent.substring(end);
        break;
      case 'link':
        newContent = editorContent.substring(0, start) + `[${selectedText}](url)` + editorContent.substring(end);
        break;
      case 'list':
        newContent = editorContent.substring(0, start) + `- ${selectedText}` + editorContent.substring(end);
        break;
      default:
        break;
    }

    setEditorContent(newContent);
    
    // Focus back to text area
    setTimeout(() => {
      textArea.focus();
      textArea.selectionStart = textArea.selectionEnd = end + (newContent.length - editorContent.length);
    }, 0);
  };

  return (
    <div className="content-editor-container">
      <div className={`content-editor-toolbar ${toolbarVisible ? 'visible' : ''}`}>
        <button type="button" onClick={() => handleToolbarAction('bold')} title="Bold">B</button>
        <button type="button" onClick={() => handleToolbarAction('italic')} title="Italic">I</button>
        <button type="button" onClick={() => handleToolbarAction('heading')} title="Heading">H</button>
        <button type="button" onClick={() => handleToolbarAction('link')} title="Link">🔗</button>
        <button type="button" onClick={() => handleToolbarAction('list')} title="List">•</button>
        <div className="content-editor-toolbar-actions">
          <button 
            type="button" 
            onClick={handleSave} 
            disabled={isSaving}
            className="content-editor-save-btn"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      
      <textarea
        id="content-editor"
        className="content-editor"
        value={editorContent}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setToolbarVisible(true)}
        placeholder="Enter your content here..."
        rows={contentType === 'text' ? 8 : 15}
      ></textarea>
      
      {contentType === 'markdown' && (
        <div className="content-editor-info">
          <p>Markdown supported. Use ** for bold, * for italic, ## for headings, and - for lists.</p>
        </div>
      )}
    </div>
  );
};

export default ContentEditor;