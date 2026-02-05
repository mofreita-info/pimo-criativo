export const roadmapStyles = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.roadmap-main {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1a2a45 100%);
  color: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  display: flex;
  flex-direction: column;
}

/* Header Bar */
.roadmap-header-bar {
  background: rgba(30, 41, 59, 0.9);
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.header-stats {
  display: flex;
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #3b82f6;
}

.stat-label {
  font-size: 0.7rem;
  color: #94a3b8;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.header-title {
  font-size: 1.5rem;
  font-weight: 700;
  flex: 1;
}

/* Main Container */
.roadmap-container {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  flex: 1;
  overflow: hidden;
}

/* Sidebar */
.roadmap-sidebar {
  width: 150px;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 1rem;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sidebar-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.action-btn {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #93c5fd;
  padding: 0.6rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
}

.action-btn:hover {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.5);
}

.action-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.selection-count {
  font-size: 0.75rem;
  background: rgba(59, 130, 246, 0.15);
  border: 1px dashed rgba(59, 130, 246, 0.3);
  color: #93c5fd;
  padding: 0.5rem;
  border-radius: 4px;
  text-align: center;
}

.status-select {
  width: 100%;
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  padding: 0.5rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.apply-btn {
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.4);
  color: #86efac;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s;
}

.apply-btn:hover {
  background: rgba(34, 197, 94, 0.3);
}

.delete-btn {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #fecaca;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.3);
}

.cancel-btn {
  background: rgba(100, 116, 139, 0.2);
  border: 1px solid rgba(100, 116, 139, 0.4);
  color: #cbd5e1;
  padding: 0.5rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
}

.cancel-btn:hover {
  background: rgba(100, 116, 139, 0.3);
}

.create-phase-btn {
  width: 100%;
  background: linear-gradient(135deg, #3b82f6, #22c55e);
  border: none;
  color: white;
  padding: 0.7rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 700;
  transition: all 0.2s;
}

.create-phase-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* Content Area */
.roadmap-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.roadmap-content::-webkit-scrollbar {
  width: 6px;
}

.roadmap-content::-webkit-scrollbar-track {
  background: rgba(51, 65, 85, 0.3);
  border-radius: 3px;
}

.roadmap-content::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.4);
  border-radius: 3px;
}

.roadmap-content::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.6);
}

/* Phase Section */
.phase-section {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 8px;
  padding: 0.8rem;
  overflow: hidden;
}

.phase-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.6rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
}

.phase-info {
  flex: 1;
}

.phase-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.2rem;
}

.phase-desc {
  font-size: 0.75rem;
  color: #cbd5e1;
  opacity: 0.8;
}

.phase-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.status-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.3rem 0.5rem;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.status-badge.todo {
  background: rgba(253, 230, 138, 0.15);
  color: #fde047;
}

.status-badge.in_progress {
  background: rgba(59, 130, 246, 0.15);
  color: #93c5fd;
}

.status-badge.done {
  background: rgba(34, 197, 94, 0.15);
  color: #86efac;
}

.progress-percent {
  font-size: 0.8rem;
  font-weight: 700;
  color: #3b82f6;
  min-width: 40px;
  text-align: right;
}

/* Progress Bar */
.progress-bar {
  width: 100%;
  height: 4px;
  background: rgba(51, 65, 85, 0.6);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.6rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #22c55e);
  transition: width 0.4s ease;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
}

/* Tasks Container */
.tasks-container {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  max-height: 250px;
  overflow-y: auto;
}

.tasks-container::-webkit-scrollbar {
  width: 4px;
}

.tasks-container::-webkit-scrollbar-track {
  background: transparent;
}

.tasks-container::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 2px;
}

.no-tasks {
  font-size: 0.75rem;
  color: #64748b;
  text-align: center;
  padding: 0.8rem 0;
  font-style: italic;
}

/* Task Item */
.task-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.6rem;
  background: rgba(51, 65, 85, 0.4);
  border: 1px solid rgba(59, 130, 246, 0.08);
  border-radius: 4px;
  transition: all 0.15s;
  cursor: default;
}

.task-item.selectable {
  cursor: pointer;
}

.task-item:hover {
  background: rgba(51, 65, 85, 0.6);
  border-color: rgba(59, 130, 246, 0.2);
}

.task-item.selected {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.3);
}

.task-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  flex-shrink: 0;
  accent-color: #3b82f6;
}

.task-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.task-status-dot.todo {
  background: #fde047;
}

.task-status-dot.in_progress {
  background: #3b82f6;
}

.task-status-dot.done {
  background: #22c55e;
}

.task-text {
  font-size: 0.8rem;
  color: #e2e8f0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.modal-box h3 {
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  color: #f8fafc;
}

.modal-input {
  width: 100%;
  background: rgba(51, 65, 85, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  font-size: 0.95rem;
}

.modal-input::placeholder {
  color: #94a3b8;
}

.modal-input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(51, 65, 85, 0.8);
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.modal-actions button {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.modal-actions button:first-child {
  background: rgba(100, 116, 139, 0.2);
  color: #cbd5e1;
}

.modal-actions button:first-child:hover {
  background: rgba(100, 116, 139, 0.3);
}

.modal-actions button.primary {
  background: linear-gradient(135deg, #3b82f6, #22c55e);
  color: white;
  border: none;
}

.modal-actions button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .roadmap-container {
    gap: 0.8rem;
    padding: 0.8rem;
  }

  .roadmap-sidebar {
    width: 120px;
  }
}

@media (max-width: 768px) {
  .roadmap-header-bar {
    padding: 0.8rem;
    gap: 1rem;
  }

  .header-stats {
    gap: 1rem;
  }

  .roadmap-container {
    flex-direction: column;
  }

  .roadmap-sidebar {
    width: 100%;
    height: auto;
    position: static;
  }

  .phase-section {
    padding: 0.6rem;
  }

  .tasks-container {
    max-height: 200px;
  }
}
`;
