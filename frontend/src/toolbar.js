// toolbar.js

import styles from './Toolbar.module.scss';
import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
  return (
    <div className={styles.toolbar}>
      <span className={styles.label}>Drag onto canvas</span>
      <div className={styles.row}>
        <DraggableNode type="customInput" label="Input" />
        <DraggableNode type="llm" label="LLM" />
        <DraggableNode type="customOutput" label="Output" />
        <DraggableNode type="text" label="Text" />
        <DraggableNode type="merge" label="Merge" />
        <DraggableNode type="split" label="Split" />
        <DraggableNode type="constant" label="Constant" />
        <DraggableNode type="addition" label="Addition" />
        <DraggableNode type="knowledgeBase" label="Knowledge Base" />
      </div>
    </div>
  );
};
