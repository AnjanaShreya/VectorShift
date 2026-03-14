import shellStyles from './shared/NodeShell.module.scss';
import { useState } from 'react';
import { NodeShell } from './shared/nodeShell';
import { PipelineHandle, HandlePresets } from './shared/nodeHandles';
import { useStore } from '../store';

export const KnowledgeBaseNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const [name, setName] = useState(data?.kbName ?? 'My Knowledge Base');
  const [topK, setTopK] = useState(data?.topK ?? 5);

  const onNameChange = (e) => {
    setName(e.target.value);
    updateNodeField(id, 'kbName', e.target.value);
  };

  const onTopKChange = (e) => {
    const val = Math.max(1, Number(e.target.value) || 1);
    setTopK(val);
    updateNodeField(id, 'topK', val);
  };

  return (
    <NodeShell id={id} title="KNOWLEDGE BASE" icon="📚" variant="input">
      <PipelineHandle nodeId={id} spec={HandlePresets.leftTarget('query')} />
      <div className={shellStyles.body}>
        <div className={shellStyles.field}>
          <span className={shellStyles.label}>Name</span>
          <input
            type="text"
            className={shellStyles.inputControl}
            value={name}
            onChange={onNameChange}
            autoComplete="off"
          />
        </div>
        <div className={shellStyles.field}>
          <span className={shellStyles.label}>Top K results</span>
          <input
            type="number"
            className={shellStyles.inputControl}
            min={1}
            max={100}
            value={topK}
            onChange={onTopKChange}
          />
        </div>
      </div>
      <PipelineHandle nodeId={id} spec={HandlePresets.rightSource('results')} />
    </NodeShell>
  );
};
