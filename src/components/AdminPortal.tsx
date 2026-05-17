import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Plus, Trash2, Edit3, Save, 
  Image as ImageIcon, Tag, Link,
  CheckCircle2, AlertCircle, LogIn, LogOut,
  Upload, PenTool
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  desc: string;
  tech: string[];
  images: string[];
  createdAt: string;
}

export const AdminPortal = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({
    title: '',
    desc: '',
    tech: [],
    images: []
  });
  const [techInput, setTechInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingProfile, setIsDraggingProfile] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [profileImage, setProfileImage] = useState<string>('');

  // Load projects and settings from localStorage
  useEffect(() => {
    const loadData = () => {
      const storedProjects = localStorage.getItem('wahyu_projects');
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      }
      
      const storedSettings = localStorage.getItem('wahyu_settings');
      if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        setProfileImage(settings.profileImage || '');
      }
    };
    loadData();
    
    // Check if user is "logged in" locally for this session
    const loggedIn = sessionStorage.getItem('wahyu_admin_auth') === 'true';
    setIsAdmin(loggedIn);
  }, []);

  const handleLogin = () => {
    // Simple local bypass for the request
    sessionStorage.setItem('wahyu_admin_auth', 'true');
    setIsAdmin(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('wahyu_admin_auth');
    setIsAdmin(false);
  };

  const handleSave = () => {
    try {
      if (!currentProject.title || !currentProject.desc) {
          setStatus({ type: 'error', msg: 'Title and Description are required' });
          return;
      }

      let updatedProjects: Project[] = [...projects];

      if (currentProject.id) {
        // Update
        updatedProjects = projects.map(p => 
          p.id === currentProject.id 
          ? { ...p, ...currentProject, updatedAt: new Date().toISOString() } as Project 
          : p
        );
        setStatus({ type: 'success', msg: 'Project updated locally' });
      } else {
        // Create
        const newProject: Project = {
          id: `local-${Date.now()}`,
          title: currentProject.title || '',
          desc: currentProject.desc || '',
          tech: currentProject.tech || [],
          images: currentProject.images || [],
          createdAt: new Date().toISOString()
        };
        updatedProjects = [newProject, ...projects];
        setStatus({ type: 'success', msg: 'Project created locally' });
      }

      localStorage.setItem('wahyu_projects', JSON.stringify(updatedProjects));
      setProjects(updatedProjects);
      
      // Notify other components in the same window
      window.dispatchEvent(new Event('wahyu_projects_updated'));
      
      setIsEditing(false);
      setCurrentProject({ title: '', desc: '', tech: [], images: [] });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', msg: 'Failed to save project locally' });
    }
  };

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await performProfileUpload(file);
  };

  const performProfileUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        let errorMsg = 'Upload failed';
        if (contentType && contentType.includes("application/json")) {
          const errData = await response.json();
          errorMsg = errData.error || errData.details || errorMsg;
        } else {
          const text = await response.text();
          console.error('Server returned non-JSON error:', text);
        }
        throw new Error(errorMsg);
      }

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error('Expected JSON but got:', text);
        throw new Error('Server returned invalid response format');
      }

      const data = await response.json();
      setProfileImage(data.url);
      
      const settings = JSON.parse(localStorage.getItem('wahyu_settings') || '{}');
      settings.profileImage = data.url;
      localStorage.setItem('wahyu_settings', JSON.stringify(settings));
      
      window.dispatchEvent(new Event('wahyu_settings_updated'));
      setStatus({ type: 'success', msg: 'Profile photo updated successfully' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', msg: 'Failed to update profile photo' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project locally?')) return;
    const updatedProjects = projects.filter(p => p.id !== id);
    localStorage.setItem('wahyu_projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
    window.dispatchEvent(new Event('wahyu_projects_updated'));
    setStatus({ type: 'success', msg: 'Project deleted' });
  };

  const addTech = () => {
    if (!techInput.trim()) return;
    setCurrentProject(prev => ({
      ...prev,
      tech: [...(prev.tech || []), techInput.trim()]
    }));
    setTechInput('');
  };

  const removeTech = (index: number) => {
    setCurrentProject(prev => ({
      ...prev,
      tech: prev.tech?.filter((_, i) => i !== index)
    }));
  };

  const addImage = () => {
    if (!imageInput.trim()) return;
    setCurrentProject(prev => ({
      ...prev,
      images: [...(prev.images || []), imageInput.trim()]
    }));
    setImageInput('');
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatus({ type: 'error', msg: 'File must be an image (PNG, JPG, etc.)' });
      return;
    }

    await performUpload(file);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await performUpload(file);
    // Reset input
    e.target.value = '';
  };

  const performUpload = async (file: File) => {
    setIsUploading(true);
    setStatus({ type: 'success', msg: 'Uploading local asset...' });

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const contentType = response.headers.get("content-type");
      if (!response.ok) {
        let errorMsg = 'Upload failed';
        if (contentType && contentType.includes("application/json")) {
          const errData = await response.json();
          errorMsg = errData.error || errData.details || errorMsg;
        } else {
          const text = await response.text();
          console.error('Server returned non-JSON error:', text);
        }
        throw new Error(errorMsg);
      }

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error('Expected JSON but got:', text);
        throw new Error('Server returned invalid response format');
      }

      const data = await response.json();
      setCurrentProject(prev => ({
        ...prev,
        images: [...(prev.images || []), data.url]
      }));
      setStatus({ type: 'success', msg: 'Local asset uploaded successfully' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', msg: 'Failed to upload local asset' });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
      setCurrentProject(prev => ({
        ...prev,
        images: prev.images?.filter((_, i) => i !== index)
      }));
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-sm bg-slate-50">
        <X className="mb-4 text-muted-gray" size={48} />
        <h3 className="text-xl font-bold text-navy-main mb-2">Admin Terminal [Local Access]</h3>
        <p className="text-muted-gray text-sm mb-6 text-center max-w-xs">
          Modul Firebase dinonaktifkan. Mode pengelolaan aset lokal aktif.
        </p>
        <button 
          onClick={handleLogin}
          className="flex items-center gap-2 bg-navy-main text-white px-6 py-3 rounded-sm font-bold hover:bg-navy-main/90 transition-all shadow-lg"
        >
          Masuk ke Mode Admin Lokal
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-2xl font-bold text-navy-main">Local Command Center</h3>
          <p className="text-xs font-mono text-muted-gray uppercase tracking-widest mt-1">Status: LOCAL_STORAGE_ACTIVE</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => { setIsEditing(true); setCurrentProject({ title: '', desc: '', tech: [], images: [] }); }}
            className="flex items-center gap-2 bg-amber-accent text-navy-main px-4 py-2 rounded-sm font-bold text-xs uppercase tracking-wider"
          >
            <Plus size={16} /> New Deployment
          </button>
          <button onClick={handleLogout} className="p-2 text-muted-gray hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {status && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-4 flex items-center gap-3 text-sm font-bold",
            status.type === 'success' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
          )}
        >
          {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {status.msg}
          <button className="ml-auto" onClick={() => setStatus(null)}><X size={16} /></button>
        </motion.div>
      )}

      {/* Profile Settings */}
      <div className="bg-white p-6 border border-slate-200 shadow-sm text-left">
        <h4 className="text-sm font-mono uppercase tracking-[0.2em] text-muted-gray mb-6 flex items-center gap-2">
          <PenTool size={14} className="text-amber-accent" /> System_Identity_Override
        </h4>
        <div className="flex items-center gap-8">
          <div 
            className={cn(
              "w-24 h-24 bg-slate-100 border overflow-hidden rounded-sm relative group transition-all duration-300",
              isDraggingProfile ? "border-amber-accent ring-4 ring-amber-accent/20 scale-105" : "border-slate-200"
            )}
            onDragOver={(e) => { e.preventDefault(); setIsDraggingProfile(true); }}
            onDragLeave={(e) => { e.preventDefault(); setIsDraggingProfile(false); }}
            onDrop={async (e) => {
              e.preventDefault();
              setIsDraggingProfile(false);
              const file = e.dataTransfer.files?.[0];
              if (file && file.type.startsWith('image/')) {
                await performProfileUpload(file);
              }
            }}
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className={cn("w-full h-full object-cover", isDraggingProfile && "opacity-50")} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <ImageIcon size={32} />
              </div>
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-navy-main/40 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            {isDraggingProfile && (
              <div className="absolute inset-0 flex items-center justify-center bg-amber-accent/20">
                <Upload className="text-amber-accent animate-bounce" size={24} />
              </div>
            )}
          </div>
          <div className="space-y-4 flex-1">
            <p className="text-xs text-muted-gray leading-relaxed">
              Unggah foto profil baru Anda di sini. Foto ini akan muncul di bagian Hero (atas) website.
              Disarankan menggunakan rasio portrait untuk hasil terbaik.
            </p>
            <div className="flex gap-4">
              <label className="bg-navy-main text-white px-6 py-2 rounded-sm font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-navy-main/90 transition-all flex items-center gap-2">
                <Upload size={14} /> {profileImage ? 'Change Photo' : 'Upload Photo'}
                <input type="file" className="hidden" accept="image/*" onChange={handleProfileUpload} />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Project List */}
      <div className="grid gap-6 text-left">
        {projects.length === 0 && (
            <div className="text-center py-10 text-muted-gray bg-white border border-dashed border-slate-200 uppercase font-mono text-xs tracking-widest">
                No local deployments found.
            </div>
        )}
        {projects.map(proj => (
          <div key={proj.id} className="bg-white border border-slate-200 p-6 flex items-start justify-between group hover:shadow-md transition-all">
            <div className="flex gap-6">
              <div className="w-24 h-24 bg-slate-100 flex-shrink-0 rounded-sm overflow-hidden border border-slate-200">
                <img src={proj.images[0]} alt="" className="w-full h-full object-cover grayscale" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-navy-main">{proj.title}</h4>
                <p className="text-sm text-muted-gray line-clamp-2 max-w-xl mb-3">{proj.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {proj.tech.map(t => (
                    <span key={t} className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded-sm uppercase font-bold">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => { setCurrentProject(proj); setIsEditing(true); }}
                className="p-2 text-muted-gray hover:text-amber-accent transition-colors"
              >
                <Edit3 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(proj.id)}
                className="p-2 text-muted-gray hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-navy-main/60 backdrop-blur-sm p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden"
            >
              <div className="bg-navy-main p-6 text-white flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-3 uppercase italic font-display">
                  <div className="w-8 h-8 bg-amber-accent flex items-center justify-center rounded-sm rotate-45">
                    <Save className="-rotate-45 text-navy-main" size={16} />
                  </div>
                  {currentProject.id ? 'Edit_Parameters' : 'New_Deployment'}
                </h3>
                <button onClick={() => setIsEditing(false)}><X size={24} /></button>
              </div>

              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto text-left">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase font-bold text-muted-gray tracking-widest">Project.Title</label>
                  <input 
                    type="text" 
                    value={currentProject.title}
                    onChange={e => setCurrentProject(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter project name"
                    className="w-full bg-slate-50 border border-slate-200 p-4 font-mono focus:border-amber-accent outline-none transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase font-bold text-muted-gray tracking-widest">Project.Description</label>
                  <textarea 
                    rows={4}
                    value={currentProject.desc}
                    onChange={e => setCurrentProject(prev => ({ ...prev, desc: e.target.value }))}
                    placeholder="Describe the project..."
                    className="w-full bg-slate-50 border border-slate-200 p-4 font-mono focus:border-amber-accent outline-none transition-colors resize-none"
                  />
                </div>

                {/* Tech Tags */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase font-bold text-muted-gray tracking-widest">Technology_Stack</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={techInput}
                      onChange={e => setTechInput(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && addTech()}
                      placeholder="Add tag (e.g. ROS2)"
                      className="flex-1 bg-slate-50 border border-slate-200 p-4 font-mono focus:border-amber-accent outline-none transition-colors"
                    />
                    <button onClick={addTech} className="bg-navy-main text-white px-6 font-bold flex items-center gap-2"><Tag size={16} /> Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentProject.tech?.map((t, i) => (
                      <span key={i} className="bg-slate-100 text-navy-main px-3 py-1 rounded-sm text-xs font-mono flex items-center gap-2">
                        {t} <button onClick={() => removeTech(i)}><X size={12} /></button>
                      </span>
                    ))}
                  </div>
                </div>

                 {/* Image URLs */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase font-bold text-muted-gray tracking-widest">Local_Asset_Upload [PERSISTENT]</label>
                    <div 
                      className="relative group"
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                    >
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                      />
                      <div className={cn(
                        "w-full border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 transition-all duration-300",
                        isDragging ? "border-amber-accent bg-amber-accent/10 scale-[0.99] shadow-inner" : "border-slate-200 bg-slate-50",
                        isUploading && "opacity-50"
                      )}>
                        <Upload 
                          className={cn(
                            "transition-colors",
                            isDragging ? "text-amber-accent animate-bounce" : "text-muted-gray group-hover:text-amber-accent"
                          )} 
                          size={32} 
                        />
                        <div className="text-center">
                          <p className="text-sm font-bold text-navy-main uppercase font-mono tracking-wider">
                            {isUploading ? 'Transferring_Data...' : isDragging ? 'Drop_To_Upload' : 'Drag_&_Drop_or_Click'}
                          </p>
                          <p className="text-[10px] text-muted-gray mt-1">Accepted: PNG, JPG, WEBP, GIF (Max 5MB)</p>
                          <p className="text-[10px] text-amber-accent/60 font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold">Standalone_Access_Enabled</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase font-bold text-muted-gray tracking-widest">Remote_Capture_URLs</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={imageInput}
                        onChange={e => setImageInput(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && addImage()}
                        placeholder="Paste Unsplash or Image Link"
                        className="flex-1 bg-slate-50 border border-slate-200 p-4 font-mono focus:border-amber-accent outline-none transition-colors"
                      />
                      <button onClick={addImage} className="bg-navy-main text-white px-6 font-bold flex items-center gap-2"><ImageIcon size={16} /> Add</button>
                    </div>
                  </div>
                  
                  {/* Current Input Preview */}
                  {imageInput.trim().startsWith('http') && (
                    <div className="mt-2 w-full max-w-[200px] aspect-video bg-slate-100 border-2 border-dashed border-slate-200 rounded-sm overflow-hidden relative group">
                      <img 
                        src={imageInput} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                         <ImageIcon size={16} />
                      </div>
                      <div className="absolute inset-0 bg-navy-main/10 pointer-events-none" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {currentProject.images?.map((img, i) => (
                      <div key={i} className="relative group aspect-video bg-slate-100 border border-slate-200 rounded-sm overflow-hidden">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-200 flex gap-4">
                <button 
                  onClick={handleSave}
                  className="flex-1 bg-amber-accent text-navy-main font-bold py-4 uppercase tracking-[0.2em] font-mono hover:bg-amber-500 transition-colors shadow-lg shadow-amber-accent/20"
                >
                  Commit changes
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-8 border border-slate-300 font-bold uppercase text-xs tracking-widest hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}
