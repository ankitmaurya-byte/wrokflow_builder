// toolbar.js
import { DraggableNode } from './draggableNode';

const NODE_ITEMS = [
    { type: 'customInput', label: 'Input', icon: '📥', color: 'var(--color-input)' },
    { type: 'customOutput', label: 'Output', icon: '📤', color: 'var(--color-output)' },
    { type: 'llm', label: 'LLM', icon: '🤖', color: 'var(--color-llm)' },
    { type: 'text', label: 'Text', icon: '📝', color: 'var(--color-text)' },
    { type: 'filter', label: 'Filter', icon: '🔀', color: 'var(--color-filter)' },
    { type: 'api', label: 'API Call', icon: '🌐', color: 'var(--color-api)' },
    { type: 'transform', label: 'Transform', icon: '⚙️', color: 'var(--color-transform)' },
    { type: 'merge', label: 'Merge', icon: '🔗', color: 'var(--color-merge)' },
    { type: 'note', label: 'Note', icon: '📌', color: 'var(--color-note)' },
];

export const PipelineToolbar = () => (
    <div className="toolbar">
        <span className="toolbar__title">Node Palette</span>
        {NODE_ITEMS.map((item) => (
            <DraggableNode
                key={item.type}
                type={item.type}
                label={item.label}
                icon={item.icon}
                accentColor={item.color}
            />
        ))}
    </div>
);
