import React from 'react';
import './App.css';
import { FileSelector, DataTable } from './Components';

function App() {
  const [file, setFile] = React.useState<string | ArrayBuffer | null | undefined>();

  return (
    <div className="App">
      <header className="App-header">
        <FileSelector setFile={setFile} />
        <DataTable file={file} />
      </header>
    </div>
  );
}

export default App;
