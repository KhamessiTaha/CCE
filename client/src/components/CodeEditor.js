import React, { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';

const CodeEditor = ({ roomId }) => {
  const [code, setCode] = useState('// Start coding collaboratively...');

  // Placeholder for saving changes to Firestore in real-time

  return (
    <div className="code-editor">
      <CodeMirror
        value={code}
        options={{
          mode: 'javascript',
          theme: 'material',
          lineNumbers: true,
        }}
        onBeforeChange={(editor, data, value) => {
          setCode(value);
          // Add logic to update Firestore here
        }}
      />
    </div>
  );
};

export default CodeEditor;