// mergeNode.js — merges multiple inputs into one output
import { useState } from 'react';
import { BaseNode } from './baseNode';

export const MergeNode = ({ id, data }) => {
  const [strategy, setStrategy] = useState(data?.strategy || 'concat');
  const [separator, setSeparator] = useState(data?.separator || '\\n');

  const showSeparator = strategy === 'concat' || strategy === 'join';

  return (
    <BaseNode
      id={id}
      title="Merge"
      inputs={[
        { id: 'input1', label: 'input 1' },
        { id: 'input2', label: 'input 2' },
        { id: 'input3', label: 'input 3' },
      ]}
      outputs={[{ id: 'merged', label: 'merged' }]}
      accentColor="var(--color-merge)"
    >
      <div className="node-field">
        <label>Strategy</label>
        <select value={strategy} onChange={(e) => setStrategy(e.target.value)}>
          <option value="concat">Concatenate</option>
          <option value="join">Join with separator</option>
          <option value="array">Array</option>
          <option value="object">Merge Objects</option>
        </select>
      </div>
      {showSeparator && (
        <div className="node-field">
          <label>Separator</label>
          <input
            type="text"
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            placeholder="\\n"
          />
        </div>
      )}
    </BaseNode>
  );
};
