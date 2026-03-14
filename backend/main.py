from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any, Dict, List, Set


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {'Ping': 'Pong'}


class ParsePipelineBody(BaseModel):
    nodes: List[Dict[str, Any]] = []
    edges: List[Dict[str, Any]] = []


def _graph_is_dag(edges: List[Dict[str, Any]], vertex_ids: Set[str]) -> bool:
    """Return True if the directed graph has no cycles (is a DAG).

    Uses iterative DFS with 3-color marking to avoid Python's recursion limit.
    Pipelines with 1000+ chained nodes would crash a recursive implementation.
    """
    adj: Dict[str, List[str]] = {v: [] for v in vertex_ids}
    for e in edges:
        s, t = e.get("source"), e.get("target")
        if s is None or t is None:
            continue
        s, t = str(s), str(t)
        if s not in adj:
            adj[s] = []
        adj[s].append(t)
        if t not in adj:
            adj[t] = []

    UNVISITED, VISITING, VISITED = 0, 1, 2
    color: Dict[str, int] = {v: UNVISITED for v in adj}

    for start in adj:
        if color[start] != UNVISITED:
            continue

        # Each stack frame: (node, iterator over its neighbours)
        stack: List[tuple] = [(start, iter(adj[start]))]
        color[start] = VISITING

        while stack:
            node, neighbours = stack[-1]
            try:
                neighbour = next(neighbours)
                state = color.get(neighbour, UNVISITED)
                if state == VISITING:
                    return False  # back edge → cycle
                if state == UNVISITED:
                    color[neighbour] = VISITING
                    stack.append((neighbour, iter(adj.get(neighbour, []))))
            except StopIteration:
                # All neighbours of `node` processed — mark done and pop
                color[node] = VISITED
                stack.pop()

    return True


@app.post("/pipelines/parse")
def parse_pipeline(body: ParsePipelineBody):
    nodes = body.nodes
    edges = body.edges
    num_nodes = len(nodes)
    num_edges = len(edges)

    vertex_ids: Set[str] = set()
    for n in nodes:
        if n.get("id") is not None:
            vertex_ids.add(str(n["id"]))
    for e in edges:
        if e.get("source") is not None:
            vertex_ids.add(str(e["source"]))
        if e.get("target") is not None:
            vertex_ids.add(str(e["target"]))

    is_dag = _graph_is_dag(edges, vertex_ids) if vertex_ids else True

    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": is_dag,
    }
