// filterNode.js — routes data based on a condition expression
import { useState } from 'react';
import { BaseNode } from './baseNode';

export const FilterNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || 'value > 0');

  return (
    <BaseNode
      id={id}
      title="Filter"
      inputs={[
        { id: 'data', label: 'data' },
        { id: 'condition', label: 'condition' },
      ]}
      outputs={[
        { id: 'true', label: 'true ✓' },
        { id: 'false', label: 'false ✗' },
      ]}
      accentColor="var(--color-filter)"
    >
      <div className="node-field">
        <label>Condition Expression</label>
        <input
          type="text"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          placeholder="value > 0"
        />
      </div>
    </BaseNode>
  );
};
