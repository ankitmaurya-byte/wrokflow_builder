// transformNode.js — applies a data transformation
import { useState } from 'react';
import { BaseNode } from './baseNode';

const TRANSFORMS = [
  { value: 'uppercase', label: 'Uppercase' },
  { value: 'lowercase', label: 'Lowercase' },
  { value: 'trim', label: 'Trim Whitespace' },
  { value: 'json_parse', label: 'JSON Parse' },
  { value: 'json_stringify', label: 'JSON Stringify' },
  { value: 'base64_encode', label: 'Base64 Encode' },
  { value: 'base64_decode', label: 'Base64 Decode' },
  { value: 'url_encode', label: 'URL Encode' },
  { value: 'extract_json', label: 'Extract JSON Field' },
];

export const TransformNode = ({ id, data }) => {
  const [transform, setTransform] = useState(data?.transform || 'uppercase');
  const [field, setField] = useState(data?.field || '');

  const needsFieldParam = transform === 'extract_json';

  return (
    <BaseNode
      id={id}
      title="Transform"
      inputs={[{ id: 'input', label: 'input' }]}
      outputs={[{ id: 'output', label: 'output' }]}
      accentColor="var(--color-transform)"
    >
      <div className="node-field">
        <label>Operation</label>
        <select value={transform} onChange={(e) => setTransform(e.target.value)}>
          {TRANSFORMS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      {needsFieldParam && (
        <div className="node-field">
          <label>Field Path</label>
          <input
            type="text"
            value={field}
            onChange={(e) => setField(e.target.value)}
            placeholder="e.g. data.user.name"
          />
        </div>
      )}
    </BaseNode>
  );
};
