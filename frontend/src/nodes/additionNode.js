import shellStyles from './shared/NodeShell.module.scss';
import { NodeShell } from './shared/nodeShell';
import { PipelineHandle, HandlePresets } from './shared/nodeHandles';

export const AdditionNode = ({ id }) => {
  return (
    <NodeShell id={id} title="ADDITION" icon="+" variant="addition">
      <PipelineHandle nodeId={id} spec={HandlePresets.leftTarget('a', { top: '35%' })} />
      <PipelineHandle nodeId={id} spec={HandlePresets.leftTarget('b', { top: '65%' })} />
      <div className={shellStyles.body}>
        <p className={shellStyles.hint}>Sums two inputs.</p>
      </div>
      <PipelineHandle nodeId={id} spec={HandlePresets.rightSource('sum')} />
    </NodeShell>
  );
};
