import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectService, taskService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import AddMemberModal from '../Modals/AddMemberModal';
import SearchBar from '../Search/SearchBar';
import './ProjectBoard.scss';

interface User {
    _id: string;
    name: string;
    email: string;
    picture?: string;
}

interface ProjectMember {
    user: User;
    role: 'owner' | 'member' | 'viewer';
    joinedAt: string;
}

interface GithubRepo {
    owner: string;
    name: string;
    fullName: string;
    url: string;
}

interface Project {
    _id: string;
    name: string;
    description: string;
    status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
    startDate: string;
    endDate?: string;
    owner: User;
    members: ProjectMember[];
    githubRepo?: GithubRepo;
    createdAt: string;
    updatedAt: string;
}

interface Task {
    _id: string;
    title: string;
    description?: string;
    status: 'to-do' | 'in-progress' | 'in-review' | 'completed';
    priority: 'low' | 'medium' | 'high';
    project: string;
    assignedTo?: User;
    dueDate?: string;
    completedAt?: string;
    githubIssue?: {
        id: number;
        number: number;
        url: string;
    };
    createdBy: User;
    createdAt: string;
    updatedAt: string;
}

interface ProjectDetailProps {
    projectId: string;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId }) => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [taskSearchTerm, setTaskSearchTerm] = useState<string>('');

    useEffect(() => {
        const fetchProjectAndTasks = async () => {
            try {
                setLoading(true);

                // Fetch project details
                const projectResponse = await projectService.getProject(projectId);
                setProject(projectResponse.data.data);

                // Fetch project tasks
                const tasksResponse = await taskService.getProjectTasks(projectId);
                setTasks(tasksResponse.data.data);

                setError(null);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load project');
                console.error('Error loading project:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjectAndTasks();
    }, [projectId]);

    // Filter tasks based on search term
    const filteredTasks = useMemo(() => {
        if (!taskSearchTerm.trim()) {
            return tasks;
        }
        
        const searchLower = taskSearchTerm.toLowerCase().trim();
        
        return tasks.filter(task => 
            task.title.toLowerCase().includes(searchLower) ||
            (task.description && task.description.toLowerCase().includes(searchLower)) ||
            task.status.toLowerCase().includes(searchLower) ||
            task.priority.toLowerCase().includes(searchLower) ||
            (task.assignedTo && task.assignedTo.name.toLowerCase().includes(searchLower)) ||
            task.createdBy.name.toLowerCase().includes(searchLower)
        );
    }, [tasks, taskSearchTerm]);

    // Get filtered tasks by status
    const getTasksByStatus = (status: 'to-do' | 'in-progress' | 'in-review' | 'completed') => {
        return filteredTasks.filter(task => task.status === status);
    };

    const refreshProject = async () => {
        try {
            const projectResponse = await projectService.getProject(projectId);
            setProject(projectResponse.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to refresh project');
        }
    };

    const isCurrentUserOwner = () => {
        if (!project || !currentUser) return false;
        return project.members.some(member => 
            member.user._id === currentUser.id && member.role === 'owner'
        );
    };

    const handleEditProject = () => {
        navigate(`/projects/${projectId}/edit`);
    };

    const handleDeleteProject = async () => {
        if (!project) return;

        const confirmMessage = `Are you sure you want to delete the project "${project.name}"? This action cannot be undone and will delete all associated tasks.`;
        
        if (window.confirm(confirmMessage)) {
            try {
                await projectService.deleteProject(projectId);
                navigate('/projects');
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to delete project');
                console.error('Error deleting project:', err);
            }
        }
    };

    const handleRemoveMember = async (userId: string, memberName: string) => {
        if (window.confirm(`Are you sure you want to remove ${memberName} from this project?`)) {
            try {
                await projectService.removeMember(projectId, userId);
                await refreshProject();
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to remove member');
                console.error('Error removing member:', err);
            }
        }
    };

    const handleUpdateMemberRole = async (userId: string, newRole: 'owner' | 'member' | 'viewer', memberName: string) => {
        if (window.confirm(`Are you sure you want to change ${memberName}'s role to ${newRole}?`)) {
            try {
                await projectService.updateMemberRole(projectId, userId, newRole);
                await refreshProject();
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to update member role');
                console.error('Error updating member role:', err);
            }
        }
    };

    const handleAddTask = () => {
        navigate(`/projects/${projectId}/tasks/new`);
    };

    const handleTaskClick = (taskId: string) => {
        navigate(`/projects/${projectId}/tasks/${taskId}`);
    };

    const handleDeleteTask = async (taskId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.deleteTask(taskId);
                setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to delete task');
                console.error('Error deleting task:', err);
            }
        }
    };

    const handleUpdateTaskStatus = async (taskId: string, newStatus: 'to-do' | 'in-progress' | 'in-review' | 'completed', e: React.MouseEvent) => {
        e.stopPropagation();

        try {
            const task = tasks.find(t => t._id === taskId);
            if (!task) return;

            if (task.status === newStatus) return;

            await taskService.updateTask(taskId, { status: newStatus });

            setTasks(prevTasks =>
                prevTasks.map(t =>
                    t._id === taskId ? { ...t, status: newStatus } : t
                )
            );
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update task status');
            console.error('Error updating task status:', err);
        }
    };

    const renderTaskCard = (task: Task) => (
        <div
            key={task._id}
            className={`task-card ${task.priority}`}
            onClick={() => handleTaskClick(task._id)}
        >
            <div className="task-title">{task.title}</div>
            {task.description && (
                <div className="task-description">{task.description}</div>
            )}
            <div className="task-meta">
                <span className={`priority-badge ${task.priority}`}>
                    {task.priority}
                </span>
                {task.assignedTo && (
                    <div className="assigned-to">
                        {task.assignedTo.picture ? (
                            <img
                                src={task.assignedTo.picture}
                                alt={task.assignedTo.name}
                                className="assignee-avatar"
                            />
                        ) : (
                            <div className="assignee-initials">
                                {task.assignedTo.name.charAt(0)}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="task-actions">
                {task.status === 'to-do' && (
                    <button
                        className="btn-success task-action-btn"
                        onClick={(e) => handleUpdateTaskStatus(task._id, 'in-progress', e)}
                        title="Move to In Progress"
                    >
                        ▶ Start
                    </button>
                )}
                {task.status === 'in-progress' && (
                    <button
                        className="btn-success task-action-btn"
                        onClick={(e) => handleUpdateTaskStatus(task._id, 'in-review', e)}
                        title="Move to Review"
                    >
                        ✓ Review
                    </button>
                )}
                {task.status === 'in-review' && (
                    <button
                        className="btn-success task-action-btn"
                        onClick={(e) => handleUpdateTaskStatus(task._id, 'completed', e)}
                        title="Mark as Complete"
                    >
                        ✓ Complete
                    </button>
                )}
                {task.status === 'completed' && (
                    <button
                        className="btn-success task-action-btn"
                        onClick={(e) => handleUpdateTaskStatus(task._id, 'to-do', e)}
                        title="Reopen Task"
                    >
                        ⟲ Reopen
                    </button>
                )}
                <button
                    className="btn-danger task-action-btn"
                    onClick={(e) => handleDeleteTask(task._id, e)}
                    title="Delete Task"
                >
                    🗑️ Delete
                </button>
            </div>
        </div>
    );

    if (loading) return <div>Loading project...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!project) return <div>Project not found</div>;

    const isOwner = isCurrentUserOwner();

    return (
        <div className="project-detail">
            <div className="project-header">
                <div className="project-title">
                    <h1>
                        {project.name}
                        <span className={`status-badge ${project.status}`}>{project.status.replace('-', ' ')}</span>
                    </h1>
                </div>

                <div className="project-actions">
                    {isOwner && (
                        <button
                            className="btn-secondary"
                            onClick={handleEditProject}
                        >
                            Edit Project
                        </button>
                    )}
                    {isOwner && (
                        <button
                            className="btn-secondary btn-danger"
                            onClick={handleDeleteProject}
                            title="Delete Project"
                        >
                            Delete Project
                        </button>
                    )}
                    <button
                        className="btn-primary"
                        onClick={handleAddTask}
                    >
                        Add Task
                    </button>
                </div>
            </div>

            <div className="project-description">
                <h3>Description</h3>
                <p>{project.description}</p>
            </div>

            <div className="project-dates">
                <div className="date-item">
                    <span className="label">Start Date:</span>
                    <span className="value">
                        {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
                    </span>
                </div>
                {project.endDate && (
                    <div className="date-item">
                        <span className="label">End Date:</span>
                        <span className="value">{new Date(project.endDate).toLocaleDateString()}</span>
                    </div>
                )}
            </div>

            {project.githubRepo && (
                <div className="github-info section-container">
                    <h3>GitHub Repository</h3>
                    <a
                        href={project.githubRepo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="github-link"
                    >
                        {project.githubRepo.fullName}
                    </a>
                </div>
            )}

            <div className="project-members">
                <h3>
                    Team Members ({project.members.length})
                    {isOwner && (
                        <button 
                            className="add-member-btn"
                            onClick={() => setShowAddMemberModal(true)}
                        >
                            + Add Member
                        </button>
                    )}
                </h3>
                <div className="members-list">
                    {project.members.map((member) => (
                        <div key={member.user._id} className="member-item">
                            {member.user.picture ? (
                                <img
                                    src={member.user.picture}
                                    alt={member.user.name}
                                    className="member-avatar"
                                />
                            ) : (
                                <div className="member-avatar-placeholder">
                                    {member.user.name.charAt(0)}
                                </div>
                            )}
                            <div className="member-details">
                                <div className="member-name">{member.user.name}</div>
                                <div className="member-email">{member.user.email}</div>
                            </div>
                            
                            {/* Role Management */}
                            {isOwner ? (
                                <div className="member-role-management">
                                    <select
                                        value={member.role}
                                        onChange={(e) => handleUpdateMemberRole(
                                            member.user._id, 
                                            e.target.value as 'owner' | 'member' | 'viewer',
                                            member.user.name
                                        )}
                                        className="role-select"
                                    >
                                        <option value="owner">Owner</option>
                                        <option value="member">Member</option>
                                        <option value="viewer">Viewer</option>
                                    </select>
                                    
                                    {/* Only show remove button if not the current user or if there are other owners */}
                                    {(member.user._id !== currentUser?.id || 
                                      project.members.filter(m => m.role === 'owner').length > 1) && (
                                        <button
                                            className="remove-member-btn"
                                            onClick={() => handleRemoveMember(member.user._id, member.user.name)}
                                            title={`Remove ${member.user.name} from project`}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className={`member-role ${member.role}`}>
                                    {member.role}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="project-tasks">
                <div className="tasks-header">
                    <h3>Tasks ({tasks.length})</h3>
                    <button
                        className="btn-secondary"
                        onClick={handleAddTask}
                    >
                        Add Task
                    </button>
                </div>

                {/* Task Search */}
                {tasks.length > 0 && (
                    <div className="task-search-section">
                        <SearchBar
                            value={taskSearchTerm}
                            onChange={setTaskSearchTerm}
                            placeholder="Search tasks by title, description, assignee, or status..."
                            className="task-search"
                        />
                        {taskSearchTerm && (
                            <div className="search-results-info">
                                Showing {filteredTasks.length} of {tasks.length} tasks
                            </div>
                        )}
                    </div>
                )}

                {tasks.length === 0 ? (
                    <div className="empty-state">
                        <p>No tasks have been created for this project yet.</p>
                        <button
                            className="btn-primary"
                            onClick={handleAddTask}
                        >
                            Create First Task
                        </button>
                    </div>
                ) : filteredTasks.length === 0 ? (
                    <div className="no-results">
                        <p>No tasks found matching "{taskSearchTerm}"</p>
                        <button 
                            onClick={() => setTaskSearchTerm('')}
                            className="btn-secondary"
                        >
                            Clear Search
                        </button>
                    </div>
                ) : (
                    <div className="tasks-container">
                        <div className="task-columns">
                            <div className="task-column">
                                <div className="column-header">
                                    To Do ({getTasksByStatus('to-do').length})
                                </div>
                                <div className="column-tasks">
                                    {getTasksByStatus('to-do').map(renderTaskCard)}
                                </div>
                            </div>

                            <div className="task-column">
                                <div className="column-header">
                                    In Progress ({getTasksByStatus('in-progress').length})
                                </div>
                                <div className="column-tasks">
                                    {getTasksByStatus('in-progress').map(renderTaskCard)}
                                </div>
                            </div>

                            <div className="task-column">
                                <div className="column-header">
                                    In Review ({getTasksByStatus('in-review').length})
                                </div>
                                <div className="column-tasks">
                                    {getTasksByStatus('in-review').map(renderTaskCard)}
                                </div>
                            </div>

                            <div className="task-column">
                                <div className="column-header">
                                    Completed ({getTasksByStatus('completed').length})
                                </div>
                                <div className="column-tasks">
                                    {getTasksByStatus('completed').map(renderTaskCard)}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Render the AddMemberModal when showAddMemberModal is true */}
            {showAddMemberModal && (
                <AddMemberModal
                    projectId={projectId}
                    onClose={() => setShowAddMemberModal(false)}
                    onMemberAdded={refreshProject}
                />
            )}
        </div>
    );
};

export default ProjectDetail;