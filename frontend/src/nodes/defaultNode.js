import shellStyles from './shared/NodeShell.module.scss';
import { NodeShell } from './shared/nodeShell';

export const DefaultPipelineNode = ({ id, type }) => (
  <NodeShell id={id} title="UNKNOWN NODE" icon="⚠️" variant="output">
    <p className={shellStyles.hint}>
      No component registered for type{' '}
      <code style={{ background: 'hsla(0 0% 100% / 0.08)', padding: '1px 5px', borderRadius: 4 }}>
        "{type}"
      </code>
    </p>
  </NodeShell>
);
