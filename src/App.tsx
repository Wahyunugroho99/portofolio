/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Cpu, Code2, Globe, Database, Terminal, 
  Github, Linkedin, Mail, MessageSquare, 
  ChevronRight, ExternalLink, Award, Layers,
  Settings, PenTool, Radio, Rocket, Shield,
  Menu, X, Smartphone, Server, Hexagon,
  Microchip, Bot, Box, Zap, Brain, Lock,
  ScanFace, Activity, LayoutDashboard, History
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AdminPortal } from './components/AdminPortal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Project {
  id: string;
  title: string;
  desc: string;
  tech: string[];
  images: string[];
  createdAt?: string;
}

// --- Data Section ---
const skills = [
  { name: 'ROS2', level: 92, icon: <Cpu />, cat: 'Robotics' },
  { name: 'Electronic Design', level: 90, icon: <Microchip />, cat: 'Hardware' },
  { name: 'Soldering & Assembly', level: 94, icon: <Zap />, cat: 'Hardware' },
  { name: 'Python', level: 95, icon: <Code2 />, cat: 'Programming' },
  { name: 'C++', level: 85, icon: <Terminal />, cat: 'Programming' },
  { name: 'YOLO', level: 90, icon: <ScanFace />, cat: 'AI & Vision' },
  { name: 'Deep Learning', level: 88, icon: <Brain />, cat: 'AI & Vision' },
  { name: 'Machine Learning', level: 86, icon: <Activity />, cat: 'AI & Vision' },
  { name: 'OpenCV', level: 90, icon: <LayoutDashboard />, cat: 'AI & Vision' },
  { name: 'JavaScript', level: 85, icon: <Globe />, cat: 'Web' },
  { name: 'Node.js', level: 82, icon: <Server />, cat: 'Web' },
  { name: 'GitHub', level: 90, icon: <Github />, cat: 'Tools' },
  { name: 'API', level: 92, icon: <Zap />, cat: 'Integration' },
  { name: 'Docker', level: 84, icon: <Box />, cat: 'DevOps' },
];

const INITIAL_PROJECTS = [
  {
    id: "shuttlebot-capstone",
    title: "Shuttlebot (Capstone Project)",
    desc: "Penelitian Unggulan Perguruan Tinggi - Bertanggung jawab sebagai Electrical & Programmer Project Shuttlebot untuk otomasi transportasi logistik kampus.",
    tech: ["Electrical", "Programming", "Autonomous", "Robotics"],
    images: ["https://images.unsplash.com/photo-1535378620166-273708d44e4c?q=80&w=800"]
  },
  {
    id: "line-follower-pid",
    title: "Line Follower with PID & Kalman",
    desc: "Robot pengikut garis presisi tinggi menggunakan algoritma PID untuk stabilitas dan Kalman Filter untuk noise filtering sensor.",
    tech: ["PID", "Kalman Filter", "C++", "Sensors"],
    images: ["https://images.unsplash.com/photo-1531746790731-6c087fecd05a?q=80&w=800"]
  },
  {
    id: "robot-fire",
    title: "Robot Fire Fight",
    desc: "Robot pemadam api otonom yang mendeteksi sumber panas dan memadamkan api menggunakan sistem pompa terintegrasi.",
    tech: ["Sensors", "Automation", "Embedded", "Robotics"],
    images: ["https://images.unsplash.com/photo-1485081666427-bc3f789314da?q=80&w=800"]
  },
  {
    id: "arm-robot-6dof-yolo",
    title: "Arm Robot 6 DOF Pick & Place",
    desc: "Lengan robot 6 derajat kebebasan yang terintegrasi dengan YOLO untuk deteksi objek dan pergerakan pick and place otomatis.",
    tech: ["YOLO", "Computer Vision", "6 DOF", "Pick & Place"],
    images: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800"]
  },
  {
    id: "voice-emotional-deep",
    title: "Voice Emotional Analysis",
    desc: "Sistem pengenalan emosi dari suara manusia menggunakan Deep Learning untuk interaksi manusia-mesin yang lebih natural.",
    tech: ["Deep Learning", "Signal Processing", "Python", "AI"],
    images: ["https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=800"]
  },
  {
    id: "robot-4dof-ros2-cv",
    title: "Robot 4 DOF with ROS2 & CV",
    desc: "Robot 4 derajat kebebasan menggunakan framework ROS2 yang terintegrasi penuh dengan Computer Vision untuk navigasi.",
    tech: ["ROS2", "Computer Vision", "Python", "Embedded"],
    images: ["https://images.unsplash.com/photo-1561144443-01053428172c?q=80&w=800"]
  },
  {
    id: "iot-smart-home-vision",
    title: "IoT Smart Home with Vision",
    desc: "Sistem rumah pintar berbasis IoT yang menggunakan pengenalan visual untuk kontrol akses dan manajemen perangkat.",
    tech: ["IoT", "Computer Vision", "Smart Home", "Connected"],
    images: ["https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800"]
  }
];

const hardwareStack = [
  { name: 'Jetson Nano', desc: 'Edge AI computing', icon: <Hexagon /> },
  { name: 'Raspberry Pi', desc: 'Main controller & server', icon: <Cpu /> },
  { name: 'STM32', desc: 'High-performance micro', icon: <Zap /> },
  { name: 'ESP32', desc: 'IoT & wireless links', icon: <Radio /> },
  { name: 'Arduino', desc: 'Sensor interfacing', icon: <Layers /> },
];

const activities = [
  { title: "Robotics Development", icon: <Bot />, desc: "Designing mechanical and electrical systems for autonomous robots." },
  { title: "Hardware Testing", icon: <Zap />, desc: "Benchmarking performance for motors, sensors, and microcontrollers." },
  { title: "Linux Development", icon: <Terminal />, desc: "Optimizing kernel and OS environment for real-time robotic applications." },
  { title: "ROS2 Programming", icon: <Cpu />, desc: "Building modular node architectures and custom message protocols." },
  { title: "Web Development", icon: <Code2 />, desc: "Architecting scalable web solutions for remote robot control." },
  { title: "Open Source Learning", icon: <Globe />, desc: "Contributing and learning from the global robotics community." },
];

const achievements = [
  {
    title: "Juara 1 Lomba Robot Nasional",
    desc: "Tingkat Nasional - Prestasi tertinggi dalam kompetisi robotika skala nasional.",
    icon: <Award className="w-5 h-5" />
  },
  {
    title: "Juara 2 Lomba Robot (KRTI Wilayah)",
    desc: "Kontes Robot Terbang Indonesia tingkat wilayah - Pencapaian dalam desain UAV.",
    icon: <Rocket className="w-5 h-5" />
  },
  {
    title: "Sertifikasi AI Ready ASEAN",
    desc: "Hour of Code Training - Sertifikasi internasional dalam dasar-dasar kecerdasan buatan.",
    icon: <Brain className="w-5 h-5" />
  },
  {
    title: "Juara 1 KRTI Nasional",
    desc: "Kontes Robot Terbang Indonesia - Pemenang kategori nasional tingkat universitas.",
    icon: <Award className="w-5 h-5" />
  },
  {
    title: "Juara 2 KRTI Wilayah",
    desc: "Kontes Robot Terbang Indonesia - Runner up dalam kategori desain sistem terbang.",
    icon: <Rocket className="w-5 h-5" />
  }
];

// --- Sub-Components ---

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      scrolled ? "bg-white/80 backdrop-blur-xl border-b border-slate-200 py-3 shadow-sm" : "bg-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-navy-main flex items-center justify-center rounded-sm rotate-45 group-hover:rotate-180 transition-all duration-500">
            <Cpu className="-rotate-45 group-hover:-rotate-180 transition-all duration-500 text-amber-accent" size={20} />
          </div>
          <span className="text-xl font-bold tracking-tighter text-navy-main font-display uppercase italic text-left">
            Wahyu<span className="text-amber-accent">.</span>sys
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-xs font-mono tracking-widest uppercase text-muted-gray">
          {navLinks.map(link => (
            <a key={link.name} href={link.href} className="hover:text-amber-accent transition-colors font-bold">
              {link.name}
            </a>
          ))}
          <a href="#contact" className="px-5 py-2 border-2 border-navy-main text-navy-main hover:bg-navy-main transition-all hover:text-white rounded-sm font-bold uppercase tracking-wider">
            Establish Connection
          </a>
        </div>

        {/* Mobile Nav Toggle */}
        <button className="md:hidden text-navy-main" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-slate-200 p-6 md:hidden shadow-xl"
          >
            <div className="flex flex-col gap-6 font-mono text-sm uppercase tracking-widest">
              {navLinks.map(link => (
                <a key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="text-navy-main hover:text-amber-accent font-bold">
                  {link.name}
                </a>
              ))}
              <a href="#contact" onClick={() => setIsOpen(false)} className="text-amber-accent font-bold">
                Contact Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionTitle = ({ title, subtitle, icon }: { title: string, subtitle: string, icon?: React.ReactNode }) => (
  <div className="mb-16 relative text-left">
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 mb-2"
    >
      {icon && <div className="p-2 border border-navy-main/30 text-navy-main">{icon}</div>}
      <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-navy-main uppercase italic font-display">
        {title}<span className="text-amber-accent animate-pulse">_</span>
      </h2>
    </motion.div>
    <div className="h-1 w-32 bg-gradient-to-r from-navy-main to-transparent mb-4" />
    <p className="text-muted-gray font-mono text-xs uppercase tracking-[0.2em]">{subtitle}</p>
  </div>
);

// --- Main App Component ---

export default function App() {
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('https://images.unsplash.com/photo-1535378620166-273708d44e4c?q=80&w=800');

  // Sync Projects and Settings from localStorage
  useEffect(() => {
    const loadData = () => {
      // Load Projects
      const storedProjects = localStorage.getItem('wahyu_projects');
      if (storedProjects) {
        setProjects(JSON.parse(storedProjects));
      } else {
        localStorage.setItem('wahyu_projects', JSON.stringify(INITIAL_PROJECTS));
        setProjects(INITIAL_PROJECTS);
      }

      // Load Profile Settings
      const storedSettings = localStorage.getItem('wahyu_settings');
      if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        if (settings.profileImage) {
          setProfilePhoto(settings.profileImage);
        }
      }
      
      setLoading(false);
    };

    loadData();

    const handleProjectUpdate = () => loadData();
    const handleSettingsUpdate = () => loadData();
    
    window.addEventListener('wahyu_projects_updated', handleProjectUpdate);
    window.addEventListener('wahyu_settings_updated', handleSettingsUpdate);
    
    return () => {
      window.removeEventListener('wahyu_projects_updated', handleProjectUpdate);
      window.removeEventListener('wahyu_settings_updated', handleSettingsUpdate);
    };
  }, []);

  const [lightbox, setLightbox] = useState<{ isOpen: boolean; images: string[]; currentIndex: number }>({
    isOpen: false,
    images: [],
    currentIndex: 0
  });

  const openLightbox = (images: string[], index: number = 0) => {
    setLightbox({ isOpen: true, images, currentIndex: index });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightbox(prev => ({ ...prev, isOpen: false }));
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
    }));
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightbox.isOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox.isOpen]);

  const allGalleryImages = [
    "https://images.unsplash.com/photo-1581092334651-ddf26d9a1930?q=80&w=800",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800",
    "https://images.unsplash.com/photo-1561144443-01053428172c?q=80&w=800",
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800",
    "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=800",
    "https://images.unsplash.com/photo-1518433278985-16d1f93f6696?q=80&w=800"
  ];

  return (
    <div className="relative overflow-x-hidden text-navy-main">
      <AnimatePresence>
        {lightbox.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-main/95 backdrop-blur-2xl px-6 py-12"
            onClick={closeLightbox}
          >
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 90 }}
              className="absolute top-8 right-8 text-white/50 hover:text-amber-accent p-2 bg-white/5 rounded-full transition-all"
              onClick={closeLightbox}
            >
              <X size={32} />
            </motion.button>

            {lightbox.images.length > 1 && (
              <>
                <button 
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-amber-accent p-4 transition-all"
                  onClick={prevImage}
                >
                  <ChevronRight className="rotate-180" size={48} />
                </button>
                <button 
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-amber-accent p-4 transition-all"
                  onClick={nextImage}
                >
                  <ChevronRight size={48} />
                </button>
              </>
            )}

            <div className="relative max-w-5xl w-full max-h-full flex items-center justify-center p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={lightbox.currentIndex}
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 1.1, x: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="relative group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img 
                    src={lightbox.images[lightbox.currentIndex]} 
                    className="max-w-full max-h-[80vh] object-contain border border-white/10 shadow-2xl shadow-amber-accent/10"
                    alt="Enlarged Project" 
                  />
                  <div className="absolute inset-x-0 top-0 h-1 bg-amber-accent/50 animate-scan hidden md:block" />
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 font-mono text-[10px] tracking-widest text-white/50 uppercase">
                    <span className="text-amber-accent">Data_Capture</span>
                    <span className="opacity-30">|</span>
                    <span>{lightbox.currentIndex + 1} / {lightbox.images.length}</span>
                    <span className="opacity-30">|</span>
                    <span>Resolution: 1080P_</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        style={{ y: backgroundY }}
        className="fixed inset-0 -z-10 bg-bg-site"
      >
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] right-[-5%] w-[40%] h-[40%] bg-navy-main/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-5 pointer-events-none" 
          style={{ 
            backgroundImage: `linear-gradient(#1b2631 1px, transparent 1px), linear-gradient(90deg, #1b2631 1px, transparent 1px)`,
            backgroundSize: '40px 40px' 
          }} 
        />
      </motion.div>

      <Nav />

      <section className="min-h-screen flex items-center pt-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <h1 className="text-6xl md:text-8xl font-black text-navy-main mb-4 tracking-tighter leading-[0.85] font-display">
              <motion.span transition={{ delay: 0.2 }} className="block">WAHYU</motion.span>
              <motion.span transition={{ delay: 0.4 }} className="block text-muted-gray italic text-4xl md:text-6xl">ROBOTICS_DEV</motion.span>
            </h1>
            <div className="flex flex-wrap gap-4 mb-10 text-sm font-mono text-muted-gray">
              <span className="flex items-center gap-2"><Cpu size={14} className="text-amber-accent" /> Robotics Programmer</span>
              <span className="flex items-center gap-2"><Settings size={14} className="text-amber-accent" /> ROS2 Developer</span>
              <span className="flex items-center gap-2"><Code2 size={14} className="text-amber-accent" /> Web Developer</span>
            </div>
            
            <div className="flex flex-col sm:row gap-4">
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-amber-accent hover:bg-amber-500 text-navy-main px-8 py-4 rounded-sm flex items-center justify-center gap-3 transition-colors font-bold uppercase tracking-wider text-sm shadow-lg shadow-amber-accent/20 group"
              >
                View Projects <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <motion.a
                href="#contact"
                whileHover={{ backgroundColor: 'rgba(27,38,49,0.05)' }}
                className="border border-slate-300 px-8 py-4 rounded-sm transition-colors uppercase text-sm tracking-widest font-bold text-navy-main text-center"
              >
                Contact Me
              </motion.a>
            </div>
          </motion.div>

          <div className="hidden lg:flex justify-end relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative w-96 h-[500px]"
            >
              <div className="absolute inset-x-0 bottom-0 top-12 bg-white border border-slate-200 shadow-xl rounded-sm overflow-hidden group">
                <img 
                  src={profilePhoto} 
                  alt="Wahyu Profile" 
                  className="w-full h-full object-cover object-top grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-main/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 text-left">
                  <div className="text-[10px] font-mono text-amber-accent font-bold mb-1">DATAID: W_77189</div>
                  <div className="text-white font-bold tracking-widest text-lg uppercase">SYSTEMS_ACTIVE</div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-amber-accent pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-amber-accent pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </section>

      <section id="about" className="py-24 px-6 relative bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div className="space-y-8 text-left">
              <div className="inline-block px-4 py-1 bg-navy-main/5 border-l-4 border-navy-main text-navy-main font-mono text-xs uppercase tracking-widest font-bold">
                System Context
              </div>
              <h3 className="text-4xl font-bold text-navy-main tracking-tighter uppercase italic leading-tight">
                Architecting the future of <span className="text-amber-accent">Autonomous Systems</span>
              </h3>
              <p className="text-muted-gray text-lg leading-relaxed max-w-xl font-[system-ui]">
                “Saya adalah developer yang fokus pada pengembangan robotika, embedded system, ROS2, dan web development. Berpengalaman membangun robot arm berbasis Raspberry Pi, inverse kinematics, sistem kontrol servo, dan integrasi hardware-software.”
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {[
                  { val: '4+', label: 'Arm DOF' },
                  { val: 'ROS2', label: 'Framework' },
                  { val: '100%', label: 'Stability' },
                ].map(stat => (
                  <div key={stat.label} className="p-4 bg-white border border-slate-200 shadow-sm group hover:border-amber-accent transition-colors">
                    <div className="text-2xl font-bold text-navy-main mb-1 group-hover:text-amber-accent transition-colors">{stat.val}</div>
                    <div className="text-[10px] text-muted-gray uppercase tracking-widest font-mono font-bold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="space-y-6 text-left">
              <div className="text-xs font-mono uppercase tracking-[0.3em] text-muted-gray mb-8 flex justify-between">
                <span>Core Competencies</span>
              </div>
              {skills.slice(0, 6).map((skill, idx) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest">
                    <span className="flex items-center gap-2 text-navy-main font-bold">
                      {skill.icon} {skill.name}
                    </span>
                    <span className="text-amber-accent font-bold">{skill.level}%</span>
                  </div>
                  <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: idx * 0.1 }}
                      viewport={{ once: true }}
                      className="h-full bg-amber-accent relative"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionTitle 
            title="Technology Stack" 
            subtitle="Hardened toolset for modern engineering" 
            icon={<Cpu />}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {skills.map((skill, idx) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, borderColor: 'rgba(255, 159, 0, 0.4)' }}
                className="p-8 bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:bg-slate-50 transition-all relative group"
              >
                <div className="text-navy-main mb-6 group-hover:text-amber-accent group-hover:scale-110 transition-all duration-300">
                  {React.cloneElement(skill.icon as React.ReactElement, { size: 40 })}
                </div>
                <h4 className="text-xl font-bold text-navy-main mb-2 font-display">{skill.name}</h4>
                <div className="text-[10px] uppercase font-mono text-muted-gray tracking-widest mb-4 font-bold">{skill.cat}</div>
                <div className="h-[2px] w-12 bg-navy-main/20 group-hover:w-full group-hover:bg-amber-accent transition-all duration-500" />
              </motion.div>
            ))}
          </div>

          <div className="mt-24 text-left">
            <div className="text-xs font-mono uppercase tracking-[0.3em] text-muted-gray mb-12 flex items-center gap-4">
              <History size={16} className="text-amber-accent" />
              <span>Hardware Development Chassis</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {hardwareStack.map((hw, idx) => (
                <motion.div
                  key={hw.name}
                  whileHover={{ y: -5 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 bg-slate-50 border border-slate-200 text-center group"
                >
                  <div className="text-navy-main mb-4 flex justify-center group-hover:text-amber-accent transition-colors">
                    {React.cloneElement(hw.icon as React.ReactElement, { size: 32 })}
                  </div>
                  <h5 className="font-bold text-sm text-navy-main uppercase font-display">{hw.name}</h5>
                  <p className="text-[10px] text-muted-gray mt-1 uppercase font-mono">{hw.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="Deployment Archive" 
            subtitle="From mechanical logic to industrial software" 
            icon={<Layers />}
          />
          <div className="flex flex-col gap-24">
            {loading ? (
              <div className="text-center py-20 font-mono text-muted-gray animate-pulse italic uppercase tracking-[0.3em]">
                Retrieving_Archives...
              </div>
            ) : projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className={cn(
                  "grid lg:grid-cols-5 gap-12 items-center group",
                  idx % 2 !== 0 && "lg:order-last"
                )}
              >
                <div 
                  className={cn(
                    "lg:col-span-3 h-[400px] md:h-[500px] relative overflow-hidden rounded-sm border border-slate-200 cursor-zoom-in shadow-xl",
                    idx % 2 !== 0 && "lg:order-2"
                  )}
                  onClick={() => openLightbox(project.images)}
                >
                  <img 
                    src={project.images[0]} 
                    alt={project.title} 
                    className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-100 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-navy-main/10 group-hover:bg-transparent transition-all pointer-events-none" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-navy-main/20 backdrop-blur-sm">
                    <span className="px-6 py-2 border-2 border-amber-accent text-amber-accent font-mono text-xs uppercase tracking-[0.4em] bg-white/90 shadow-xl font-bold">
                      Expand_View
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-6 text-left">
                  <h3 className="text-4xl md:text-5xl font-black text-navy-main italic group-hover:text-amber-accent transition-colors duration-500 leading-tight">
                    {project.title}
                  </h3>
                  <div className={cn("flex flex-wrap gap-2", idx % 2 !== 0 && "lg:justify-end")}>
                    {project.tech.map(t => (
                      <span key={t} className="px-3 py-1 bg-navy-main/5 border border-navy-main/10 text-navy-main text-[10px] font-mono tracking-tighter uppercase font-bold">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-gray text-lg">
                    {project.desc}
                  </p>
                  <div className={cn("flex gap-4 pt-4", idx % 2 !== 0 && "lg:justify-end")}>
                    <button className="flex items-center gap-2 text-xs font-mono font-bold text-navy-main hover:text-amber-accent transition-colors group/btn">
                      <Github size={16} /> REPOSITORY <ExternalLink size={14} className="opacity-0 group-hover/btn:opacity-100 transition-all -translate-y-1" />
                    </button>
                    <button className="flex items-center gap-2 text-xs font-mono font-bold text-navy-main hover:text-amber-accent transition-colors group/btn">
                      LIVE DEMO <ExternalLink size={14} className="opacity-0 group-hover/btn:opacity-100 transition-all -translate-y-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="Live Operations" 
            subtitle="Execution stream [Standalone Mode]" 
            icon={<Settings />}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {activities.map((activity, idx) => (
              <motion.div
                key={activity.title}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-white border border-slate-200 flex flex-col gap-6 group hover:bg-slate-50 transition-all relative overflow-hidden shadow-sm hover:shadow-md"
              >
                <div className="p-4 bg-navy-main border border-navy-main group-hover:bg-amber-accent group-hover:border-amber-accent transition-all w-fit shadow-lg text-white">
                   {React.cloneElement(activity.icon as React.ReactElement, { size: 28 })}
                </div>
                <div>
                  <div className="text-navy-main font-bold text-lg tracking-tight mb-2 uppercase italic font-display group-hover:text-amber-accent transition-colors">{activity.title}</div>
                  <p className="text-sm text-muted-gray leading-relaxed italic">{activity.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionTitle 
            title="Systems Gallery" 
            subtitle="Visual proof of hardware integration" 
            icon={<Globe />}
          />
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {allGalleryImages.map((img, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="relative group overflow-hidden rounded-sm border border-slate-200 cursor-zoom-in shadow-sm"
                onClick={() => openLightbox(allGalleryImages, i)}
              >
                <img src={img} alt="Robotics" className="w-full grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-navy-main/60 to-transparent">
                  <div className="text-[10px] font-mono text-amber-accent uppercase tracking-widest font-bold">Image_Capture_0{i+1}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-32 px-6 border-t border-slate-200 bg-slate-50 relative">
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <SectionTitle 
            title={isAdminMode ? "Admin Control" : "Init Connection"} 
            subtitle={isAdminMode ? "System override active. Local storage mode." : "Secure communication established"} 
            icon={isAdminMode ? <Lock /> : <Radio />}
          />

          {isAdminMode ? (
            <AdminPortal />
          ) : (
            <div className="grid md:grid-cols-2 gap-16 text-left">
              <div className="space-y-12">
                <div>
                  <h4 className="text-navy-main font-bold uppercase tracking-widest italic mb-6">Contact Channels_</h4>
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { icon: <Github />, label: 'GitHub', link: 'https://github.com/Wahyunugroho99' },
                      { icon: <Linkedin />, label: 'LinkedIn', link: 'https://www.linkedin.com/in/wahyu-nugroho-05a001288' },
                      { icon: <Mail />, label: 'Email', link: 'mailto:w4hyunugroho123@gmail.com' },
                    ].map(channel => (
                      <a key={channel.label} href={channel.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 bg-white border border-slate-200 shadow-sm flex items-center justify-center text-muted-gray group-hover:text-amber-accent group-hover:border-amber-accent transition-all">
                          {channel.icon}
                        </div>
                        <span className="text-xs font-mono uppercase tracking-widest text-muted-gray group-hover:text-navy-main transition-colors font-bold">{channel.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
                <div className="p-8 border-l-2 border-navy-main bg-white shadow-sm">
                  <blockquote className="text-muted-gray italic text-lg leading-relaxed">
                    "Menyelesaikan masalah hardware dengan algoritma cerdas adalah passion saya."
                  </blockquote>
                </div>
              </div>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as typeof e.target & {
                    name: { value: string };
                    email: { value: string };
                    message: { value: string };
                  };
                  const subject = encodeURIComponent(`Connection Request from ${target.name.value}`);
                  const body = encodeURIComponent(`Name: ${target.name.value}\nEmail: ${target.email.value}\n\nMessage:\n${target.message.value}`);
                  window.location.href = `mailto:w4hyunugroho123@gmail.com?subject=${subject}&body=${body}`;
                }}
                className="space-y-6"
              >
                <input required name="name" type="text" placeholder="Your Name" className="w-full bg-white border border-slate-200 p-4 font-mono focus:border-amber-accent outline-none text-navy-main shadow-sm" />
                <input required name="email" type="email" placeholder="Your Email" className="w-full bg-white border border-slate-200 p-4 font-mono focus:border-amber-accent outline-none text-navy-main shadow-sm" />
                <textarea required name="message" rows={5} placeholder="Your message..." className="w-full bg-white border border-slate-200 p-4 font-mono focus:border-amber-accent outline-none text-navy-main resize-none shadow-sm" />
                <button type="submit" className="w-full bg-amber-accent hover:bg-amber-500 text-navy-main font-bold py-5 uppercase tracking-[0.3em] font-mono rounded-sm transition-all shadow-lg active:scale-95">
                  Establish Connection
                </button>
              </form>
            </div>
          )}
          
          <div className="mt-24 pt-12 border-t border-slate-200 flex flex-col items-center gap-4 relative z-20">
            <AnimatePresence>
              {showKeyInput && !isAdminMode && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] flex items-center justify-center bg-navy-main/98 backdrop-blur-xl px-6"
                >
                  {/* Background Grid */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" 
                    style={{ 
                      backgroundImage: `linear-gradient(#ff9f00 1px, transparent 1px), linear-gradient(90deg, #ff9f00 1px, transparent 1px)`,
                      backgroundSize: '40px 40px' 
                    }} 
                  />
                  
                  {/* Scanline Effect */}
                  <div className="absolute inset-x-0 top-0 h-2 bg-amber-accent/20 animate-scan pointer-events-none" />

                  <motion.div 
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="max-w-md w-full bg-navy-main border border-amber-accent/50 p-8 shadow-[0_0_50px_rgba(255,159,0,0.1)] relative overflow-hidden"
                  >
                    {/* Decorative corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-accent" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-accent" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-accent" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-accent" />

                    <div className="flex flex-col items-center gap-8 relative z-10">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full border-2 border-amber-accent flex items-center justify-center text-amber-accent animate-pulse shadow-[0_0_20px_rgba(255,159,0,0.4)]">
                          <Lock size={32} />
                        </div>
                        <h2 className="text-xl font-bold text-amber-accent tracking-[0.3em] font-mono italic uppercase">Terminal_Auth</h2>
                      </div>

                      <div className="w-full space-y-4">
                        <div className="text-[10px] font-mono text-amber-accent/60 uppercase tracking-widest text-center">
                          Encrypted_Override_Session_Required
                        </div>
                        <div className="relative">
                          <input 
                            type="password"
                            value={adminKey}
                            onChange={(e) => setAdminKey(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                if (adminKey === 'wahyu123') {
                                  setIsAdminMode(true);
                                  sessionStorage.setItem('wahyu_admin_auth', 'true');
                                  setShowKeyInput(false);
                                  setAdminKey('');
                                } else {
                                  alert("🚨 ACCESS_DENIED: Critical Authentication Failure");
                                }
                              }
                              if (e.key === 'Escape') setShowKeyInput(false);
                            }}
                            placeholder="DECRYPT_KEY_ID"
                            className="w-full bg-navy-main/50 border-b-2 border-amber-accent/30 focus:border-amber-accent p-4 font-mono text-lg text-amber-accent outline-none text-center tracking-[0.5em] transition-all placeholder:text-amber-accent/20"
                            autoFocus
                          />
                          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-amber-accent/10 pointer-events-none" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-4 w-full">
                        <button 
                          onClick={() => {
                            if (adminKey === 'wahyu123') {
                              setIsAdminMode(true);
                              sessionStorage.setItem('wahyu_admin_auth', 'true');
                              setShowKeyInput(false);
                              setAdminKey('');
                            } else {
                              alert("🚨 ACCESS_DENIED: Critical Authentication Failure");
                            }
                          }}
                          className="w-full bg-amber-accent text-navy-main font-bold py-4 uppercase tracking-[0.2em] font-mono hover:bg-amber-500 transition-all shadow-lg active:scale-95"
                        >
                          [ Initialize_Override ]
                        </button>
                        <button 
                          onClick={() => setShowKeyInput(false)}
                          className="w-full border border-amber-accent/30 text-amber-accent/50 py-3 font-mono text-[10px] uppercase tracking-widest hover:text-amber-accent hover:border-amber-accent transition-all"
                        >
                          [ Abort_Sequence ]
                        </button>
                      </div>

                      <div className="w-full flex justify-between pt-4 border-t border-amber-accent/10">
                        <div className="text-[8px] font-mono text-amber-accent/40 uppercase">Status: Awaiting_Input</div>
                        <div className="text-[8px] font-mono text-amber-accent/40 uppercase">Node: ASIA_SE_RUN</div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              id="admin-terminal-button"
              onClick={() => {
                if (isAdminMode) {
                  setIsAdminMode(false);
                } else {
                  setShowKeyInput(!showKeyInput);
                }
              }}
              className="text-[10px] font-mono text-muted-gray hover:text-amber-accent uppercase tracking-[0.4em] transition-all font-bold px-8 py-6 min-h-[44px] hover:bg-navy-main/5 rounded-sm flex items-center justify-center cursor-pointer active:scale-95"
            >
              {isAdminMode ? "Return to Main System" : "Administrator Terminal Access (Local Only)"}
            </button>
          </div>
        </div>
      </section>

      <footer className="py-24 border-t border-slate-200 bg-white px-6 relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-accent shadow-[0_-10px_40px_rgba(255,159,0,0.3)]" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 items-center relative z-10 text-left">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy-main flex items-center justify-center rounded-sm rotate-45">
                <Cpu size={18} className="text-amber-accent -rotate-45" />
              </div>
              <div className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-navy-main">Wahyu.Robotics_OS</div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="text-[10px] font-mono text-muted-gray uppercase tracking-widest font-bold">Network Status</div>
          </div>
          <div className="flex flex-col md:items-end gap-2 text-right">
            <div className="text-[9px] font-mono text-muted-gray uppercase tracking-widest mt-2">© 2024 Wahyu • [LOCAL_STORAGE_MODE]</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
