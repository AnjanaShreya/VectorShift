import shellStyles from './shared/NodeShell.module.scss';
import { NodeShell } from './shared/nodeShell';
import { TargetHandle, SourceHandle } from './shared/nodeHandles';

export const MergeNode = ({ id }) => {
  return (
    <NodeShell id={id} title="MERGE" icon="🔗" variant="merge">
      <TargetHandle nodeId={id} suffix="in-a" style={{ top: '35%' }} />
      <TargetHandle nodeId={id} suffix="in-b" style={{ top: '65%' }} />
      <div className={shellStyles.body}>
        <p className={shellStyles.hint}>Combines two streams into one.</p>
      </div>
      <SourceHandle nodeId={id} suffix="out" />
    </NodeShell>
  );
};
