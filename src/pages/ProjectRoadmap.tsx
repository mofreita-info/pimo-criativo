import { useMemo, useState } from "react";
import Panel from "../components/ui/Panel";
import { useProject } from "../context/useProject";
import type { Phase, PhaseTask, RoadmapStats } from "../core/docs/projectRoadmap";
import {
  getCurrentPhase,
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
  const [newPhaseTitle, setNewPhaseTitle] = useState("");
  const [newPhaseDescription, setNewPhaseDescription] = useState("");
  const [newPhaseNotes, setNewPhaseNotes] = useState("");

  const stats = useMemo<RoadmapStats>(() => getRoadmapStats(phases), [phases]);
  const currentPhase = useMemo(() => getCurrentPhase(phases), [phases]);

  const persist = (next: Phase[], message: string) => {
    setPhases(next);
    saveStoredPhases(next);
    actions.logChangelog(message);
  };

  const updateTask = (
    phaseId: string,
    taskId: string,
    updater: (task: PhaseTask) => PhaseTask
  ) => {
    setPhases((prev) =>
      prev.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              tasks: phase.tasks.map((task) =>
                task.id === taskId ? updater(task) : task
              ),
            }
          : phase
      )
    );
  };

  const handleSavePhase = (phaseId: string) => {
    persist(phases, `Phase atualizada: ${phaseId}`);
  };

  const handleAddPhase = () => {
    const title = newPhaseTitle.trim();
    const description = newPhaseDescription.trim();
    if (!title || !description) return;
    const nextPhase: Phase = {
      id: `phase_${Date.now()}`,
      title,
      description,
      notes: newPhaseNotes.trim() || undefined,
      status: "todo",
      tasks: [],
    };
    const next = [...phases, nextPhase];
    persist(next, `Nova Phase criada: ${title}`);
    setNewPhaseTitle("");
    setNewPhaseDescription("");
    setNewPhaseNotes("");
  };

  const handleAddTask = (phaseId: string) => {
    const task: PhaseTask = {
      id: `task_${Date.now()}`,
      title: "Nova tarefa",
      description: "Descreva a tarefa",
      status: "todo",
    };
    const next = phases.map((phase) =>
      phase.id === phaseId ? { ...phase, tasks: [...phase.tasks, task] } : phase
    );
    persist(next, `Tarefa criada em ${phaseId}`);
  };

  const handleDeleteTask = (phaseId: string, taskId: string) => {
    const next = phases.map((phase) =>
      phase.id === phaseId
        ? { ...phase, tasks: phase.tasks.filter((task) => task.id !== taskId) }
        : phase
    );
    persist(next, `Tarefa removida: ${taskId}`);
  };

  const handleStatusChange = (phaseId: string, taskId: string, status: PhaseTask["status"]) => {
    updateTask(phaseId, taskId, (task) => ({ ...task, status }));
    persist(
      phases.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              tasks: phase.tasks.map((task) =>
                task.id === taskId ? { ...task, status } : task
              ),
            }
          : phase
      ),
      `Status atualizado: ${taskId} → ${statusLabel[status]}`
    );
  };

  return (
    <main className="page-root">
      <style dangerouslySetInnerHTML={{ __html: roadmapStyles }} />
      <div className="roadmap-container">
        {/* Left Sidebar - Fixed Stats Panel */}
        <aside className="sidebar-esquerda">
          <Panel title="Estatísticas Rápidas">
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                    <path d="M2 17L12 22L22 17"/>
                    <path d="M2 12L12 17L22 12"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalPhases}</div>
                  <div className="stat-label">Fases Concluídas</div>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                    <path d="M2 17L12 22L22 17"/>
                    <path d="M2 12L12 17L22 12"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.progress}%</div>
                  <div className="stat-label">Progresso Global</div>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                    <path d="M2 17L12 22L22 17"/>
                    <path d="M2 12L12 17L22 12"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.pendingTasks}</div>
                  <div className="stat-label">Tarefas Pendentes</div>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                    <path d="M2 17L12 22L22 17"/>
                    <path d="M2 12L12 17L22 12"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.totalTasks}</div>
                  <div className="stat-label">Total de Tarefas</div>
                </div>
              </div>

              <div className="stat-item">
                <div className="stat-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
                    <path d="M2 17L12 22L22 17"/>
                    <path d="M2 12L12 17L22 12"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stats.doneTasks}</div>
                  <div className="stat-label">Tarefas Concluídas</div>
                </div>
              </div>
            </div>
          </Panel>
        </aside>

        {/* Center Column - Main Timeline */}
        <main className="coluna-central">
          <Panel title="Timeline das Phases">
            <div className="timeline">
              {phases.map((phase) => (
                <div key={phase.id} className="timeline-item">
                  <div className="timeline-header">
                    <div className="timeline-title">{phase.title}</div>
                    <div className="timeline-status">
                      <span className={`status-badge ${statusColor[phase.status]}`}>
                        {statusLabel[phase.status]}
                      </span>
                    </div>
                  </div>
                  <div className="timeline-description">{phase.description}</div>
                  <div className="timeline-progress">
                    <div className="progress-track">
                      <div
                        className="progress-bar"
                        style={{ width: `${getPhaseProgress(phase)}%` }}
                      />
                    </div>
                    <div className="muted-text">
                      Progresso: {getPhaseProgress(phase)}%
                    </div>
                  </div>
                  <div className="timeline-tasks">
                    {phase.tasks.map((task) => (
                      <div key={task.id} className="task-item">
                        <div className="task-status">
                          <span className={`status-badge ${statusColor[task.status]}`}>
                            {statusLabel[task.status]}
                          </span>
                        </div>
                        <div className="task-title">{task.title}</div>
                        <div className="task-actions">
                          <select
                            className="select select-xs"
                            value={task.status}
                            onChange={(event) =>
                              handleStatusChange(
                                phase.id,
                                task.id,
                                event.target.value as PhaseTask["status"]
                              )
                            }
                          >
                            <option value="todo">A Fazer</option>
                            <option value="in_progress">Em Progresso</option>
                            <option value="done">Concluído</option>
                          </select>
                          <button
                            className="button button-ghost"
                            onClick={() => handleDeleteTask(phase.id, task.id)}
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </main>

        {/* Right Column - Phase Details */}
        <section className="coluna-direita">
          <Panel title="Phase Atual">
            {currentPhase ? (
              <div className="phase-details">
                <div className="phase-title">{currentPhase.title}</div>
                <div className="phase-description">{currentPhase.description}</div>
                <div className="phase-progress">
                  <div className="progress-track">
                    <div
                      className="progress-bar"
                      style={{ width: `${getPhaseProgress(currentPhase)}%` }}
                    />
                  </div>
                  <div className="muted-text">
                    Progresso: {getPhaseProgress(currentPhase)}%
                  </div>
                </div>
                <div className="phase-actions">
                  <button className="button button-primary" onClick={() => handleAddTask(currentPhase.id)}>
                    Adicionar Tarefa
                  </button>
                  <button className="button button-secondary" onClick={() => handleSavePhase(currentPhase.id)}>
                    Guardar Phase
                  </button>
                </div>
              </div>
            ) : (
              <div className="phase-details">
                <div className="muted-text">Nenhuma phase disponível. Crie uma nova phase.</div>
              </div>
            )}
          </Panel>

          <Panel title="Criar Nova Phase">
            <div className="new-phase-form">
              <input
                className="input"
                placeholder="Título da Phase"
                value={newPhaseTitle}
                onChange={(event) => setNewPhaseTitle(event.target.value)}
              />
              <input
                className="input"
                placeholder="Descrição da Phase"
                value={newPhaseDescription}
                onChange={(event) => setNewPhaseDescription(event.target.value)}
              />
              <textarea
                className="textarea"
                placeholder="Notas (opcional)"
                value={newPhaseNotes}
                onChange={(event) => setNewPhaseNotes(event.target.value)}
              />
              <button className="button button-primary" onClick={handleAddPhase}>
                Criar Phase
              </button>
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}