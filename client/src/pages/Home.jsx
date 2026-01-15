import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, School, ArrowRight, PlayCircle, FileText, CheckCircle, Link as LinkIcon } from 'lucide-react';

const UniversitySection = ({ universities, navigate }) => (
    <div id="universities" className="py-16 bg-white w-full flex flex-col items-center px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Select Your University</h2>
        <p className="text-gray-500 mb-12 text-center max-w-2xl">Find study materials specific to your curriculum.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {universities.map(uni => (
                <div
                    key={uni._id}
                    onClick={() => navigate(`/materials?university=${uni._id}`)}
                    className="bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 cursor-pointer group hover:-translate-y-1"
                >
                    <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm mb-6 group-hover:scale-110 transition-transform">
                        <School className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{uni.name}</h2>
                    <p className="text-gray-500 mb-6 line-clamp-2">{uni.description || 'Access course materials, notes, and previous year papers.'}</p>
                    <div className="flex items-center text-blue-600 font-semibold text-sm">
                        Browse Materials <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const Home = () => {
    const [universities, setUniversities] = useState([]);
    const [showUniversities, setShowUniversities] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const loadUniversities = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/universities`);
                setUniversities(res.data);
            } catch (err) {
                console.error('Failed to load universities:', err);
            }
        };
        loadUniversities();
    }, []);

    if (showUniversities) {
        return (
            <div className="min-h-screen bg-gray-50">
                <UniversitySection universities={universities} navigate={navigate} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gray-50 pt-16 pb-32">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
                    <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-blue-100">
                        For College Students
                    </span>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                        Ace Your Exams with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">EduVault Resources</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
                        Access Previous Year Question Papers (PYQs), Lecture Notes, Video Playlists, and Important Questions tailored to your university syllabus.
                    </p>

                    <button
                        onClick={() => setShowUniversities(true)}
                        className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 hover:shadow-blue-500/30 transition-all flex items-center gap-2 group"
                    >
                        Start Learning Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mt-20 w-full max-w-6xl">
                        {[
                            { icon: <BookOpen className="w-6 h-6" />, label: "Lecture Notes" },
                            { icon: <FileText className="w-6 h-6" />, label: "PYQs" },
                            { icon: <CheckCircle className="w-6 h-6" />, label: "Imp. Questions" },
                            { icon: <PlayCircle className="w-6 h-6" />, label: "Video Playlist" },
                            { icon: <LinkIcon className="w-6 h-6" />, label: "Learning Links" },
                        ].map((feature, i) => (
                            <div key={i} className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-gray-700">
                                    {feature.icon}
                                </div>
                                <span className="font-semibold text-gray-700">{feature.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* University Section (Pre-rendered but hidden initially if we want smooth transition, but simpler to just swap logic above) */}
            {/* The logic above swaps the view entirely when button is clicked */}
        </div>
    );
};

export default Home;
