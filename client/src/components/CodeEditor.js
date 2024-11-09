import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebaseConfig';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

const CodeEditor = ({ roomId }) => {
  const [code, setCode] = useState('// Start coding collaboratively...');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark'); // Default dark theme
  const [fontSize, setFontSize] = useState(14);
  const roomRef = doc(db, 'rooms', roomId);
  const editorRef = useRef(null);

  // Load code changes in real-time from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(roomRef, (doc) => {
      if (doc.exists() && doc.data().code !== code) {
        setCode(doc.data().code);
      }
    });
    return () => unsubscribe();
  }, [roomId, code, roomRef]);

  const handleEditorChange = async (value) => {
    setCode(value);
    try {
      await setDoc(roomRef, { code: value }, { merge: true });
    } catch (error) {
      console.error('Error updating code:', error);
    }
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <div className="monaco-editor-container">
      <div className="editor-header">
        <h3>VSCode Collaborative Editor</h3>
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
            <option value="vs-dark">Dark</option>
            <option value="light">Light</option>
            <option value="hc-black">High Contrast</option>
          </select>

          <label>Font Size:</label>
          <input
            type="number"
            min="10"
            max="24"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
        </div>
      </div>

      <Editor
        height="80vh"
        language={language}
        theme={theme}
        value={code}
        onChange={handleEditorChange}
        options={{
          fontSize: fontSize,
          automaticLayout: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
};

export default CodeEditor;
