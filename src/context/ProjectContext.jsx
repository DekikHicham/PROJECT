import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ProjectContext = createContext();

const STORAGE_KEY = 'project-manager-data';

// Sample initial projects for demo
const sampleProjects = [
    {
        id: '1',
        name: 'Product Launch Video',
        description: 'Promotional video for the new smartphone release with cinematic visuals and engaging narration.',
        status: 'in-progress',
        tags: ['video', 'product', 'launch'],
        createdAt: '2026-02-01T10:00:00Z',
        updatedAt: '2026-02-07T15:30:00Z',
        scripts: [
            { id: 's1', title: 'Main Script', content: 'Opening shot: Sunrise over the city skyline...\n\nNarrator: "In a world where innovation never sleeps..."', updatedAt: '2026-02-07T15:30:00Z' }
        ],
        voices: [
            { id: 'v1', talent: 'John Smith', notes: 'Deep, authoritative voice. Think movie trailer style.', status: 'assigned' }
        ],
        reviews: [
            { id: 'r1', author: 'Sarah', comment: 'Great opening! Consider adding more product shots in the middle section.', status: 'pending', createdAt: '2026-02-06T09:00:00Z' }
        ],
        landingCopy: {
            headline: 'Experience the Future Today',
            subheadline: 'Introducing the most advanced smartphone ever created',
            body: 'Revolutionary camera system. Unmatched performance. Beautiful design.',
            cta: 'Pre-order Now'
        },
        landingPage: {
            mockupUrl: '',
            notes: 'Hero section with video background, followed by feature highlights'
        }
    },
    {
        id: '2',
        name: 'Brand Story Documentary',
        description: 'A behind-the-scenes look at our company culture and the people who make it all happen.',
        status: 'completed',
        tags: ['documentary', 'branding'],
        createdAt: '2026-01-15T08:00:00Z',
        updatedAt: '2026-02-05T14:00:00Z',
        scripts: [],
        voices: [],
        reviews: [
            { id: 'r2', author: 'Michael', comment: 'Approved! Ready for final export.', status: 'approved', createdAt: '2026-02-05T14:00:00Z' }
        ],
        landingCopy: {
            headline: 'Our Story',
            subheadline: 'From garage startup to industry leader',
            body: 'Every great company starts with a dream.',
            cta: 'Watch the Film'
        },
        landingPage: { mockupUrl: '', notes: '' }
    },
    {
        id: '3',
        name: 'Holiday Campaign',
        description: 'Festive promotional content for the upcoming holiday season.',
        status: 'on-hold',
        tags: ['campaign', 'holiday', 'promotion', 'seasonal'],
        createdAt: '2026-01-20T11:00:00Z',
        updatedAt: '2026-01-25T16:45:00Z',
        scripts: [],
        voices: [],
        reviews: [],
        landingCopy: { headline: '', subheadline: '', body: '', cta: '' },
        landingPage: { mockupUrl: '', notes: '' }
    }
];

export function ProjectProvider({ children }) {
    const [projects, setProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setProjects(JSON.parse(stored));
            } else {
                setProjects(sampleProjects);
            }
        } catch (e) {
            console.error('Failed to load projects:', e);
            setProjects(sampleProjects);
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever projects change
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
            } catch (e) {
                console.error('Failed to save projects:', e);
            }
        }
    }, [projects, isLoaded]);

    // CRUD Operations
    const addProject = useCallback((project) => {
        const newProject = {
            id: Date.now().toString(),
            ...project,
            tags: project.tags || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            scripts: [],
            voices: [],
            reviews: [],
            landingCopy: { headline: '', subheadline: '', body: '', cta: '' },
            landingPage: { mockupUrl: '', notes: '' }
        };
        setProjects(prev => [newProject, ...prev]);
        return newProject;
    }, []);

    const updateProject = useCallback((id, updates) => {
        setProjects(prev => prev.map(p =>
            p.id === id
                ? { ...p, ...updates, updatedAt: new Date().toISOString() }
                : p
        ));
    }, []);

    const deleteProject = useCallback((id) => {
        setProjects(prev => prev.filter(p => p.id !== id));
    }, []);

    const getProject = useCallback((id) => {
        return projects.find(p => p.id === id);
    }, [projects]);

    // Section updates with auto-save
    const updateProjectSection = useCallback((projectId, section, data) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    [section]: data,
                    updatedAt: new Date().toISOString()
                };
            }
            return p;
        }));
    }, []);

    // Add item to array section (scripts, voices, reviews)
    const addToSection = useCallback((projectId, section, item) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    [section]: [...(p[section] || []), { id: Date.now().toString(), ...item }],
                    updatedAt: new Date().toISOString()
                };
            }
            return p;
        }));
    }, []);

    // Update item in array section
    const updateInSection = useCallback((projectId, section, itemId, updates) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    [section]: p[section].map(item =>
                        item.id === itemId ? { ...item, ...updates } : item
                    ),
                    updatedAt: new Date().toISOString()
                };
            }
            return p;
        }));
    }, []);

    // Remove item from array section
    const removeFromSection = useCallback((projectId, section, itemId) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    [section]: p[section].filter(item => item.id !== itemId),
                    updatedAt: new Date().toISOString()
                };
            }
            return p;
        }));
    }, []);

    // Filtered projects
    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // Stats
    const stats = {
        total: projects.length,
        inProgress: projects.filter(p => p.status === 'in-progress').length,
        completed: projects.filter(p => p.status === 'completed').length,
        onHold: projects.filter(p => p.status === 'on-hold').length
    };

    const value = {
        projects,
        filteredProjects,
        stats,
        searchQuery,
        setSearchQuery,
        filterStatus,
        setFilterStatus,
        addProject,
        updateProject,
        deleteProject,
        getProject,
        updateProjectSection,
        addToSection,
        updateInSection,
        removeFromSection,
        isLoaded
    };

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
}

export function useProjects() {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProjects must be used within a ProjectProvider');
    }
    return context;
}
