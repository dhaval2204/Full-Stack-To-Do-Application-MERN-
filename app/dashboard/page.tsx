"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/components/AuthContext";

interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
}

type FilterType = "all" | "pending" | "completed";

const PRIORITY_COLORS = {
  low: "#34d399",
  medium: "#fbbf24",
  high: "#f87171",
};

const PRIORITY_BG = {
  low: "rgba(52,211,153,0.12)",
  medium: "rgba(251,191,36,0.12)",
  high: "rgba(248,113,113,0.12)",
};

export default function DashboardPage() {
  const { user, token, logout, loading: authLoading } = useAuth();
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Add task form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "medium" });
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  // Edit task
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", priority: "medium" });
  const [editLoading, setEditLoading] = useState(false);

  // Delete confirm
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const authHeaders = { Authorization: `Bearer ${token}` };

  const fetchTasks = useCallback(async () => {
    if (!token) return;
    setLoadingTasks(true);
    try {
      const res = await axios.get(`/api/tasks?filter=${filter}`, { headers: authHeaders });
      setTasks(res.data.tasks);
    } catch {
      // handle silently
    } finally {
      setLoadingTasks(false);
    }
  }, [token, filter]);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (token) fetchTasks();
  }, [fetchTasks, token]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return setAddError("Task title is required");
    setAddError("");
    setAddLoading(true);
    try {
      await axios.post("/api/tasks", newTask, { headers: authHeaders });
      setNewTask({ title: "", description: "", priority: "medium" });
      setShowAddForm(false);
      fetchTasks();
    } catch (err: any) {
      setAddError(err?.response?.data?.message || "Failed to create task");
    } finally {
      setAddLoading(false);
    }
  };

  const toggleComplete = async (task: Task) => {
    try {
      await axios.put(`/api/tasks/${task._id}`, { completed: !task.completed }, { headers: authHeaders });
      fetchTasks();
    } catch {}
  };

  const startEdit = (task: Task) => {
    setEditingId(task._id);
    setEditForm({ title: task.title, description: task.description || "", priority: task.priority });
  };

  const handleEditSave = async (taskId: string) => {
    if (!editForm.title.trim()) return;
    setEditLoading(true);
    try {
      await axios.put(`/api/tasks/${taskId}`, editForm, { headers: authHeaders });
      setEditingId(null);
      fetchTasks();
    } catch {}
    setEditLoading(false);
  };

  const handleDelete = async (taskId: string) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`, { headers: authHeaders });
      setDeletingId(null);
      fetchTasks();
    } catch {}
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
  };

  if (authLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
      </div>
    );
  }

  return (
    <div className="bg-grid" style={{ minHeight: "100vh" }}>
      <div style={{ position: "fixed", top: 0, right: 0, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,106,247,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Navbar */}
      <nav style={{ background: "rgba(10,10,15,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg, #7c6af7, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>✓</div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "-0.3px" }}>TaskFlow</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #7c6af7, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-muted)" }}>{user?.name}</span>
            </div>
            <button onClick={logout} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 14px", color: "var(--text-muted)", fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--danger)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div className="animate-fade-up" style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 4 }}>
            My Tasks
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Stats Row */}
        <div className="animate-fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32, animationDelay: "0.05s" }}>
          {[
            { label: "Total Tasks", value: stats.total, color: "#7c6af7", icon: "📋" },
            { label: "Completed", value: stats.completed, color: "#34d399", icon: "✅" },
            { label: "Pending", value: stats.pending, color: "#fbbf24", icon: "⏳" },
          ].map((stat) => (
            <div key={stat.label} className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 28 }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="animate-fade-up" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12, animationDelay: "0.1s" }}>
          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 4, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: 4 }}>
            {(["all", "pending", "completed"] as FilterType[]).map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "7px 18px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
                background: filter === f ? "linear-gradient(135deg, #7c6af7, #a78bfa)" : "transparent",
                color: filter === f ? "white" : "var(--text-muted)",
                transition: "all 0.2s",
                textTransform: "capitalize",
              }}>
                {f}
              </button>
            ))}
          </div>

          {/* Add Task button */}
          <button className="btn-primary" onClick={() => { setShowAddForm(!showAddForm); setAddError(""); setNewTask({ title: "", description: "", priority: "medium" }); }} style={{ padding: "10px 20px" }}>
            {showAddForm ? "✕ Cancel" : "+ Add Task"}
          </button>
        </div>

        {/* Add Task Form */}
        {showAddForm && (
          <div className="card animate-slide-down" style={{ padding: 24, marginBottom: 20, border: "1px solid rgba(124,106,247,0.3)", boxShadow: "0 0 0 1px rgba(124,106,247,0.1)" }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: "var(--accent2)" }}>New Task</h3>
            <form onSubmit={handleAddTask} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input
                className="input-field"
                type="text"
                placeholder="What needs to be done?"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                autoFocus
              />
              <textarea
                className="input-field"
                placeholder="Description (optional)"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                rows={2}
                style={{ resize: "vertical" }}
              />
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Priority</label>
                  <select
                    className="input-field"
                    value={newTask.priority}
                    onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>
                <div style={{ paddingTop: 22 }}>
                  <button className="btn-primary" type="submit" disabled={addLoading} style={{ padding: "12px 28px" }}>
                    {addLoading ? <><div className="spinner" />Adding...</> : "Add Task"}
                  </button>
                </div>
              </div>
              {addError && <p style={{ color: "var(--danger)", fontSize: 13 }}>⚡ {addError}</p>}
            </form>
          </div>
        )}

        {/* Task List */}
        <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
          {loadingTasks ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60 }}>
              <div style={{ textAlign: "center" }}>
                <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3, margin: "0 auto 12px" }} />
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading tasks...</p>
              </div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="card" style={{ padding: 60, textAlign: "center" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>📭</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>No tasks found</h3>
              <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                {filter === "all" ? "Add your first task to get started!" : `No ${filter} tasks.`}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {tasks.map((task, i) => (
                <div
                  key={task._id}
                  className="card"
                  style={{
                    padding: "18px 20px",
                    opacity: task.completed ? 0.75 : 1,
                    animation: `fadeUp 0.3s ease forwards`,
                    animationDelay: `${i * 0.04}s`,
                    borderLeft: `3px solid ${PRIORITY_COLORS[task.priority]}`,
                    transition: "all 0.2s",
                  }}
                >
                  {editingId === task._id ? (
                    /* Edit Mode */
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <input
                        className="input-field"
                        value={editForm.title}
                        onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                        autoFocus
                        style={{ padding: "10px 14px" }}
                      />
                      <textarea
                        className="input-field"
                        value={editForm.description}
                        onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                        rows={2}
                        placeholder="Description (optional)"
                        style={{ resize: "vertical", padding: "10px 14px" }}
                      />
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <select
                          className="input-field"
                          value={editForm.priority}
                          onChange={e => setEditForm({ ...editForm, priority: e.target.value })}
                          style={{ maxWidth: 160, padding: "9px 14px" }}
                        >
                          <option value="low">🟢 Low</option>
                          <option value="medium">🟡 Medium</option>
                          <option value="high">🔴 High</option>
                        </select>
                        <button className="btn-primary" onClick={() => handleEditSave(task._id)} disabled={editLoading} style={{ padding: "9px 20px", fontSize: 14 }}>
                          {editLoading ? <><div className="spinner" style={{ width: 16, height: 16 }} />Saving...</> : "✓ Save"}
                        </button>
                        <button className="btn-secondary" onClick={() => setEditingId(null)} style={{ padding: "9px 16px", fontSize: 14 }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleComplete(task)}
                        style={{
                          flexShrink: 0, width: 22, height: 22, borderRadius: 6,
                          border: task.completed ? "none" : `2px solid var(--border)`,
                          background: task.completed ? "linear-gradient(135deg, #7c6af7, #a78bfa)" : "transparent",
                          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                          marginTop: 2, transition: "all 0.2s",
                        }}
                      >
                        {task.completed && <span style={{ color: "white", fontSize: 13, fontWeight: 700 }}>✓</span>}
                      </button>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <span style={{
                            fontSize: 15, fontWeight: 500,
                            textDecoration: task.completed ? "line-through" : "none",
                            color: task.completed ? "var(--text-muted)" : "var(--text)",
                            wordBreak: "break-word",
                          }}>
                            {task.title}
                          </span>
                          <span style={{
                            fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                            background: PRIORITY_BG[task.priority],
                            color: PRIORITY_COLORS[task.priority],
                            textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0,
                          }}>
                            {task.priority}
                          </span>
                          {task.completed && (
                            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "rgba(52,211,153,0.1)", color: "#34d399", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                              Done
                            </span>
                          )}
                        </div>
                        {task.description && (
                          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4, lineHeight: 1.5 }}>{task.description}</p>
                        )}
                        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6, opacity: 0.6 }}>
                          {new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        {deletingId === task._id ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Delete?</span>
                            <button onClick={() => handleDelete(task._id)} style={{ padding: "5px 12px", borderRadius: 7, border: "none", background: "var(--danger)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Yes</button>
                            <button onClick={() => setDeletingId(null)} style={{ padding: "5px 12px", borderRadius: 7, border: "1px solid var(--border)", background: "transparent", color: "var(--text-muted)", fontSize: 13, cursor: "pointer" }}>No</button>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(task)}
                              style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface2)", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                              title="Edit task"
                              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent2)"; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "inherit"; }}
                            >✏</button>
                            <button
                              onClick={() => setDeletingId(task._id)}
                              style={{ width: 34, height: 34, borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface2)", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                              title="Delete task"
                              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--danger)"; e.currentTarget.style.color = "var(--danger)"; }}
                              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "inherit"; }}
                            >🗑</button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Progress bar */}
        {stats.total > 0 && (
          <div className="animate-fade-up card" style={{ marginTop: 24, padding: "16px 20px", animationDelay: "0.2s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
              <span style={{ color: "var(--text-muted)" }}>Overall Progress</span>
              <span style={{ fontWeight: 600 }}>{Math.round((stats.completed / stats.total) * 100)}%</span>
            </div>
            <div style={{ height: 6, background: "var(--surface2)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${(stats.completed / stats.total) * 100}%`,
                background: "linear-gradient(90deg, #7c6af7, #a78bfa)",
                borderRadius: 99,
                transition: "width 0.6s ease",
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
