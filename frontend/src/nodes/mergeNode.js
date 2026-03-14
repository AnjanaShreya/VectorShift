import shellStyles from './shared/NodeShell.module.scss';
import { Position } from 'reactflow';
import { NodeShell } from './shared/nodeShell';
import { PipelineHandle } from './shared/nodeHandles';

export const MergeNode = ({ id }) => {
  return (
    <NodeShell id={id} title="MERGE" icon="🔗" variant="merge">
      <PipelineHandle
        nodeId={id}
        spec={{ type: 'target', position: Position.Left, idSuffix: 'in-a', style: { top: '35%' } }}
      />
      <PipelineHandle
        nodeId={id}
        spec={{ type: 'target', position: Position.Left, idSuffix: 'in-b', style: { top: '65%' } }}
      />
      <div className={shellStyles.body}>
        <p className={shellStyles.hint}>Combines two streams into one.</p>
      </div>
      <PipelineHandle
        nodeId={id}
        spec={{ type: 'source', position: Position.Right, idSuffix: 'out' }}
      />
    </NodeShell>
  );
};
