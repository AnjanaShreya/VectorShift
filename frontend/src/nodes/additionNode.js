import shellStyles from './shared/NodeShell.module.scss';
import { NodeShell } from './shared/nodeShell';
import { TargetHandle, SourceHandle } from './shared/nodeHandles';

export const AdditionNode = ({ id }) => {
  return (
    <NodeShell id={id} title="ADDITION" icon="+" variant="addition">
      <TargetHandle nodeId={id} suffix="a" style={{ top: '35%' }} />
      <TargetHandle nodeId={id} suffix="b" style={{ top: '65%' }} />
      <div className={shellStyles.body}>
        <p className={shellStyles.hint}>Sums two inputs.</p>
      </div>
      <SourceHandle nodeId={id} suffix="sum" />
    </NodeShell>
  );
};
