import { Handle, Position } from 'reactflow';

/**
 * Declarative handle spec:
 * - type: 'source' | 'target'
 * - position: Position.Left | Position.Right | ...
 * - idSuffix: appended to node id as `${id}-${idSuffix}` (React Flow handle id)
 * - style: optional inline style (e.g. { top: '33%' })
 * - label: optional, for documentation (not rendered unless we add labels later)
 */
export function PipelineHandle({ nodeId, spec }) {
  const { type, position, idSuffix, style } = spec;
  return (
    <Handle
      type={type}
      position={position}
      id={idSuffix ? `${nodeId}-${idSuffix}` : `${nodeId}-default`}
      style={style} 
    />
  );
}

/** Preset handle spec factories — avoids repeating Position + type in every node file */
export const HandlePresets = {
  leftTarget: (idSuffix, style) => ({
    type: 'target',
    position: Position.Left,
    idSuffix,
    style,
  }),
  rightSource: (idSuffix, style) => ({
    type: 'source',
    position: Position.Right,
    idSuffix,
    style,
  }),
};
