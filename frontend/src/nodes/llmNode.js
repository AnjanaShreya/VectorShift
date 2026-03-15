import shellStyles from './shared/NodeShell.module.scss';
import { NodeShell } from './shared/nodeShell';
import { TargetHandle, SourceHandle } from './shared/nodeHandles';

export const LLMNode = ({ id }) => {
  return (
    <NodeShell id={id} title="LLM" icon="🧠" variant="llm">
      <TargetHandle nodeId={id} suffix="system" style={{ top: `${100 / 3}%` }} />
      <TargetHandle nodeId={id} suffix="prompt" style={{ top: `${200 / 3}%` }} />
      <div className={shellStyles.body}>
        <p className={shellStyles.hint}>System + prompt inputs; response output.</p>
      </div>
      <SourceHandle nodeId={id} suffix="response" />
    </NodeShell>
  );
};
