// noteNode.js — a comment/annotation node with no connections
import { useState } from 'react';
import { BaseNode } from './baseNode';

export const NoteNode = ({ id, data }) => {
  const [note, setNote] = useState(data?.note || 'Add a note here…');

  return (
    <BaseNode
      id={id}
      title="Note"
      inputs={[]}
      outputs={[]}
      accentColor="var(--color-note)"
      style={{ minWidth: 200, minHeight: 80 }}
    >
      <div className="node-field">
        <textarea
          className="node-note-textarea"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Add a note or comment…"
        />
      </div>
    </BaseNode>
  );
};
