// baseNode.js
// Shared abstraction for all pipeline nodes

import { Handle, Position } from 'reactflow';

/**
 * BaseNode — universal node wrapper
 *
 * Props:
 *   id         – node id (string)
 *   title      – header label (string)
 *   inputs     – array of { id, label, style? }  → left-side target handles
 *   outputs    – array of { id, label, style? }  → right-side source handles
 *   children   – React node (body content: fields, selects, etc.)
 *   style      – optional extra inline styles for the card
 *   accentColor– optional top-border color override
 */
export const BaseNode = ({
  id,
  title,
  inputs = [],
  outputs = [],
  children,
  style = {},
  accentColor,
}) => {
  const nodeStyle = {
    minWidth: 220,
    minHeight: 90,
    ...style,
  };

  // Spread handles evenly across the node height
  const getHandleTop = (index, total) => {
    if (total === 1) return '50%';
    const pct = ((index + 1) / (total + 1)) * 100;
    return `${pct}%`;
  };

  const borderColor = accentColor || 'var(--accent)';

  return (
    <div className="base-node" style={{ ...nodeStyle, borderTopColor: borderColor }}>
      {/* Left (target) handles */}
      {inputs.map((handle, i) => (
        <div key={handle.id}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-${handle.id}`}
            style={{ top: handle.style?.top ?? getHandleTop(i, inputs.length), ...(handle.style || {}) }}
            className="node-handle node-handle--target"
          />
          <span
            className="handle-label handle-label--left"
            style={{ top: handle.style?.top ?? getHandleTop(i, inputs.length) }}
          >
            {handle.label}
          </span>
        </div>
      ))}

      {/* Node header */}
      <div className="base-node__header">
        <span className="base-node__title">{title}</span>
      </div>

      {/* Node body */}
      <div className="base-node__body">
        {children}
      </div>

      {/* Right (source) handles */}
      {outputs.map((handle, i) => (
        <div key={handle.id}>
          <Handle
            type="source"
            position={Position.Right}
            id={`${id}-${handle.id}`}
            style={{ top: handle.style?.top ?? getHandleTop(i, outputs.length), ...(handle.style || {}) }}
            className="node-handle node-handle--source"
          />
          <span
            className="handle-label handle-label--right"
            style={{ top: handle.style?.top ?? getHandleTop(i, outputs.length) }}
          >
            {handle.label}
          </span>
        </div>
      ))}
    </div>
  );
};
