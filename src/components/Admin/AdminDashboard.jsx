import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import './Admin.css'

export default function AdminDashboard({ user, onLogout }) {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingProject, setEditingProject] = useState(null)
    const [formData, setFormData] = useState({
        type: '',
        title: '',
        description: '',
        tags: '',
        url: '',
        color: 'primary'
    })

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) {
            setProjects(data)
        }
        setLoading(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const projectData = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
        }

        if (editingProject) {
            await supabase
                .from('projects')
                .update(projectData)
                .eq('id', editingProject.id)
        } else {
            await supabase.from('projects').insert([projectData])
        }

        setFormData({ type: '', title: '', description: '', tags: '', url: '', color: 'primary' })
        setEditingProject(null)
        fetchProjects()
    }

    const handleEdit = (project) => {
        setEditingProject(project)
        setFormData({
            type: project.type,
            title: project.title,
            description: project.description,
            tags: project.tags?.join(', ') || '',
            url: project.url || '',
            color: project.color || 'primary'
        })
    }

    const handleDelete = async (id) => {
        if (confirm('Delete this project?')) {
            await supabase.from('projects').delete().eq('id', id)
            fetchProjects()
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        onLogout()
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Project Manager</h1>
                <div className="admin-user">
                    <span>{user?.email}</span>
                    <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
                </div>
            </div>

            <div className="admin-content">
                <div className="admin-form-section">
                    <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Type</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                placeholder="e.g. Web Application"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="Project title"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-textarea"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Tags (comma-separated)</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                placeholder="React, Vite, Supabase"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">URL</label>
                            <input
                                type="url"
                                className="form-input"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                placeholder="https://project.com"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Color Theme</label>
                            <select
                                className="form-input"
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            >
                                <option value="primary">Primary (Purple)</option>
                                <option value="secondary">Secondary (Pink)</option>
                                <option value="tertiary">Tertiary (Magenta)</option>
                            </select>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">
                                {editingProject ? 'Update Project' : 'Add Project'}
                            </button>
                            {editingProject && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setEditingProject(null)
                                        setFormData({ type: '', title: '', description: '', tags: '', url: '', color: 'primary' })
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="admin-projects-list">
                    <h3>All Projects</h3>
                    {loading ? (
                        <p>Loading...</p>
                    ) : projects.length === 0 ? (
                        <p className="no-projects">No projects yet. Add your first one!</p>
                    ) : (
                        <div className="projects-table">
                            {projects.map((project) => (
                                <div key={project.id} className="project-row">
                                    <div className="project-info">
                                        <span className="project-type-badge">{project.type}</span>
                                        <strong>{project.title}</strong>
                                        <p>{project.description?.substring(0, 80)}...</p>
                                    </div>
                                    <div className="project-actions">
                                        <button onClick={() => handleEdit(project)} className="btn-icon edit">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                        </button>
                                        <button onClick={() => handleDelete(project.id)} className="btn-icon delete">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
