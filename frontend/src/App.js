import { Whisper, Tooltip } from 'rsuite';
import styles from './App.module.scss';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <div className={styles.appShell}>
      <header className={styles.header}>
        <Whisper
          placement="right"
          trigger="hover"
          speaker={
            <Tooltip className={styles.tooltip}>
              Drag nodes onto the canvas and connect handles to build your flow.
            </Tooltip>
          }
        >
          <h1 style={{ cursor: 'pointer', display: 'inline-block' }}>Pipeline builder</h1>
        </Whisper>
      </header>
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
    </div>
  );
}

export default App;
