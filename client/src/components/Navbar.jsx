import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Home as HomeIcon, Search, FileText, ChevronRight, X, BookOpen, Download, Star, Tv, Link as LinkIcon, Compass } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);

    const categories = [
        { id: 'notes', label: 'Notes', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'pyq', label: 'PYQs', icon: Download, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { id: 'imp', label: 'Important', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { id: 'video', label: 'Videos', icon: Tv, color: 'text-red-600', bg: 'bg-red-50' },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            if (searchTerm.length < 2) {
                setResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const res = await axios.get('http://localhost:5001/api/materials');
                const filtered = res.data.filter(m =>
                    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    m.type.toLowerCase().includes(searchTerm.toLowerCase())
                ).slice(0, 8);
                setResults(filtered);
            } catch (err) {
                console.error(err);
            } finally {
                setIsSearching(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleResultClick = (mat) => {
        navigate(`/materials?university=${mat.university}`);
        setShowResults(false);
        setSearchTerm('');
    };

    return (
        <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center gap-6">
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
                            EduVault
                        </span>
                    </Link>

                    {/* Global Features Area (Search + Filters) */}
                    <div className="flex-1 max-w-2xl flex items-center gap-4">
                        <div className="flex-1 relative" ref={searchRef}>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search notes, PYQs, subjects..."
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-bold placeholder:text-gray-400 shadow-inner"
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setShowResults(true); }}
                                    onFocus={() => setShowResults(true)}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>

                            {/* List-wise Results Dropdown */}
                            {showResults && (searchTerm.length >= 2) && (
                                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50 ring-1 ring-black/5">
                                    {isSearching ? (
                                        <div className="p-8 text-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Searching Vault...</p>
                                        </div>
                                    ) : results.length > 0 ? (
                                        <div className="max-h-[450px] overflow-y-auto scrollbar-thin">
                                            <div className="px-5 py-3 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50/50 sticky top-0">Search Results</div>
                                            {results.map(mat => (
                                                <button
                                                    key={mat._id}
                                                    onClick={() => handleResultClick(mat)}
                                                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-all border-b border-gray-50 last:border-0 group"
                                                >
                                                    <div className="flex items-center gap-4 text-left min-w-0">
                                                        <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-blue-600 shadow-sm transition-colors`}>
                                                            <FileText className="w-5 h-5" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-black text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{mat.title}</div>
                                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{mat.subject} • {mat.year}</div>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                                </button>
                                            ))}
                                            <div className="p-3 bg-gray-50 text-center">
                                                <button className="text-[10px] font-black text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors">See all {results.length}+ results</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-10 text-center">
                                            <X className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                                            <p className="text-sm font-bold text-gray-800">No resources found</p>
                                            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Try a broad term like "Notes"</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Quick Category Filters in Navbar */}
                        <div className="hidden lg:flex items-center gap-2 p-1.5 bg-gray-50 rounded-2xl border border-gray-100">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => { setSearchTerm(cat.label); setShowResults(true); }}
                                    className={`p-2 rounded-xl transition-all hover:bg-white hover:shadow-sm group flex items-center gap-2 pr-4`}
                                    title={cat.label}
                                >
                                    <div className={`w-8 h-8 rounded-lg ${cat.bg} ${cat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                        <cat.icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-900">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                        <Link to="/" className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg hover:shadow-blue-500/30 hover:scale-110 transition-all">
                            <HomeIcon className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
