import { NodeShell } from './shared/nodeShell';

export const DefaultPipelineNode = ({ id, type }) => (
  <NodeShell id={id} title={type || 'Node'} variant="utility">
    <p className="node-shell-hint" style={{ margin: 0 }}>
      Unknown type &quot;{type}&quot;
    </p>
  </NodeShell>
);
