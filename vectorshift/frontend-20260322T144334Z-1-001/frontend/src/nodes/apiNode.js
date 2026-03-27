// apiNode.js — makes an HTTP API call
import { useState } from 'react';
import { BaseNode } from './baseNode';

export const APINode = ({ id, data }) => {
  const [method, setMethod] = useState(data?.method || 'GET');
  const [url, setUrl] = useState(data?.url || 'https://api.example.com/endpoint');

  return (
    <BaseNode
      id={id}
      title="API Call"
      inputs={[
        { id: 'url', label: 'url' },
        { id: 'body', label: 'body' },
        { id: 'auth', label: 'auth' },
      ]}
      outputs={[
        { id: 'response', label: 'response' },
        { id: 'error', label: 'error' },
        { id: 'status', label: 'status' },
      ]}
      accentColor="var(--color-api)"
    >
      <div className="node-field">
        <label>Method</label>
        <select value={method} onChange={(e) => setMethod(e.target.value)}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>
      <div className="node-field">
        <label>URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/endpoint"
        />
      </div>
    </BaseNode>
  );
};
