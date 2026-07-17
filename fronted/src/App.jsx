import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    // Conectando con tu backend contenerizado en FastAPI
    fetch('http://127.0.0.1:8000/api/cv')
      .then((response) => response.json())
      .then((data) => {
        setCvData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error cargando el CV:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-mono">Cargando base de datos desde Docker...</div>;
  }

  if (!cvData || !cvData.profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-mono text-red-500 p-4 text-center">
        <p className="text-xl font-bold mb-2">🚨 Error de conexión</p>
        <p>No se pudo conectar al API en <code>http://127.0.0.1:8000/api/cv</code>.</p>
        <p className="text-sm mt-2 text-gray-400">Asegúrate de que tus contenedores de Docker estén corriendo (docker-compose up -d).</p>
      </div>
    );
  }

  const { profile, projects, experience } = cvData;

  return (
    <div className={`min-h-screen p-6 md:p-16 transition-colors duration-500 relative overflow-hidden ${
      isDevMode 
        ? 'bg-slate-950 text-emerald-400 font-mono selection:bg-emerald-500 selection:text-black' 
        : 'bg-white text-gray-900 font-serif'
    }`}>
      
      {/* EFECTO SCANLINE DE MONITOR HACKER (Solo en Modo Dev) */}
      {isDevMode && (
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] z-50 opacity-40"></div>
      )}

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Botón Theme Switcher */}
        <div className="flex justify-end mb-8">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDevMode(!isDevMode)}
            className={`px-4 py-2 text-sm font-sans border rounded transition-all cursor-pointer ${
              isDevMode 
                ? 'border-emerald-500 bg-slate-900 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                : 'border-gray-800 hover:bg-gray-100 text-gray-800 shadow-sm'
            }`}
          >
            {isDevMode ? '>_ [sudo] switch_to_harvard()' : '⚙️ Modo Ingeniero / Ciberseguridad'}
          </motion.button>
        </div>

        {/* CONTENIDO ANIMADO AL CAMBIAR DE TEMA */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isDevMode ? 'dev' : 'harvard'}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* Cabecera */}
            <header className={`border-b-2 pb-6 mb-8 text-center ${isDevMode ? 'border-emerald-500/50' : 'border-gray-900'}`}>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase mb-2">
                {profile.name}
              </h1>
              <p className={`text-base md:text-lg mb-1 ${isDevMode ? 'text-emerald-300' : 'text-gray-700 font-sans font-medium'}`}>
                {profile.title}
              </p>
              <p className="text-sm opacity-80 font-sans">
                {profile.location} | <span className="underline cursor-pointer hover:opacity-100">LinkedIn</span> | <span className="underline cursor-pointer hover:opacity-100">GitHub</span>
              </p>
            </header>

            {/* Resumen Profesional */}
            <section className="mb-8">
              <h2 className={`text-xl font-bold uppercase tracking-wider border-b mb-4 pb-1 ${isDevMode ? 'border-emerald-800 text-emerald-300' : 'border-gray-400 text-gray-900'}`}>
                {isDevMode ? '// Perfil Profesional & Hardening' : 'Perfil Profesional'}
              </h2>
              <p className="leading-relaxed text-justify">
                {profile.about}
              </p>
            </section>

            {/* Habilidades Técnicas (Redes & Seguridad) */}
            <section className="mb-8">
              <h2 className={`text-xl font-bold uppercase tracking-wider border-b mb-4 pb-1 ${isDevMode ? 'border-emerald-800 text-emerald-300' : 'border-gray-400 text-gray-900'}`}>
                {isDevMode ? '// Stack Técnico | Redes & Seguridad' : 'Habilidades Técnicas'}
              </h2>
              <div className="flex flex-wrap gap-2 pt-2 font-sans text-sm">
                {profile.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className={`px-3 py-1 rounded border ${
                      isDevMode 
                        ? 'bg-slate-900 border-emerald-500/40 text-emerald-300 font-mono text-xs shadow-[0_0_8px_rgba(16,185,129,0.1)]' 
                        : 'bg-gray-100 border-gray-300 text-gray-800 font-semibold'
                    }`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            {/* Proyectos Destacados con Previews de GitHub */}
            <section className="mb-8">
              <h2 className={`text-xl font-bold uppercase tracking-wider border-b mb-4 pb-1 ${isDevMode ? 'border-emerald-800 text-emerald-300' : 'border-gray-400 text-gray-900'}`}>
                {isDevMode ? '// Proyectos de Arquitectura & Repositorios' : 'Proyectos Destacados'}
              </h2>
              <div className="space-y-6">
                {projects.map((project) => (
                  <a 
                    key={project.id} 
                    href={project.link || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`block p-5 rounded border transition-all duration-300 transform hover:-translate-y-1 ${
                      isDevMode 
                        ? 'border-emerald-500/30 bg-slate-900/80 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                        : 'border-gray-200 hover:border-gray-400 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      
                      {/* VISTA PREVIA AUTOMÁTICA DE GITHUB (OPENGRAPH) */}
                      {project.link && project.link.includes('github.com') && (
                        <div className="w-full md:w-48 h-28 shrink-0 overflow-hidden rounded border border-gray-700/50 bg-gray-800">
                          <img 
                            src={`https://opengraph.githubassets.com/1/${project.link.replace('https://github.com/', '')}`} 
                            alt={`Vista previa de ${project.title}`}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      )}

                      {/* TEXTO DEL PROYECTO */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-lg font-bold flex items-center gap-2">
                            {isDevMode ? `>_ ./projects/${project.title}` : project.title}
                          </h3>
                          <span className="text-xs opacity-70">↗ Ver en GitHub</span>
                        </div>
                        <p className="text-sm leading-relaxed mb-3 opacity-90">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 font-sans">
                          {project.tech_stack.map((tech, i) => (
                            <span key={i} className={`text-xs px-2 py-0.5 rounded ${
                              isDevMode ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' : 'bg-gray-100 text-gray-700 font-semibold'
                            }`}>
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* Experiencia */}
            <section className="mb-8">
              <h2 className={`text-xl font-bold uppercase tracking-wider border-b mb-4 pb-1 ${isDevMode ? 'border-emerald-800 text-emerald-300' : 'border-gray-400 text-gray-900'}`}>
                {isDevMode ? '// Experiencia Laboral & Gestión' : 'Experiencia'}
              </h2>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between font-bold mb-1">
                      <h3 className="text-lg">{exp.role} — <span className="font-normal italic">{exp.company}</span></h3>
                      <span className="text-sm font-sans opacity-80">{exp.period}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-sm pl-2">
                      {exp.description.map((item, i) => (
                        <li key={i} className="leading-relaxed">{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}

export default App;