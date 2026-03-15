import styles from './UI.module.scss';
import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { MergeNode } from './nodes/mergeNode';
import { SplitNode } from './nodes/splitNode';
import { ConstantNode } from './nodes/constantNode';
import { AdditionNode } from './nodes/additionNode';
import { KnowledgeBaseNode } from './nodes/knowledgeBaseNode';
import { DefaultPipelineNode } from './nodes/defaultNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

// Approximate node shell size — used to center node under cursor on drop
const NODE_WIDTH = 240; // Updated to match SCSS variables
const NODE_HEIGHT = 100;

const nodeTypes = {
  default: DefaultPipelineNode,
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  merge: MergeNode,
  split: SplitNode,
  constant: ConstantNode,
  addition: AdditionNode,
  knowledgeBase: KnowledgeBaseNode,
};

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const nodes = useStore((s) => s.nodes);
  const edges = useStore((s) => s.edges);
  const getNodeID = useStore((s) => s.getNodeID);
  const addNode = useStore((s) => s.addNode);
  const onNodesChange = useStore((s) => s.onNodesChange);
  const onEdgesChange = useStore((s) => s.onEdgesChange);
  const onConnect = useStore((s) => s.onConnect);

  const getInitNodeData = (type) => ({
    nodeType: `${type}`,
  });

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!reactFlowInstance || !reactFlowWrapper.current) return;

      const data = event.dataTransfer?.getData('application/reactflow');
      if (!data) return;

      let appData;
      try {
        appData = JSON.parse(data);
      } catch {
        return;
      }
      const type = appData?.nodeType;
      if (type == null || type === '') return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;

      let position = reactFlowInstance.project({ x, y });
      if (!Number.isFinite(position.x) || !Number.isFinite(position.y)) return;

      position = {
        x: position.x - NODE_WIDTH / 2,
        y: position.y - NODE_HEIGHT / 2,
      };

      const nodeID = getNodeID(type);
      addNode({
        id: nodeID,
        type,
        position,
        data: getInitNodeData(type),
      });
    },
    [reactFlowInstance, getNodeID, addNode]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'move';
  }, []);

    return (
        <div ref={reactFlowWrapper} className={styles.wrap}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
                className={styles.canvas}
            >
                <Background color="#aaa" gap={gridSize} />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    )
}
