import shellStyles from './shared/NodeShell.module.scss';
import { useState } from 'react';
import { NodeShell } from './shared/nodeShell';
import { PipelineHandle, HandlePresets } from './shared/nodeHandles';
import { useStore } from '../store';

export const InputNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');

  return (
    <NodeShell id={id} title="INPUT" icon="⬇️" variant="input">
      <div className={shellStyles.body}>
        <div className={shellStyles.field}>
          <span className={shellStyles.label}>Name</span>
          <input
            type="text"
            className={shellStyles.inputControl}
            value={currName}
            onChange={(e) => {
              setCurrName(e.target.value);
              updateNodeField(id, 'inputName', e.target.value);
            }}
            autoComplete="off"
          />
        </div>
        <div className={shellStyles.field}>
          <span className={shellStyles.label}>Type</span>
          <select
            className={shellStyles.selectControl}
            value={inputType}
            onChange={(e) => {
              setInputType(e.target.value);
              updateNodeField(id, 'inputType', e.target.value);
            }}
          >
            <option value="Text">Text</option>
            <option value="File">File</option>
          </select>
        </div>
      </div>
      <PipelineHandle nodeId={id} spec={HandlePresets.rightSource('value')} />
    </NodeShell>
  );
};
