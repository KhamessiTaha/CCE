import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, onSnapshot, setDoc, collection, getDocs, getDoc, deleteDoc } from 'firebase/firestore';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

const CodeEditor = ({ roomId }) => {
  const [code, setCode] = useState('// Start coding collaboratively...');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-code-dark');
  const [fontSize, setFontSize] = useState(14);
  const [files, setFiles] = useState(['index.js']);
  const [currentFile, setCurrentFile] = useState('index.js');

  useEffect(() => {
    const fetchFiles = async () => {
      const filesCollectionRef = collection(db, 'rooms', roomId, 'files');
      const filesSnapshot = await getDocs(filesCollectionRef);
      const fileNames = filesSnapshot.docs.map(doc => doc.id);
      setFiles(fileNames.length > 0 ? fileNames : ['index.js']);
    };

    fetchFiles();
  }, [roomId]);

  useEffect(() => {
    const fileRef = doc(db, 'rooms', roomId, 'files', currentFile);
    const unsubscribe = onSnapshot(fileRef, (doc) => {
      if (doc.exists() && doc.data().code !== code) {
        setCode(doc.data().code);
      }
    });
    return () => unsubscribe();
  }, [roomId, currentFile, code]);

  const handleEditorChange = async (value) => {
    setCode(value);
    try {
      const fileRef = doc(db, 'rooms', roomId, 'files', currentFile);
      await setDoc(fileRef, { code: value }, { merge: true });
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
      } catch (error) {
        console.error('Error creating new file:', error);
      }
    }
  };

  const handleDeleteFile = async (fileName) => {
    if (fileName !== currentFile) {
      if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
        try {
          await deleteDoc(doc(db, 'rooms', roomId, 'files', fileName));
          setFiles((prev) => prev.filter((file) => file !== fileName));
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
    } else {
      alert('Cannot delete the currently open file.');
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
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="monaco-editor-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h4>Files</h4>
          <div className="file-actions">
            <button onClick={handleNewFile} title="New File">➕</button>
            <button onClick={() => handleDeleteFile(currentFile)} title="Delete Current File">🗑️</button>
            <button onClick={() => handleRenameFile(currentFile)} title="Rename Current File">✏️</button>
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
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
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
      </div>
    </div>
  );
};

export default CodeEditor;