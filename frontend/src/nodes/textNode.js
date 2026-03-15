import textStyles from './TextNode.module.scss';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useUpdateNodeInternals } from 'reactflow';
import { NodeShell } from './shared/nodeShell';
import { TargetHandle, SourceHandle } from './shared/nodeHandles';
import { useStore } from '../store';

/** Valid JS identifier inside {{ ... }} (ASCII subset) */
const VAR_REGEX = /\{\{\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*\}\}/g;

export function parseTemplateVariables(text) {
  if (text == null || typeof text !== 'string') return [];
  const seen = new Set();
  const out = [];
  let m;
  const re = new RegExp(VAR_REGEX.source, 'g');
  while ((m = re.exec(text)) !== null) {
    const name = m[1];
    if (!seen.has(name)) {
      seen.add(name);
      out.push(name);
    }
  }
  return out;
}

const MIN_WIDTH = 240;
const MAX_WIDTH = 560;
const MIN_TEXT_HEIGHT = 72;
const MAX_TEXT_HEIGHT = 320;

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();
  const [currText, setCurrText] = useState(data?.text ?? '{{input}}');
  const textareaRef = useRef(null);
  const [boxSize, setBoxSize] = useState({ width: MIN_WIDTH, height: MIN_TEXT_HEIGHT });

  const wrapRef = useRef(null);
  const variables = useMemo(() => parseTemplateVariables(currText), [currText]);

  // When variables (connection handles) change, tell React Flow to recompute handle bounds.
  // Otherwise the newly added handle is not in the connection lookup and won't accept drops.
  useEffect(() => {
    updateNodeInternals(id);
  }, [id, variables, updateNodeInternals]);

  const resizeToContent = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const scrollH = el.scrollHeight;
    const height = Math.min(MAX_TEXT_HEIGHT, Math.max(MIN_TEXT_HEIGHT, scrollH + 8));

    const lines = currText.split('\n');
    const maxLineLen = Math.max(...lines.map((l) => l.length), 10);
    const charWidth = 7.5;
    const width = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.ceil(maxLineLen * charWidth) + 48));

    setBoxSize({ width, height });
    el.style.height = `${height}px`;
  }, [currText]);

  useEffect(() => {
    resizeToContent();
  }, [currText, resizeToContent]);

  const onChange = (e) => {
    const v = e.target.value;
    setCurrText(v);
    updateNodeField(id, 'text', v);
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: boxSize.width }}>
      <NodeShell id={id} title="TEXT" icon="📄" variant="text" style={{ width: '100%' }}>
        {variables.length > 0 && (
          <div className={textStyles.variablesList}>
            {variables.map((name) => (
              <div key={name} className={textStyles.variableRow}>
                <TargetHandle
                  nodeId={id}
                  suffix={name}
                  style={{ background: 'hsl(24 95% 53%)' }}
                  className={textStyles.connectionHandle}
                />
                <span className={textStyles.variableDot} />
                <span className={textStyles.variableLabel}>{name}</span>
              </div>
            ))}
          </div>
        )}

        <div className={textStyles.body}>
          <label className={textStyles.label}>Text:</label>
          <textarea
            ref={textareaRef}
            className={textStyles.textarea}
            value={currText}
            onChange={onChange}
            spellCheck={false}
            rows={3}
            style={{
              width: '100%',
              minHeight: MIN_TEXT_HEIGHT,
              maxHeight: MAX_TEXT_HEIGHT,
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </NodeShell>

      <SourceHandle
        nodeId={id}
        suffix="output"
        style={{ background: 'hsl(24 95% 53%)' }}
      />
    </div>
  );
};
