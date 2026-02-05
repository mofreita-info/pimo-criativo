import { useMemo, useState } from "react";
import { useProject } from "../context/useProject";
import type { Phase, PhaseTask } from "../core/docs/projectRoadmap";
import {
  getPhaseProgress,
  getRoadmap,
  getRoadmapStats,
  saveStoredPhases,
  statusLabel,
  statusColor,
} from "../core/docs/projectRoadmap";
import { roadmapStyles } from "./ProjectRoadmapStyles";

export default function ProjectRoadmap() {
  const { actions } = useProject();
  const [phases, setPhases] = useState<Phase[]>(() => getRoadmap());
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(() => new Set());
  const [bulkStatus, setBulkStatus] = useState<PhaseTask["status"]>("done");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPhaseTitle, setNewPhaseTitle] = useState("");
  const [newPhaseDescription, setNewPhaseDescription] = useState("");

  const stats = useMemo(() => getRoadmapStats(phases), [phases]);

  const persist = (next: Phase[], message: string) => {
    setPhases(next);
    saveStoredPhases(next);
    actions.logChangelog(message);
  };

  const toggleSelectTask = (taskId: string) => {
    setSelectedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  const clearSelection = () => setSelectedTasks(new Set());

  const applyStatusToSelected = (status: PhaseTask["status"]) => {
    const next = phases.map((phase) => ({
      ...phase,
      tasks: phase.tasks.map((task) =>
        selectedTasks.has(task.id) ? { ...task, status } : task
      ),
    }));
    persist(next, `Status aplicado: ${status}`);
    clearSelection();
    setSelectionMode(false);
  };

  const deleteSelected = () => {
    const selectedArray = Array.from(selectedTasks);
    const next = phases.map((phase) => ({
      ...phase,
      tasks: phase.tasks.filter((task) => !selectedArray.includes(task.id)),
    }));
    persist(next, "Tarefas removidas");
    clearSelection();
    setSelectionMode(false);
  };

  const createPhase = () => {
    if (!newPhaseTitle.trim() || !newPhaseDescription.trim()) return;
    const nextPhase: Phase = {
      id: `phase_${Date.now()}`,
      title: newPhaseTitle.trim(),
      description: newPhaseDescription.trim(),
      status: "todo",
      tasks: [],
    };
    persist([...phases, nextPhase], `Phase: ${newPhaseTitle}`);
    setNewPhaseTitle("");
    setNewPhaseDescription("");
    setShowCreateModal(false);
  };

  return (
    <main className="roadmap-main">
      <style dangerouslySetInnerHTML={{ __html: roadmapStyles }} />

      {/* Header Bar */}
      <div className="roadmap-header-bar">
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-value">{stats.progress}%</span>
            <span className="stat-label">Progresso</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.doneTasks}</span>
            <span className="stat-label">Concluídas</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.pendingTasks}</span>
            <span className="stat-label">Pendentes</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{stats.totalTasks}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
        <h1 className="header-title">Roadmap do Projeto</h1>
      </div>

      <div className="roadmap-container">
        {/* Sidebar - Actions */}
        <aside className="roadmap-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Ações</h3>

            <button
              className={`action-btn ${selectionMode ? "active" : ""}`}
              onClick={() => {
                setSelectionMode(!selectionMode);
                if (!selectionMode) clearSelection();
              }}
            >
              {selectionMode ? "✓ Seleção Ativa" : "☑️ Selecionar"}
            </button>

            {selectionMode && selectedTasks.size > 0 && (
              <>
                <div className="selection-count">
                  {selectedTasks.size} selecionada(s)
                </div>

                <select
                  className="status-select"
                  value={bulkStatus}
                  onChange={(e) => setBulkStatus(e.target.value as PhaseTask["status"])}
                >
                  <option value="todo">A Fazer</option>
                  <option value="in_progress">Em Progresso</option>
                  <option value="done">Concluído</option>
                </select>

                <button
                  className="apply-btn"
                  onClick={() => applyStatusToSelected(bulkStatus)}
                >
                  ✓ Aplicar
                </button>

                <button className="delete-btn" onClick={deleteSelected}>
                  🗑️ Excluir
                </button>

                <button
                  className="cancel-btn"
                  onClick={() => {
                    setSelectionMode(false);
                    clearSelection();
                  }}
                >
                  ✕ Cancelar
                </button>
              </>
            )}
          </div>

          <div className="sidebar-section">
            <button
              className="create-phase-btn"
              onClick={() => setShowCreateModal(true)}
            >
              ➕ Nova Phase
            </button>
          </div>
        </aside>

        {/* Main Content - Phases and Tasks */}
        <div className="roadmap-content">
          {phases.map((phase) => (
            <div key={phase.id} className="phase-section">
              <div className="phase-header">
                <div className="phase-info">
                  <h2 className="phase-title">{phase.title}</h2>
                  <p className="phase-desc">{phase.description}</p>
                </div>
                <div className="phase-stats">
                  <span className={`status-badge ${statusColor[phase.status]}`}>
                    {statusLabel[phase.status]}
                  </span>
                  <span className="progress-percent">{getPhaseProgress(phase)}%</span>
                </div>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${getPhaseProgress(phase)}%` }}
                />
              </div>

              <div className="tasks-container">
                {phase.tasks.length === 0 ? (
                  <div className="no-tasks">Sem tarefas</div>
                ) : (
                  phase.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`task-item ${
                        selectedTasks.has(task.id) ? "selected" : ""
                      } ${selectionMode ? "selectable" : ""}`}
                      onClick={() => {
                        if (selectionMode) toggleSelectTask(task.id);
                      }}
                    >
                      {selectionMode && (
                        <input
                          type="checkbox"
                          className="task-checkbox"
                          checked={selectedTasks.has(task.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleSelectTask(task.id);
                          }}
                        />
                      )}
                      <span
                        className={`task-status-dot ${statusColor[task.status]}`}
                        title={statusLabel[task.status]}
                      />
                      <span className="task-text">{task.title}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal - Create Phase */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Criar Nova Phase</h3>
            <input
              type="text"
              className="modal-input"
              placeholder="Título"
              value={newPhaseTitle}
              onChange={(e) => setNewPhaseTitle(e.target.value)}
            />
            <input
              type="text"
              className="modal-input"
              placeholder="Descrição"
              value={newPhaseDescription}
              onChange={(e) => setNewPhaseDescription(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={() => setShowCreateModal(false)}>Cancelar</button>
              <button onClick={createPhase} className="primary">
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
