import shellStyles from './shared/NodeShell.module.scss';
import { Position } from 'reactflow';
import { NodeShell } from './shared/nodeShell';
import { PipelineHandle } from './shared/nodeHandles';

export const SplitNode = ({ id }) => {
  return (
    <NodeShell id={id} title="SPLIT" icon="✂️" variant="split">
      <PipelineHandle
        nodeId={id}
        spec={{ type: 'target', position: Position.Left, idSuffix: 'in' }}
      />
      <div className={shellStyles.body}>
        <p className={shellStyles.hint}>Fan-out to two ports.</p>
      </div>
      <PipelineHandle
        nodeId={id}
        spec={{ type: 'source', position: Position.Right, idSuffix: 'out-a', style: { top: '35%' } }}
      />
      <PipelineHandle
        nodeId={id}
        spec={{ type: 'source', position: Position.Right, idSuffix: 'out-b', style: { top: '65%' } }}
      />
    </NodeShell>
  );
};
