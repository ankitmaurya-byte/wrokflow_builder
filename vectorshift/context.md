# VectorShift Pipeline Builder — Context Document

> Full-stack visual pipeline builder built with React + ReactFlow (frontend) and FastAPI (backend).

---

## Project Structure

```
vectorshift/
├── frontend/src/
│   ├── App.js                  # Root layout (header + toolbar + canvas + submit)
│   ├── index.css               # Global design system (dark theme, CSS vars)
│   ├── index.js                # React entry point
│   ├── ui.js                   # ReactFlow canvas, nodeTypes registry, drag-drop
│   ├── toolbar.js              # Left sidebar node palette
│   ├── draggableNode.js        # Palette item component (drag source)
│   ├── store.js                # Zustand global state (nodes, edges, actions)
│   ├── submit.js               # Submit button + POST to backend + result modal
│   └── nodes/
│       ├── baseNode.js         # ★ Core abstraction — all nodes extend this
│       ├── inputNode.js        # Input node (name + type)
│       ├── outputNode.js       # Output node (name + type)
│       ├── llmNode.js          # LLM node (model selector)
│       ├── textNode.js         # ★ Text node (auto-resize + {{variable}} handles)
│       ├── filterNode.js       # Filter node (condition → true/false outputs)
│       ├── apiNode.js          # API Call node (method + URL)
│       ├── noteNode.js         # Note/annotation node (no handles)
│       ├── transformNode.js    # Data transform node (8 operation types)
│       └── mergeNode.js        # Merge node (3 inputs → 1 output)
└── backend/
    └── main.py                 # FastAPI app with /pipelines/parse endpoint
```

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 18, ReactFlow 11, Zustand         |
| Styling   | Vanilla CSS (custom design system)      |
| Backend   | Python, FastAPI, Pydantic, Uvicorn      |
| Fonts     | Inter (Google Fonts)                    |

---

## Part 1 — Node Abstraction (`baseNode.js`)

### The Problem
All nodes shared: card layout, border styling, ReactFlow `Handle` placement, and header rendering — duplicated across every file.

### The Solution: `BaseNode`

```js
<BaseNode
  id={id}
  title="My Node"
  inputs={[{ id: 'in1', label: 'data' }]}       // left-side target handles
  outputs={[{ id: 'out1', label: 'result' }]}    // right-side source handles
  accentColor="var(--color-api)"                 // top border color
>
  {/* any JSX: inputs, selects, etc. */}
</BaseNode>
```

**Auto-handle spacing**: handles are evenly distributed vertically using `((index + 1) / (total + 1)) * 100%`.

**Handle labels**: thin text labels are absolutely positioned next to each handle.

### Node Catalog

| Node       | Inputs                   | Outputs              | Key Field            |
|------------|--------------------------|----------------------|----------------------|
| Input      | —                        | `value`              | Name, Type select    |
| Output     | `value`                  | —                    | Name, Type select    |
| LLM        | `system`, `prompt`       | `response`           | Model select         |
| Text       | `{{var}}` dynamic        | `output`             | Auto-resize textarea |
| Filter     | `data`, `condition`      | `true`, `false`      | Condition expression |
| API Call   | `url`, `body`, `auth`    | `response`, `error`, `status` | Method, URL  |
| Transform  | `input`                  | `output`             | Operation select     |
| Merge      | `input1/2/3`             | `merged`             | Strategy select      |
| Note       | —                        | —                    | Freetext textarea    |

---

## Part 2 — Styling (`index.css`)

### Design System

```css
:root {
  --bg-base:    #0d0f1a;   /* page background */
  --bg-panel:   #12152a;   /* sidebar / header */
  --bg-card:    #1a1f35;   /* node cards */
  --accent:     #6c63ff;   /* primary purple */

  /* Per-node accent colors */
  --color-input:     #3b82f6;  /* blue */
  --color-output:    #10b981;  /* green */
  --color-llm:       #a855f7;  /* purple */
  --color-text:      #f59e0b;  /* amber */
  --color-filter:    #ef4444;  /* red */
  --color-api:       #06b6d4;  /* cyan */
  --color-transform: #f97316;  /* orange */
  --color-merge:     #ec4899;  /* pink */
  --color-note:      #84cc16;  /* lime */
}
```

### Layout
```
┌─────────────────────────────────────────────┐
│  Header (logo + title)                      │
├──────────────┬──────────────────────────────┤
│  Toolbar     │  ReactFlow Canvas            │
│  (sidebar)   │                              │
│  - 9 nodes   │                              │
├──────────────┴──────────────────────────────┤
│  Submit Bar (centered button)               │
└─────────────────────────────────────────────┘
```

### Key CSS Classes
| Class | Purpose |
|-------|---------|
| `.base-node` | Node card (dark bg, colored top border, shadow) |
| `.base-node__header` | Title row |
| `.base-node__body` | Content area with form fields |
| `.node-field` | Label + input wrapper |
| `.draggable-node` | Sidebar palette item |
| `.modal-overlay` | Full-screen backdrop for result dialog |
| `.modal-card` | Result/error dialog card |

---

## Part 3 — Text Node Logic (`textNode.js`)

### Auto-Resize
Width and height are computed from the textarea content on every keystroke:
```js
const computeSize = (text) => {
  const lines = text.split('\n');
  const longestLine = Math.max(...lines.map(l => l.length), 10);
  const width  = Math.min(Math.max(220, longestLine * 8 + 60), 600);
  const height = Math.min(Math.max(80,  lines.length * 22 + 20), 400);
  return { width, height };
};
```

### Variable Handles
On every change, the text is scanned with:
```js
const regex = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;
```
Each unique match creates a `target` Handle on the left side. When the variable is removed from the text, its handle disappears automatically (React re-render).

**Example**: typing `Hello {{name}}, you are from {{city}}` produces:
- Left handle: `name`
- Left handle: `city`
- Right handle: `output` (always present)

---

## Part 4 — Backend Integration

### Frontend (`submit.js`)
1. Reads `nodes` and `edges` from Zustand store via `useStore`
2. On click, POSTs to `http://localhost:8000/pipelines/parse`:
   ```json
   { "nodes": [...], "edges": [...] }
   ```
3. Shows a modal with the response: `num_nodes`, `num_edges`, `is_dag`

### Backend (`main.py`)

**Endpoint**: `POST /pipelines/parse`

**Request body** (Pydantic):
```python
class PipelineRequest(BaseModel):
    nodes: List[Any]
    edges: List[Any]
```

**Response**:
```json
{ "num_nodes": 4, "num_edges": 3, "is_dag": true }
```

### DAG Detection Algorithm
Iterative DFS with three-color marking (avoids Python recursion limits):
- **White (0)**: unvisited
- **Gray (1)**: currently on DFS stack
- **Black (2)**: fully processed

If a gray node is encountered again → back-edge → cycle → not a DAG.

```python
def is_dag(nodes, edges) -> bool:
    adj = build_adjacency_list(nodes, edges)
    color = {n["id"]: 0 for n in nodes}
    for start in color:
        if color[start] != 0: continue
        stack = [(start, iter(adj.get(start, [])))]
        color[start] = 1
        while stack:
            node_id, neighbors = stack[-1]
            try:
                neighbor = next(neighbors)
                if color.get(neighbor) == 1: return False  # cycle!
                if color.get(neighbor) == 0:
                    color[neighbor] = 1
                    stack.append((neighbor, iter(adj.get(neighbor, []))))
            except StopIteration:
                color[node_id] = 2
                stack.pop()
    return True
```

### CORS
```python
app.add_middleware(CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"], allow_headers=["*"])
```

---

## Running Locally

### Backend
```bash
cd backend/
pip install fastapi uvicorn pydantic
uvicorn main:app --reload --port 8000
# → http://localhost:8000
```

### Frontend
```bash
cd frontend/
npm install
npm start
# → http://localhost:3000
```

### Test DAG Detection (curl)
```bash
# Valid DAG (A → B → C)
curl -X POST http://localhost:8000/pipelines/parse \
  -H "Content-Type: application/json" \
  -d '{"nodes":[{"id":"A"},{"id":"B"},{"id":"C"}],"edges":[{"source":"A","target":"B"},{"source":"B","target":"C"}]}'
# {"num_nodes":3,"num_edges":2,"is_dag":true}

# Cycle (A → B → A)
curl -X POST http://localhost:8000/pipelines/parse \
  -H "Content-Type: application/json" \
  -d '{"nodes":[{"id":"A"},{"id":"B"}],"edges":[{"source":"A","target":"B"},{"source":"B","target":"A"}]}'
# {"num_nodes":2,"num_edges":2,"is_dag":false}
```

---

## State Management (`store.js`)

Zustand store with the following shape:

| Key | Type | Description |
|-----|------|-------------|
| `nodes` | `Node[]` | All ReactFlow nodes |
| `edges` | `Edge[]` | All ReactFlow edges |
| `nodeIDs` | `{type: count}` | Counter per type for unique IDs |
| `getNodeID(type)` | `fn` | Returns next ID like `"text-3"` |
| `addNode(node)` | `fn` | Appends a node |
| `onNodesChange` | `fn` | ReactFlow change handler |
| `onEdgesChange` | `fn` | ReactFlow change handler |
| `onConnect` | `fn` | Adds smoothstep animated edge |
| `updateNodeField` | `fn` | Updates a field in node.data |
