# VectorShift — Assessment Walkthrough

---

## Step 1 — Node Abstraction

### What was built
All nodes share a single `NodeShell` wrapper. Adding a new node is ~20 lines — no duplicated styling, no duplicated delete logic.

```
NodeShell
  ├── title bar (icon + label + delete button)
  ├── left accent strip (colour driven by `variant` prop)
  └── children (your handles + fields)
```

### TargetHandle / SourceHandle
Two named components replace direct `<Handle>` usage across every node file:
```js
// Raw ReactFlow (verbose, error-prone id formatting)
<Handle type="target" position={Position.Left} id={`${id}-query`} />
<Handle type="source" position={Position.Right} id={`${id}-results`} />

// New approach — intent is clear, id is always consistent
<TargetHandle nodeId={id} suffix="query" />
<SourceHandle nodeId={id} suffix="results" />
```
Both components live in `nodes/shared/nodeHandles.js` and auto-format the handle id as `{nodeId}-{suffix}`. An optional `style` prop handles vertical offset for multi-handle nodes, and `className` is forwarded for TextNode's inline positioning.

### 5 New Nodes (original: Input, LLM, Output, Text)

| Node | Handles | Purpose |
|---|---|---|
| Merge | 2 inputs → 1 output | Combines two streams |
| Split | 1 input → 2 outputs | Fan-out to two ports |
| Constant | 1 output | Emits a fixed value |
| Addition | 2 inputs → 1 output | Sums two inputs |
| Knowledge Base | query in → results out | RAG retriever |

### Flow — How a new node gets created
```
User drags toolbar button → onDrop fires in ui.js
  → getNodeID('merge')        returns "merge-1"
  → addNode({ id, type, position, data })
  → Zustand nodes[] updated
  → ReactFlow re-renders → MergeNode component mounts
  → NodeShell renders with variant="merge" → violet accent strip
  → TargetHandle / SourceHandle render the connection points with consistent ids
```

---

## Step 2 — Styling

### CSS Modules (`.module.scss`)
Each file has its own scoped stylesheet. `styles.body` in `NodeShell` never collides with `textStyles.body` in `TextNode` — the build hashes class names automatically.

### Design Token System (`_variables.scss`)
All colours defined as HSL CSS custom properties:
```scss
--primary: 190 90% 50%;   // one change → whole theme updates
--card:    220 15% 12%;
--border:  220 15% 20%;
```
SCSS variables map on top (`$primary: hsl(var(--primary))`) so both CSS and SCSS consumers stay in sync.

### Variant Accent Strips
Each node type gets a unique left-side colour via the `variant` prop:
```
Input / Constant / KB  →  Green   hsl(142 71% 45%)
LLM                    →  Pink    hsl(330 81% 60%)
Output                 →  Red     hsl(0 84% 60%)
Text                   →  Orange  hsl(24 95% 53%)
Merge                  →  Violet  hsl(262 83% 58%)
Split                  →  Blue    hsl(221 83% 53%)
Addition               →  Lavender hsl(252 78% 81%)
```

### Visual Details
- Glassmorphism card — `backdrop-filter: blur(12px)` + dark background + box-shadow
- All inputs / selects / buttons have `transition: all 0.2s ease` on focus + hover
- Delete button appears in the title row, turns red on hover

---

## Step 3 — TextNode: Auto-resize + Dynamic Handles

### Auto-resize flow
```
User types in textarea
  → onChange → setCurrText + updateNodeField (store sync)
  → useEffect triggers resizeToContent()
      → measures textarea scrollHeight
      → clamps height between 72px and 320px
      → estimates width: longest line × 7.5px, clamp 240–560px
      → setBoxSize({ width, height })
      → wrapper div and textarea both resize
```

### Dynamic handle flow
```
User types "{{input}}, {{name}}"
  → useMemo runs parseTemplateVariables()
      → regex finds {{ identifier }} patterns
      → deduplicates → ['input', 'name']
  → 2 <TargetHandle> components rendered (one per variable)
      → each with unique id = "{nodeId}-{variableName}"
      → each positioned inside its label row (position: relative on row)
      → className prop forwards CSS class for inline vertical centering
  → useEffect calls useUpdateNodeInternals(id)
      → tells ReactFlow to re-register the new handles
      → without this: handles are visible but connections are rejected
```

### Why `useUpdateNodeInternals` matters
ReactFlow caches handle positions in an internal lookup on mount. When new handles are added dynamically after mount, that cache is stale. `useUpdateNodeInternals` forces a refresh — this is the difference between a handle that looks connectable and one that actually is.

---

## Step 4 — Submit Pipeline

### Frontend flow (`submit.js`)
```
User clicks "Submit pipeline"
  → button disabled + shows "Submitting…"
  → reads nodes[] and edges[] from Zustand store
  → POST /pipelines/parse  { nodes, edges }
  → on success → RSuite toast notification shows:
        Nodes: 4
        Edges: 3
        Is DAG: Yes  ✅ (green) or No ⚠️ (yellow)
  → on error → toast shows error message + uvicorn start command
  → button re-enables
```

### Backend flow (`main.py`)
```
POST /pipelines/parse receives { nodes, edges }
  → Pydantic validates body
  → num_nodes = len(nodes)
  → num_edges = len(edges)
  → build adjacency list from edges
  → run iterative DFS (3-colour marking)
      UNVISITED → VISITING → VISITED
      back edge found = cycle = not a DAG
  → return { num_nodes, num_edges, is_dag }
```

### Why iterative DFS (not recursive)
Python's default recursion limit is 1000. A pipeline with 1000+ chained nodes would crash with `RecursionError` at runtime. The iterative version uses an explicit stack of `(node, iterator)` tuples — identical correctness, no stack overflow risk.

### Environment config
API URL is read from `.env` — not hardcoded:
```
REACT_APP_API_URL=http://localhost:8000
```
Same build works against dev, staging, and production by changing one env file. `.env.example` is committed as a template; `.env` is gitignored.

---

## Zustand Store — Data Flow Summary

```
Toolbar drag-drop  ──► addNode()         ──► nodes[] updated ──► canvas re-renders
User edits field   ──► updateNodeField() ──► node.data updated
User draws edge    ──► onConnect()       ──► edges[] updated ──► canvas re-renders
User deletes node  ──► removeNode()      ──► node + its edges removed atomically
Submit clicked     ──► reads nodes[] + edges[] ──► POST to backend
```

The store is the single source of truth. ReactFlow reads from it to render. The submit button reads from it to send the payload. Nothing is duplicated.

---

## Handle System — Summary of Approach

| Layer | File | Responsibility |
|---|---|---|
| `TargetHandle` | `nodeHandles.js` | Left-side input dot, formats id as `{nodeId}-{suffix}` |
| `SourceHandle` | `nodeHandles.js` | Right-side output dot, same id convention |
| Node component | e.g. `llmNode.js` | Declares which handles it needs and at what position |
| TextNode | `textNode.js` | Dynamically renders one `TargetHandle` per `{{variable}}` found in text |

Every handle id in the app follows the same `{nodeId}-{suffix}` pattern — edges in the store reference these ids for source/target handle matching.
