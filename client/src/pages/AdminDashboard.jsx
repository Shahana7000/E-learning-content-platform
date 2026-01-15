import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Plus, Link as LinkIcon, FileText, Video, School, Home as HomeIcon, LogOut, Trash, Settings, Search, GraduationCap, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [universities, setUniversities] = useState([]);
    const [allMaterials, setAllMaterials] = useState([]);
    const [activeTab, setActiveTab] = useState('material');
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCourses, setExpandedCourses] = useState({});

    // Forms
    const [uniForm, setUniForm] = useState({ name: '', description: '' });
    const [matForm, setMatForm] = useState({
        title: '', type: 'question_paper', university: '', course: '', year: '', semester: '', subject: '', link: ''
    });

    const commonCourses = ['BCA', 'B.Tech', 'MCA', 'M.Tech', 'B.Sc', 'M.Sc', 'B.Com', 'M.Com', 'MBA', 'BA'];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        fetchUniversities();
        fetchMaterials();
    }, []);

    const fetchUniversities = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/universities`);
            setUniversities(res.data);
        } catch (err) {
            console.error('Fetch error:', err);
            toast.error('Failed to synchronize university data.');
        }
    };

    const fetchMaterials = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/materials`);
            setAllMaterials(res.data);
        } catch (err) {
            console.error('Fetch error:', err);
            toast.error('Failed to fetch resource repository.');
        }
    };

    const handleUniSubmit = async (e) => {
        e.preventDefault();
        const promise = axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/universities`, uniForm);
        toast.promise(promise, {
            loading: 'Registering university...',
            success: () => {
                fetchUniversities();
                setUniForm({ name: '', description: '' });
                return 'Success! New university added.';
            },
            error: 'Failed to save university.'
        });
    };

    const handleMatSubmit = async (e) => {
        e.preventDefault();
        const promise = axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/materials`, matForm);
        toast.promise(promise, {
            loading: 'Uploading resource...',
            success: () => {
                fetchMaterials();
                setMatForm({ ...matForm, title: '', link: '' });
                return 'Vault Updated: Resource committed.';
            },
            error: 'Failed to save resource.'
        });
    };

    const handleDeleteMaterial = async (id) => {
        if (!window.confirm('Delete this resource permanently?')) return;
        try {
            await axios.delete(`http://localhost:5001/api/materials/${id}`);
            fetchMaterials();
            toast.success('Resource removed.');
        } catch (err) {
            console.error('Delete error:', err);
            toast.error('Delete failed.');
        }
    };

    const handleDeleteUniversity = async (id) => {
        if (!window.confirm('Delete university and ALL its materials?')) return;
        try {
            await axios.delete(`http://localhost:5001/api/universities/${id}`);
            fetchUniversities();
            fetchMaterials();
            toast.success('Purge complete.');
        } catch (err) {
            console.error('Delete error:', err);
            toast.error('Delete failed.');
        }
    };

    const toggleCourse = (uniId, courseName) => {
        const key = `${uniId}-${courseName}`;
        setExpandedCourses(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const filteredMaterials = allMaterials.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const materialsByUni = universities.reduce((acc, uni) => {
        acc[uni._id] = {
            name: uni.name,
            courses: {}
        };
        const uniMaterials = filteredMaterials.filter(m => m.university?._id === uni._id);

        uniMaterials.forEach(m => {
            if (!acc[uni._id].courses[m.course]) {
                acc[uni._id].courses[m.course] = [];
            }
            acc[uni._id].courses[m.course].push(m);
        });
        return acc;
    }, {});

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-12">
            <datalist id="common-courses">
                {commonCourses.map(c => <option key={c} value={c} />)}
            </datalist>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/')}
                        className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition-all text-gray-400 hover:text-blue-600 group"
                        title="Exit to Home"
                    >
                        <ArrowRight className="w-6 h-6 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Vault Control</h1>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-1">Academic Repository Management</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => window.open('/', '_blank')} className="px-6 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all font-bold text-blue-600 flex items-center gap-2">
                        <HomeIcon className="w-4 h-4" /> Preview Store
                    </button>
                    <button onClick={handleLogout} className="px-6 py-3 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all font-bold flex items-center gap-2 group">
                        <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> Exit System
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-10">
                <TabButton id="material" activeTab={activeTab} setActiveTab={setActiveTab} label="Add Material" icon={Plus} />
                <TabButton id="university" activeTab={activeTab} setActiveTab={setActiveTab} label="Add University" icon={School} />
                <TabButton id="manage" activeTab={activeTab} setActiveTab={setActiveTab} label="Manage Content" icon={Trash} />
            </div>

            <div className="bg-white rounded-[3rem] shadow-xl shadow-blue-900/5 border border-gray-50 p-12">
                {activeTab === 'university' && (
                    <form onSubmit={handleUniSubmit} className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <SectionTitle title="Register University" icon={School} />
                        <div className="space-y-4">
                            <label className="admin-label">Institution Name</label>
                            <input placeholder="Enter full name..." className="admin-input-premium" value={uniForm.name} onChange={e => setUniForm({ ...uniForm, name: e.target.value })} required />
                        </div>
                        <div className="space-y-4">
                            <label className="admin-label">About Institution</label>
                            <textarea rows="4" placeholder="Brief description..." className="admin-input-premium" value={uniForm.description} onChange={e => setUniForm({ ...uniForm, description: e.target.value })} required />
                        </div>
                        <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-2xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-3">
                            <Plus className="w-6 h-6" /> Commit University
                        </button>
                    </form>
                )}

                {activeTab === 'material' && (
                    <form onSubmit={handleMatSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="md:col-span-2">
                            <SectionTitle title="Add New Resource" icon={Plus} />
                        </div>

                        <div className="space-y-2">
                            <label className="admin-label">Material Primary Title</label>
                            <input placeholder="Ex: Discrete Mathematics Units 1-5" className="admin-input-premium" value={matForm.title} onChange={e => setMatForm({ ...matForm, title: e.target.value })} required />
                        </div>

                        <div className="space-y-2">
                            <label className="admin-label">Resource Format</label>
                            <select className="admin-input-premium" value={matForm.type} onChange={e => setMatForm({ ...matForm, type: e.target.value })}>
                                <option value="question_paper">🔍 Question Paper (PYQ)</option>
                                <option value="notes">📘 Lecture Notes (PDF)</option>
                                <option value="important_questions">⭐ Important Questions</option>
                                <option value="video">🎥 Video Playlist</option>
                                <option value="learning_link">🔗 Learning Link</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="admin-label">Parent University</label>
                            <select className="admin-input-premium" value={matForm.university} onChange={e => setMatForm({ ...matForm, university: e.target.value })} required>
                                <option value="">Select University</option>
                                {universities.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="admin-label">Course / Degree</label>
                            <input list="common-courses" placeholder="Ex: BCA" className="admin-input-premium" value={matForm.course} onChange={e => setMatForm({ ...matForm, course: e.target.value })} required />
                        </div>

                        <div className="space-y-2">
                            <label className="admin-label">Academic Year</label>
                            <input type="number" placeholder="Ex: 2024" className="admin-input-premium" value={matForm.year} onChange={e => setMatForm({ ...matForm, year: e.target.value })} required />
                        </div>

                        <div className="space-y-2">
                            <label className="admin-label">Semester (1-8)</label>
                            <select className="admin-input-premium" value={matForm.semester} onChange={e => setMatForm({ ...matForm, semester: e.target.value })} required>
                                <option value="">Select Semester</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="admin-label">Subject Name</label>
                            <input placeholder="Ex: Operating Systems" className="admin-input-premium" value={matForm.subject} onChange={e => setMatForm({ ...matForm, subject: e.target.value })} required />
                        </div>

                        <div className="space-y-2">
                            <label className="admin-label">Resource Drive Link</label>
                            <input type="url" placeholder="Google Drive / URL..." className="admin-input-premium" value={matForm.link} onChange={e => setMatForm({ ...matForm, link: e.target.value })} required />
                        </div>

                        <button type="submit" className="md:col-span-2 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-blue-700 shadow-2xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3">
                            <Plus className="w-6 h-6" /> Commit Resource to Vault
                        </button>
                    </form>
                )}

                {activeTab === 'manage' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <SectionTitle title="Vault Inventory" icon={Trash} />
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input placeholder="Search vault..." className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:border-blue-500 transition-all font-bold" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {universities.map(uni => (
                                <div key={uni._id} className="border border-gray-100 rounded-[2rem] overflow-hidden">
                                    <div className="p-6 bg-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm"><School className="w-5 h-5" /></div>
                                            <h3 className="text-xl font-black text-gray-800 tracking-tight">{uni.name}</h3>
                                        </div>
                                        <button onClick={() => handleDeleteUniversity(uni._id)} className="p-2 text-red-100 hover:text-red-500 transition-colors"><Trash className="w-5 h-5" /></button>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {Object.entries(materialsByUni[uni._id]?.courses || {}).map(([courseName, materials]) => (
                                            <div key={courseName} className="border border-gray-50 rounded-2xl">
                                                <button onClick={() => toggleCourse(uni._id, courseName)} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-2xl">
                                                    <div className="flex items-center gap-3">
                                                        <GraduationCap className="w-5 h-5 text-indigo-500" />
                                                        <span className="font-bold text-gray-700 uppercase tracking-widest text-xs">{courseName}</span>
                                                        <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg text-[10px] font-black">{materials.length} Items</span>
                                                    </div>
                                                    <Settings className={`w-4 h-4 text-gray-300 transition-transform ${expandedCourses[`${uni._id}-${courseName}`] ? 'rotate-90' : ''}`} />
                                                </button>
                                                {expandedCourses[`${uni._id}-${courseName}`] && (
                                                    <div className="p-4 pt-0 space-y-2">
                                                        {materials.map(m => (
                                                            <div key={m._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl group hover:bg-white border border-transparent hover:border-gray-100 transition-all">
                                                                <div>
                                                                    <p className="font-bold text-gray-800">{m.title}</p>
                                                                    <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase mt-1">
                                                                        <span>{m.subject}</span>
                                                                        <span>•</span>
                                                                        <span className="text-blue-500">Year {m.year}</span>
                                                                        {m.semester && (
                                                                            <>
                                                                                <span>•</span>
                                                                                <span className="text-indigo-500">Sem {m.semester}</span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <button onClick={() => handleDeleteMaterial(m._id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash className="w-4 h-4" /></button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .admin-label { display: block; font-size: 0.75rem; font-weight: 900; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.1em; margin-bottom: 0.5rem; margin-left: 0.5rem; }
                .admin-input-premium { width: 100%; padding: 1.25rem 1.5rem; border-radius: 1.5rem; border: 1px solid #f1f5f9; background: #f8fafc; outline: none; font-weight: 700; transition: all 0.3s ease; }
                .admin-input-premium:focus { background: white; border-color: #3b82f6; box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.1); }
            `}} />
        </div>
    );
};

const TabButton = ({ id, activeTab, setActiveTab, label, icon: Icon }) => (
    <button
        onClick={() => setActiveTab(id)}
        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${activeTab === id ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/40 scale-105' : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600'}`}
    >
        <Icon className="w-5 h-5" />
        {label}
    </button>
);

const SectionTitle = ({ title, icon: Icon }) => (
    <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
            <Icon className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">{title}</h2>
    </div>
);

export default AdminDashboard;
