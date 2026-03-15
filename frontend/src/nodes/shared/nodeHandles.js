import { Handle, Position } from 'reactflow';

/**
 * TargetHandle — left-side input connection point
 * @param {string} nodeId  - the node's id
 * @param {string} suffix  - appended to nodeId: "{nodeId}-{suffix}"
 * @param {object} [style] - optional inline style (e.g. { top: '35%' })
 * @param {string} [className]- optional CSS class
 */
export const TargetHandle = ({ nodeId, suffix, style, className }) => (
  <Handle
    type="target"
    position={Position.Left}
    id={`${nodeId}-${suffix}`}
    style={style}
    className={className}
  />
);

/**
 * SourceHandle — right-side output connection point
 * @param {string} nodeId     - the node's id
 * @param {string} suffix     - appended to nodeId: "{nodeId}-{suffix}"
 * @param {object} [style]    - optional inline style (e.g. { top: '65%' })
 * @param {string} [className]- optional CSS class
 */
export const SourceHandle = ({ nodeId, suffix, style, className }) => (
  <Handle
    type="source"
    position={Position.Right}
    id={`${nodeId}-${suffix}`}
    style={style}
    className={className}
  />
);
