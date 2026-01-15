import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    BookOpen,
    Download,
    Video as Tv,
    Link as LinkIcon,
    ExternalLink,
    Search,
    ChevronRight,
    ArrowRight,
    Filter,
    Calendar,
    Layers,
    Star,
    Grid,
    List,
    FileText,
    GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Materials = () => {
    const [searchParams] = useSearchParams();
    const universityId = searchParams.get('university');
    const navigate = useNavigate();

    const [rawMaterials, setRawMaterials] = useState([]);
    const [universityName, setUniversityName] = useState('University');
    // const [loading, setLoading] = useState(true); // Lint error: assigned but never used
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedYear, setSelectedYear] = useState('all');
    const [selectedSemester, setSelectedSemester] = useState('all');
    const [viewMode, setViewMode] = useState('grid');

    const fetchMaterialsAndUni = async () => {
        // setLoading(true);
        try {
            const [matRes, uniRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/materials?universityId=${universityId}`),
                axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/universities`)
            ]);

            setRawMaterials(matRes.data);
            const uni = uniRes.data.find(u => u._id === universityId);
            if (uni) setUniversityName(uni.name);

        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        if (universityId) {
            fetchMaterialsAndUni();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [universityId]);

    const handleBack = () => {
        if (selectedSubject) {
            setSelectedSubject(null);
        } else if (selectedCourse) {
            setSelectedCourse(null);
        } else {
            navigate('/');
        }
    };

    const courses = [...new Set(rawMaterials.map(m => m.course))];
    const subjects = selectedCourse
        ? [...new Set(rawMaterials.filter(m => m.course === selectedCourse).map(m => m.subject))]
        : [];

    const subjectMaterials = selectedSubject
        ? rawMaterials.filter(m => m.course === selectedCourse && m.subject === selectedSubject)
        : [];

    const years = selectedSubject
        ? [...new Set(subjectMaterials.map(m => m.year))].sort((a, b) => b - a)
        : [];

    const semesters = selectedSubject
        ? [...new Set(subjectMaterials.filter(m => m.semester).map(m => m.semester))].sort((a, b) => a - b)
        : [];

    const getFilteredMaterials = () => {
        let filtered = subjectMaterials;

        if (activeCategory !== 'all') {
            const map = {
                notes: 'notes',
                pyq: 'question_paper',
                video: 'video',
                imp: 'important_questions',
                links: 'learning_link'
            };
            filtered = filtered.filter(m => m.type === map[activeCategory]);
        }

        if (searchQuery) {
            filtered = filtered.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        if (selectedYear !== 'all') {
            filtered = filtered.filter(m => m.year.toString() === selectedYear);
        }

        if (selectedSemester !== 'all') {
            filtered = filtered.filter(m => m.semester?.toString() === selectedSemester);
        }

        return filtered;
    };

    const currentMaterials = getFilteredMaterials();

    if (!universityId) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
            <Layers className="w-16 h-16 text-blue-200 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">No University Selected</h2>
            <p className="text-gray-500 mt-2">Please go back to Home and select a University to view materials.</p>
        </div>
    );

    const MaterialCard = ({ mat, colorKey, icon: Icon, btnText }) => {
        const theme = {
            yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600', light: 'bg-yellow-50' },
            blue: { bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50' },
            indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', light: 'bg-indigo-50' },
            red: { bg: 'bg-red-600', text: 'text-red-600', light: 'bg-red-50' },
            purple: { bg: 'bg-purple-600', text: 'text-purple-600', light: 'bg-purple-50' }
        }[colorKey] || { bg: 'bg-blue-600', text: 'text-blue-600', light: 'bg-blue-50' };

        return (
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden group"
            >
                <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div className={`p-4 rounded-2xl ${theme.light} ${theme.text}`}>
                            <Icon className="w-7 h-7" />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 italic">
                                Year {mat.year}
                            </span>
                            {mat.semester && (
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                                    Sem {mat.semester}
                                </span>
                            )}
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-6 line-clamp-2 min-h-[3.5rem] leading-tight group-hover:text-blue-600 transition-colors">
                        {mat.title}
                    </h3>
                    <motion.a
                        href={mat.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${theme.bg} text-white shadow-lg`}
                        style={{ color: 'white' }}
                    >
                        {btnText}
                        <ExternalLink className="w-4 h-4" />
                    </motion.a>
                </div>
            </motion.div>
        );
    };

    const MaterialListRow = ({ mat, colorKey, icon: Icon, btnText }) => {
        const theme = {
            yellow: { text: 'text-yellow-600', light: 'bg-yellow-50' },
            blue: { text: 'text-blue-600', light: 'bg-blue-50' },
            indigo: { text: 'text-indigo-600', light: 'bg-indigo-50' },
            red: { text: 'text-red-600', light: 'bg-red-50' },
            purple: { text: 'text-purple-600', light: 'bg-purple-50' }
        }[colorKey] || { text: 'text-blue-600', light: 'bg-blue-50' };

        return (
            <motion.div
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors group"
            >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${theme.light} ${theme.text} flex-shrink-0`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="font-bold text-gray-800 truncate group-hover:text-blue-600 transition-colors" title={mat.title}>
                            {mat.title}
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Year {mat.year}</span>
                            {mat.semester && (
                                <>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 text-indigo-500"><GraduationCap className="w-3 h-3" /> Sem {mat.semester}</span>
                                </>
                            )}
                            <span>•</span>
                            <span>{mat.subject}</span>
                        </div>
                    </div>
                </div>
                <motion.a
                    href={mat.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-blue-600 hover:text-white rounded-lg transition-all text-xs font-black text-gray-600 uppercase tracking-tighter"
                >
                    {btnText.includes('PDF') ? 'Download' : 'Open'}
                    <ExternalLink className="w-3 h-3" />
                </motion.a>
            </motion.div>
        );
    };

    const FilterButton = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => { setActiveCategory(id); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeCategory === id ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-500/10' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-500 hover:text-blue-600'}`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen bg-gray-50/30">
            {/* Breadcrumb & Navigation Header */}
            <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBack}
                        className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all text-gray-400 hover:text-blue-600 group"
                        title="Back"
                    >
                        <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <nav className="flex items-center gap-2 text-sm font-bold text-gray-400">
                        <span onClick={() => { setSelectedCourse(null); setSelectedSubject(null); setActiveCategory('all'); setSearchQuery(''); setSelectedYear('all'); setSelectedSemester('all'); }} className="cursor-pointer hover:text-blue-600 transition-colors">Universities</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className={`transition-colors ${!selectedCourse ? 'text-blue-600' : 'cursor-pointer hover:text-blue-600'}`} onClick={() => { setSelectedCourse(null); setSelectedSubject(null) }}>{universityName}</span>
                        {selectedCourse && (
                            <>
                                <ChevronRight className="w-4 h-4" />
                                <span className={`transition-colors ${!selectedSubject ? 'text-blue-600' : 'cursor-pointer hover:text-blue-600'}`} onClick={() => setSelectedSubject(null)}>{selectedCourse}</span>
                            </>
                        )}
                        {selectedSubject && (
                            <>
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-gray-900">{selectedSubject}</span>
                            </>
                        )}
                    </nav>
                </div>

                {selectedSubject && (
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                        <FilterButton id="all" label="All" icon={Layers} />
                        <FilterButton id="notes" label="Notes" icon={BookOpen} />
                        <FilterButton id="pyq" label="PYQs" icon={Download} />
                        <FilterButton id="imp" label="Important" icon={Star} />
                        <FilterButton id="video" label="Videos" icon={Tv} />
                        <FilterButton id="links" label="Learning Links" icon={LinkIcon} />
                    </div>
                )}
            </div>

            <AnimatePresence mode='wait'>
                {!selectedCourse ? (
                    <motion.div
                        key="courses"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {courses.length > 0 ? courses.map(course => (
                            <motion.div
                                key={course}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedCourse(course)}
                                className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100 flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <GraduationCap className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{course}</h3>
                                        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mt-1">Explore Subjects</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-blue-600 transition-all" />
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-20 text-center text-gray-400">No courses available for this university.</div>
                        )}
                    </motion.div>
                ) : !selectedSubject ? (
                    <motion.div
                        key="subjects"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {subjects.map(subject => (
                            <motion.div
                                key={subject}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedSubject(subject)}
                                className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100 flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                        <BookOpen className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{subject}</h3>
                                        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mt-1">View Materials</p>
                                    </div>
                                </div>
                                <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-indigo-600 transition-all" />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="materials"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        {/* Search and Advanced Filters */}
                        <div className="flex flex-col lg:flex-row gap-4 items-center">
                            <div className="relative flex-1 w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={`Search in ${selectedSubject}...`}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-3 w-full lg:w-auto">
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-200">
                                    <Filter className="w-4 h-4 text-gray-400" />
                                    <select
                                        className="bg-transparent text-sm font-bold text-gray-600 outline-none cursor-pointer"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                    >
                                        <option value="all">All Years</option>
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-200">
                                    <GraduationCap className="w-4 h-4 text-gray-400" />
                                    <select
                                        className="bg-transparent text-sm font-bold text-gray-600 outline-none cursor-pointer"
                                        value={selectedSemester}
                                        onChange={(e) => setSelectedSemester(e.target.value)}
                                    >
                                        <option value="all">All Semesters</option>
                                        {semesters.map(s => <option key={s} value={s}>Sem {s}</option>)}
                                    </select>
                                </div>
                                <div className="flex bg-white p-1 rounded-xl border border-gray-200 ml-auto">
                                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-blue-600'}`}><Grid className="w-4 h-4" /></button>
                                    <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-blue-600'}`}><List className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>

                        {currentMaterials.length > 0 ? (
                            <div className="animate-in fade-in duration-700">
                                {viewMode === 'grid' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {currentMaterials.map(mat => (
                                            <MaterialCard
                                                key={mat._id}
                                                mat={mat}
                                                colorKey={mat.type === 'notes' ? 'blue' : mat.type === 'important_questions' ? 'yellow' : mat.type === 'video' ? 'red' : mat.type === 'question_paper' ? 'indigo' : 'purple'}
                                                icon={mat.type === 'video' ? Tv : mat.type === 'notes' ? BookOpen : mat.type === 'important_questions' ? Star : mat.type === 'question_paper' ? Download : LinkIcon}
                                                btnText={mat.type === 'notes' ? 'Read Notes' : mat.type === 'important_questions' ? 'View Questions' : mat.type === 'video' ? 'Watch Now' : mat.type === 'question_paper' ? 'Download PDF' : 'Visit Link'}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                                        {currentMaterials.map(mat => (
                                            <MaterialListRow
                                                key={mat._id}
                                                mat={mat}
                                                colorKey={mat.type === 'notes' ? 'blue' : mat.type === 'important_questions' ? 'yellow' : mat.type === 'video' ? 'red' : mat.type === 'question_paper' ? 'indigo' : 'purple'}
                                                icon={mat.type === 'video' ? Tv : mat.type === 'notes' ? BookOpen : mat.type === 'important_questions' ? Star : mat.type === 'question_paper' ? Download : LinkIcon}
                                                btnText={mat.type === 'notes' ? 'View PDF' : mat.type === 'important_questions' ? 'View' : mat.type === 'video' ? 'Watch' : mat.type === 'question_paper' ? 'Download' : 'Open'}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-20 text-center">
                                <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-400 tracking-tight">Vault Entry Not Found</h3>
                                <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mt-1">Try refining your filters or search keywords</p>
                                <button
                                    onClick={() => { setActiveCategory('all'); setSearchQuery(''); setSelectedYear('all'); setSelectedSemester('all'); }}
                                    className="mt-6 text-blue-600 font-bold hover:underline"
                                >
                                    Reset All Filters
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Materials;
