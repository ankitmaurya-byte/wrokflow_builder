"""
main.py — VectorShift FastAPI Backend
Part 4: /pipelines/parse endpoint with DAG detection
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Any

app = FastAPI(title="VectorShift Pipeline API")

# Allow requests from the React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


# ── Request Schema ────────────────────────────────────────────────────────────

class PipelineRequest(BaseModel):
    nodes: List[Any]
    edges: List[Any]


# ── DAG Detection via DFS ─────────────────────────────────────────────────────

def is_dag(nodes: list, edges: list) -> bool:
    """
    Returns True if the directed graph formed by nodes+edges is acyclic (a DAG).
    Uses iterative DFS with three-color marking:
      white (0) = unvisited
      gray  (1) = currently in the DFS stack (back-edge → cycle)
      black (2) = fully processed
    """
    # Build adjacency list from edge source → target
    adj: dict[str, list[str]] = {node["id"]: [] for node in nodes}
    for edge in edges:
        src = edge.get("source")
        tgt = edge.get("target")
        if src in adj:
            adj[src].append(tgt)
        else:
            adj[src] = [tgt]

    color: dict[str, int] = {node["id"]: 0 for node in nodes}

    for start in list(color.keys()):
        if color[start] != 0:
            continue
        # Iterative DFS using an explicit stack
        # Stack items: (node_id, iterator_over_neighbors)
        stack = [(start, iter(adj.get(start, [])))]
        color[start] = 1  # gray

        while stack:
            node_id, neighbors = stack[-1]
            try:
                neighbor = next(neighbors)
                if color.get(neighbor, 0) == 1:
                    return False  # back-edge found → cycle
                if color.get(neighbor, 0) == 0:
                    color[neighbor] = 1  # gray
                    stack.append((neighbor, iter(adj.get(neighbor, []))))
            except StopIteration:
                color[node_id] = 2  # black
                stack.pop()

    return True


# ── Endpoint ──────────────────────────────────────────────────────────────────

@app.post("/pipelines/parse")
def parse_pipeline(pipeline: PipelineRequest):
    nodes = pipeline.nodes
    edges = pipeline.edges

    num_nodes = len(nodes)
    num_edges = len(edges)
    dag = is_dag(nodes, edges)

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag":    dag,
    }
