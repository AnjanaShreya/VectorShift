import shellStyles from './shared/NodeShell.module.scss';
import { Position } from 'reactflow';
import { NodeShell } from './shared/nodeShell';
import { PipelineHandle } from './shared/nodeHandles';

const handles = [
  { type: 'target', position: Position.Left, idSuffix: 'system', style: { top: `${100 / 3}%` } },
  { type: 'target', position: Position.Left, idSuffix: 'prompt', style: { top: `${200 / 3}%` } },
];

export const LLMNode = ({ id }) => {
  return (
    <NodeShell id={id} title="LLM" icon="🧠" variant="llm">
      <PipelineHandle nodeId={id} spec={handles[0]} />
      <PipelineHandle nodeId={id} spec={handles[1]} />
      <div className={shellStyles.body}>
        <p className={shellStyles.hint}>System + prompt inputs; response output.</p>
      </div>
      <PipelineHandle
        nodeId={id}
        spec={{ type: 'source', position: Position.Right, idSuffix: 'response' }}
      />
    </NodeShell>
  );
};
