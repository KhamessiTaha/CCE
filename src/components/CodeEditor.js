import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  collection, 
  getDocs, 
  getDoc, 
  deleteDoc,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

const CodeEditor = ({ roomId }) => {
  const [code, setCode] = useState('// Start coding collaboratively...');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-code-dark');
  const [fontSize, setFontSize] = useState(14);
  const [files, setFiles] = useState(['index.js']);
  const [currentFile, setCurrentFile] = useState('index.js');

  // Function to log activities to Firebase
  const logActivity = async (action, details) => {
    try {
      const activitiesCollectionRef = collection(db, 'rooms', roomId, 'activities');
      await addDoc(activitiesCollectionRef, {
        action,
        details,
        timestamp: serverTimestamp(),
        file: details.fileName || currentFile
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  useEffect(() => {
    const fetchFiles = async () => {
      const filesCollectionRef = collection(db, 'rooms', roomId, 'files');
      const filesSnapshot = await getDocs(filesCollectionRef);
      const fileNames = filesSnapshot.docs.map(doc => doc.id);
      setFiles(fileNames.length > 0 ? fileNames : ['index.js']);
      setCurrentFile(fileNames.length > 0 ? fileNames[0] : null);
    };

    fetchFiles();
  }, [roomId]);

  useEffect(() => {
    if (!currentFile) return;

    const fileRef = doc(db, 'rooms', roomId, 'files', currentFile);
    const unsubscribe = onSnapshot(fileRef, (doc) => {
      if (doc.exists() && doc.data().code !== code) {
        setCode(doc.data().code);
      }
    });
    return () => unsubscribe();
  }, [roomId, currentFile, code]);

  // Debounce function to limit activity logging for code changes
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const logCodeChange = debounce(async (value) => {
    await logActivity('code_modified', {
      fileName: currentFile,
      codeLength: value.length,
      language
    });
  }, 2000); // Log code changes every 2 seconds at most

  const handleEditorChange = async (value) => {
    setCode(value);
    if (!currentFile) return;

    try {
      const fileRef = doc(db, 'rooms', roomId, 'files', currentFile);
      await setDoc(fileRef, { code: value }, { merge: true });
      logCodeChange(value);
    } catch (error) {
      console.error('Error updating code:', error);
    }
  };

  const handleNewFile = async () => {
    const fileName = prompt('Enter new file name (e.g., newFile.js):');
    if (fileName && !files.includes(fileName)) {
      const fileRef = doc(db, 'rooms', roomId, 'files', fileName);
      try {
        await setDoc(fileRef, { code: '' });
        setFiles((prev) => [...prev, fileName]);
        setCurrentFile(fileName);
        
        await logActivity('file_created', {
          fileName,
          fileType: fileName.split('.').pop()
        });
      } catch (error) {
        console.error('Error creating new file:', error);
      }
    }
  };

  const handleDeleteFile = async (fileName) => {
    if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
      try {
        await deleteDoc(doc(db, 'rooms', roomId, 'files', fileName));
        setFiles((prev) => prev.filter((file) => file !== fileName));
        
        // Log the deletion
        await logActivity('file_deleted', {
          fileName,
          fileType: fileName.split('.').pop()
        });
        
        // If we're deleting the current file
        if (fileName === currentFile) {
          const remainingFiles = files.filter(file => file !== fileName);
          setCurrentFile(remainingFiles.length > 0 ? remainingFiles[0] : null);
          setCode('');
        }
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  };

  const handleRenameFile = async (oldFileName) => {
    const newFileName = prompt('Enter new name for the file:', oldFileName);
    if (newFileName && newFileName !== oldFileName && !files.includes(newFileName)) {
      try {
        const oldFileRef = doc(db, 'rooms', roomId, 'files', oldFileName);
        const newFileRef = doc(db, 'rooms', roomId, 'files', newFileName);
        const oldFileSnap = await getDoc(oldFileRef);
        
        if (oldFileSnap.exists()) {
          const fileData = oldFileSnap.data();
          await setDoc(newFileRef, fileData);
          await deleteDoc(oldFileRef);
          setFiles((prev) => prev.map((file) => (file === oldFileName ? newFileName : file)));
          if (currentFile === oldFileName) setCurrentFile(newFileName);
          
          await logActivity('file_renamed', {
            oldFileName,
            newFileName,
            fileType: newFileName.split('.').pop()
          });
        }
      } catch (error) {
        console.error('Error renaming file:', error);
      }
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const fileContent = e.target.result;
        const fileRef = doc(db, 'rooms', roomId, 'files', file.name);
        try {
          await setDoc(fileRef, { code: fileContent });
          setFiles((prev) => [...prev, file.name]);
          setCurrentFile(file.name);
          
          await logActivity('file_uploaded', {
            fileName: file.name,
            fileType: file.name.split('.').pop(),
            fileSize: file.size
          });
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleLanguageChange = async (newLanguage) => {
    setLanguage(newLanguage);
    await logActivity('language_changed', {
      fileName: currentFile,
      oldLanguage: language,
      newLanguage
    });
  };

  // Rest of the component remains the same until the return statement
  return (
    <div className="monaco-editor-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h4>Files</h4>
          <div className="file-actions">
            <button onClick={handleNewFile} title="New File">➕</button>
            {currentFile && (
              <>
                <button onClick={() => handleDeleteFile(currentFile)} title="Delete Current File">🗑️</button>
                <button onClick={() => handleRenameFile(currentFile)} title="Rename Current File">✏️</button>
              </>
            )}
            <label className="upload-label">
              📁
              <input
                type="file"
                onChange={handleFileUpload}
                title="Upload File"
                className="file-upload"
              />
            </label>
          </div>
        </div>
        <ul className="file-list">
          {files.map((file, index) => (
            <li
              key={index}
              className={currentFile === file ? 'active-file' : ''}
              onClick={() => setCurrentFile(file)}
            >
              {file}
            </li>
          ))}
        </ul>
      </div>

      <div className="editor-section">
        <div className="editor-header">
          <h3>CCEditor</h3>
          <div className="editor-settings">
            <label>Language:</label>
            <select value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
            </select>

            <label>Theme:</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="vs-code-dark">VSCode Dark</option>
              <option value="vs-code-light">VSCode Light</option>
              <option value="hc-black">High Contrast</option>
            </select>

            <label>Font Size:</label>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
            >
              {[10, 12, 14, 16, 18, 20, 22, 24].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        {currentFile ? (
          <Editor
            height="100%"
            language={language}
            theme={theme === 'vs-code-dark' ? 'vs-dark' : theme === 'vs-code-light' ? 'light' : 'hc-black'}
            value={code}
            onChange={handleEditorChange}
            options={{
              fontSize: fontSize,
              automaticLayout: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: {
                top: 8,
                bottom: 8
              },
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 3,
              folding: true,
              renderLineHighlight: 'all',
              renderWhitespace: 'all',
              renderControlCharacters: true,
              renderIndentGuides: true,
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                useShadows: false,
                verticalHasArrows: false,
                horizontalHasArrows: false,
                verticalScrollbarSize: 10,
                horizontalScrollbarSize: 10,
                arrowSize: 30
              }
            }}
          />
        ) : (
          <div className="no-file-message" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            fontSize: '1.2rem',
            color: '#666',
            backgroundColor: '#f5f5f5',
            border: '1px dashed #ccc',
            borderRadius: '4px',
            margin: '1rem'
          }}>
            No file selected. Please select a file from the sidebar or create a new one.
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;