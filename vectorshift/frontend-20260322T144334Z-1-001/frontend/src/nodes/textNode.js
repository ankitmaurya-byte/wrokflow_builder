// textNode.js  — Part 3: auto-resize + dynamic variable handles
import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { BaseNode } from './baseNode';

// Extract valid JS variable names from {{varName}} patterns
const extractVariables = (text) => {
  const regex = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;
  const vars = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    vars.add(match[1]);
  }
  return Array.from(vars);
};

// Compute a reasonable node width from line content
const computeSize = (text) => {
  const lines = text.split('\n');
  const longestLine = Math.max(...lines.map((l) => l.length), 10);
  const width = Math.min(Math.max(220, longestLine * 8 + 60), 600);
  const height = Math.min(Math.max(80, lines.length * 22 + 20), 400);
  return { width, height };
};

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const [nodeSize, setNodeSize] = useState(() => computeSize(data?.text || '{{input}}'));
  const textareaRef = useRef(null);

  // Recompute variables and size whenever text changes
  useEffect(() => {
    setVariables(extractVariables(currText));
    setNodeSize(computeSize(currText));
  }, [currText]);

  const getHandleTop = (index, total) => {
    if (total === 1) return '50%';
    return `${((index + 1) / (total + 1)) * 100}%`;
  };

  return (
    <div
      className="base-node"
      style={{
        width: nodeSize.width,
        minHeight: nodeSize.height,
        borderTopColor: 'var(--color-text)',
        transition: 'width 0.15s ease, min-height 0.15s ease',
      }}
    >
      {/* Dynamic variable handles (left / target) */}
      {variables.map((varName, i) => (
        <div key={varName}>
          <Handle
            type="target"
            position={Position.Left}
            id={`${id}-var-${varName}`}
            style={{ top: getHandleTop(i, variables.length) }}
            className="node-handle node-handle--target"
          />
          <span
            className="handle-label handle-label--left"
            style={{ top: getHandleTop(i, variables.length) }}
          >
            {varName}
          </span>
        </div>
      ))}

      {/* Header */}
      <div className="base-node__header">
        <span className="base-node__title">Text</span>
      </div>

      {/* Body */}
      <div className="base-node__body">
        <div className="node-field">
          <label>Content</label>
          <textarea
            ref={textareaRef}
            className="text-node-textarea"
            value={currText}
            onChange={(e) => setCurrText(e.target.value)}
            placeholder="Enter text… use {{variable}} to add handles"
            rows={Math.max(2, currText.split('\n').length)}
            style={{ width: nodeSize.width - 40 }}
          />
        </div>
        {variables.length > 0 && (
          <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Variables: {variables.map((v) => (
              <code key={v} style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: '0 4px',
                marginRight: 4,
                color: 'var(--color-text)',
              }}>
                {v}
              </code>
            ))}
          </div>
        )}
      </div>

      {/* Fixed output handle (right) */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{ top: '50%' }}
        className="node-handle node-handle--source"
      />
      <span className="handle-label handle-label--right" style={{ top: '50%' }}>
        output
      </span>
    </div>
  );
};
