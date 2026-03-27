// App.js
import './index.css';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <div className="app-wrapper">
      <header className="app-header">
        <div className="app-header__logo">
          <div className="app-header__logo-icon">⚡</div>
          <span className="app-header__title">VectorShift Pipeline Builder</span>
        </div>
      </header>
      <main className="app-main">
        <PipelineToolbar />
        <PipelineUI />
      </main>
      <SubmitButton />
    </div>
  );
}

export default App;
