import textStyles from './TextNode.module.scss';
import { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeShell } from './shared/nodeShell';
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
const LINE_HEIGHT = 18;

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const [currText, setCurrText] = useState(data?.text ?? '{{input}}');
  const textareaRef = useRef(null);
  const [boxSize, setBoxSize] = useState({ width: MIN_WIDTH, height: MIN_TEXT_HEIGHT });

  // wrapRef is the positioning context for all Handle components.
  // rowRefs maps variable name → its DOM row element so we can measure center Y.
  const wrapRef = useRef(null);
  const rowRefs = useRef({});
  const [handleTops, setHandleTops] = useState({});

  const variables = useMemo(() => parseTemplateVariables(currText), [currText]);

  // After every render that could change layout, measure each variable row's
  // center Y relative to the wrapper.
  // Uses offsetTop (CSS layout coordinates) instead of getBoundingClientRect
  // so handle positions are correct at any ReactFlow zoom level.
  const measureHandleTops = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const tops = {};
    variables.forEach((name) => {
      const row = rowRefs.current[name];
      if (!row) return;
      // Accumulate offsetTop up the offsetParent chain until we reach wrap.
      let el = row;
      let top = el.offsetTop + el.offsetHeight / 2;
      while (el.offsetParent && el.offsetParent !== wrap) {
        el = el.offsetParent;
        top += el.offsetTop;
      }
      tops[name] = top;
    });
    setHandleTops(tops);
  }, [variables]);

  useLayoutEffect(() => {
    measureHandleTops();
  }, [variables, boxSize, measureHandleTops]);

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
    // wrapRef is the CSS positioning context for all Handle components.
    // Target handles are rendered AFTER NodeShell so they sit above it in the
    // stacking order — NodeShell's backdrop-filter creates a stacking context
    // that would otherwise intercept pointer events on handles rendered before it.
    <div ref={wrapRef} style={{ position: 'relative', width: boxSize.width }}>

      <NodeShell id={id} title="TEXT" icon="📄" variant="text" style={{ width: '100%' }}>
        {variables.length > 0 && (
          <div className={textStyles.variablesList}>
            {variables.map((name) => (
              <div
                key={name}
                ref={(el) => { rowRefs.current[name] = el; }}
                className={textStyles.variableRow}
              >
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
              lineHeight: `${LINE_HEIGHT}px`,
            }}
          />
        </div>
      </NodeShell>

      {/* Rendered after NodeShell so they sit above its stacking context */}
      {variables.map((name) => (
        <Handle
          key={name}
          type="target"
          position={Position.Left}
          id={`${id}-${name}`}
          isConnectable={true}
          style={{
            top: handleTops[name] !== undefined ? handleTops[name] : '50%',
            background: 'hsl(24 95% 53%)',
          }}
        />
      ))}

      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        isConnectable={true}
        style={{ background: 'hsl(24 95% 53%)' }}
      />
    </div>
  );
};
