import shellStyles from './shared/NodeShell.module.scss';
import { useState } from 'react';
import { NodeShell } from './shared/nodeShell';
import { TargetHandle } from './shared/nodeHandles';
import { useStore } from '../store';

export const OutputNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data.outputType || 'Text');

  return (
    <NodeShell id={id} title="OUTPUT" icon="⬆️" variant="output">
      <TargetHandle nodeId={id} suffix="value" />
      <div className={shellStyles.body}>
        <div className={shellStyles.field}>
          <span className={shellStyles.label}>Name</span>
          <input
            type="text"
            className={shellStyles.inputControl}
            value={currName}
            onChange={(e) => {
              setCurrName(e.target.value);
              updateNodeField(id, 'outputName', e.target.value);
            }}
            autoComplete="off"
          />
        </div>
        <div className={shellStyles.field}>
          <span className={shellStyles.label}>Type</span>
          <select
            className={shellStyles.selectControl}
            value={outputType}
            onChange={(e) => {
              setOutputType(e.target.value);
              updateNodeField(id, 'outputType', e.target.value);
            }}
          >
            <option value="Text">Text</option>
            <option value="Image">Image</option>
          </select>
        </div>
      </div>
    </NodeShell>
  );
};
