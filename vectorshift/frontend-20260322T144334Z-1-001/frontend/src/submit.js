// submit.js  — Part 4: POST pipeline to backend + show result modal
import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({ nodes: state.nodes, edges: state.edges });

export const SubmitButton = () => {
    const { nodes, edges } = useStore(selector, shallow);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nodes, edges }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message || 'Failed to connect to the backend.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="submit-bar">
                <button
                    className="submit-btn"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Analyzing…' : '⚡ Submit Pipeline'}
                </button>
            </div>

            {/* Result Modal */}
            {result && (
                <div className="modal-overlay" onClick={() => setResult(null)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-card__title">Pipeline Analysis</div>

                        <div className="modal-card__stat">
                            <span className="modal-card__stat-label">Nodes</span>
                            <span className="modal-card__stat-value">{result.num_nodes}</span>
                        </div>
                        <div className="modal-card__stat">
                            <span className="modal-card__stat-label">Edges</span>
                            <span className="modal-card__stat-value">{result.num_edges}</span>
                        </div>
                        <div className="modal-card__stat">
                            <span className="modal-card__stat-label">Valid DAG?</span>
                            <span className={`modal-card__stat-value is-dag-${result.is_dag}`}>
                                {result.is_dag ? '✓ Yes — acyclic' : '✗ No — contains cycle'}
                            </span>
                        </div>

                        <div className="modal-card__actions">
                            <button className="modal-card__close-btn" onClick={() => setResult(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {error && (
                <div className="modal-overlay" onClick={() => setError(null)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-card__title" style={{ color: '#ef4444' }}>
                            ⚠ Connection Error
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
                            {error}
                        </p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            Make sure the backend is running at <code>http://localhost:8000</code>
                        </p>
                        <div className="modal-card__actions">
                            <button className="modal-card__close-btn" onClick={() => setError(null)}>
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
