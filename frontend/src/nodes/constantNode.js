import shellStyles from './shared/NodeShell.module.scss';
import { useState } from 'react';
import { NodeShell } from './shared/nodeShell';
import { PipelineHandle, HandlePresets } from './shared/nodeHandles';
import { useStore } from '../store';

export const ConstantNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const [value, setValue] = useState(data?.value ?? '42');

  return (
    <NodeShell id={id} title="CONSTANT" icon="#" variant="input">
      <div className={shellStyles.body}>
        <div className={shellStyles.field}>
          <span className={shellStyles.label}>Value</span>
          <input
            type="text"
            className={shellStyles.inputControl}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              updateNodeField(id, 'value', e.target.value);
            }}
            autoComplete="off"
          />
        </div>
      </div>
      <PipelineHandle nodeId={id} spec={HandlePresets.rightSource('value')} />
    </NodeShell>
  );
};
