import shellStyles from './shared/NodeShell.module.scss';
import { NodeShell } from './shared/nodeShell';
import { TargetHandle, SourceHandle } from './shared/nodeHandles';

export const SplitNode = ({ id }) => {
  return (
    <NodeShell id={id} title="SPLIT" icon="✂️" variant="split">
      <TargetHandle nodeId={id} suffix="in" />
      <div className={shellStyles.body}>
        <p className={shellStyles.hint}>Fan-out to two ports.</p>
      </div>
      <SourceHandle nodeId={id} suffix="out-a" style={{ top: '35%' }} />
      <SourceHandle nodeId={id} suffix="out-b" style={{ top: '65%' }} />
    </NodeShell>
  );
};
