import styles from './Submit.module.scss';
import { useState, useCallback } from 'react';
import { useToaster, Notification } from 'rsuite';
import { useStore } from './store';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const SubmitButton = () => {
  const toaster = useToaster();
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/pipelines/parse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed (${res.status})`);
      }

      const data = await res.json();
      const { num_nodes, num_edges, is_dag } = data;

      const dagDescription = is_dag
        ? 'The pipeline is a DAG (no cycles).'
        : 'The pipeline is not a DAG — it contains at least one cycle.';

      toaster.push(
        <Notification
          type={is_dag ? 'success' : 'warning'}
          header="Pipeline parse result"
          closable
          duration={8000}
        >
          <div style={{ lineHeight: 1.6 }}>
            <div>
              <strong>Nodes:</strong> {num_nodes}
            </div>
            <div>
              <strong>Edges:</strong> {num_edges}
            </div>
            <div>
              <strong>Is DAG:</strong> {is_dag ? 'Yes' : 'No'}
            </div>
            <div style={{ marginTop: 8, fontSize: 13, opacity: 0.9 }}>
              {dagDescription}
            </div>
          </div>
        </Notification>,
        { placement: 'topEnd' }
      );
    } catch (err) {
      toaster.push(
        <Notification type="error" header="Could not parse pipeline" closable duration={10000}>
          <div style={{ lineHeight: 1.5 }}>
            <div>{err?.message || String(err)}</div>
            <div style={{ marginTop: 8, fontSize: 13 }}>
              Start the API with: <code>cd backend && uvicorn main:app --reload</code>
            </div>
          </div>
        </Notification>,
        { placement: 'topEnd' }
      );
    } finally {
      setLoading(false);
    }
  }, [nodes, edges, toaster]);

  return (
    <div className={styles.submitBar}>
      <button
        type="button"
        className={styles.btnSubmit}
        onClick={handleSubmit}
        disabled={loading}
        aria-busy={loading}
      >
        <span style={{ fontSize: '18px', display: 'flex' }}>▶</span>
        {loading ? 'Submitting…' : 'Submit pipeline'}
      </button>
    </div>
  );
};
