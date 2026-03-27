// draggableNode.js
export const DraggableNode = ({ type, label, icon, accentColor }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="draggable-node"
      style={{ borderLeftColor: accentColor || 'var(--accent)' }}
      onDragStart={(e) => onDragStart(e, type)}
      onDragEnd={(e) => { e.target.style.cursor = 'grab'; }}
      draggable
    >
      {icon && <span className="draggable-node__icon">{icon}</span>}
      <span className="draggable-node__label">{label}</span>
    </div>
  );
};