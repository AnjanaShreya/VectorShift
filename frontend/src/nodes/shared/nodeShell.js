import styles from './NodeShell.module.scss';
import { useStore } from '../../store';

export function NodeShell({ id, title, icon, variant = 'default', className = '', style, children }) {
  const removeNode = useStore((state) => state.removeNode);
  const rootClass = [
    styles.nodeShell, 
    styles[variant], 
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={rootClass} style={style}>
      {title != null && (
        <div className={styles.title}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <span>{title}</span>
          <button 
            className={styles.deleteButton} 
            onClick={() => removeNode(id)}
            title="Remove node"
          >
            ✕
          </button>
        </div>
      )}
      <div className={styles.body}>
        {children}
      </div>
    </div>
  );
}
