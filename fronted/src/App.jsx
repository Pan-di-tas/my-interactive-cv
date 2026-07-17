import React, { useState, useEffect } from 'react';

function App() {
  const [cvData, setCvData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si lo subes a Render, reemplaza esta URL local por el link de tu API en vivo
    fetch('[https://my-interactive-cv-cgc6.onrender.com/api/cv](https://my-interactive-cv-cgc6.onrender.com/api/cv)')
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
    <div className="min-h-screen bg-white text-gray-900 font-serif p-6 md:p-16">
      <div className="max-w-4xl mx-auto">
        
        {/* Cabecera */}
        <header className="border-b-2 border-gray-900 pb-6 mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight uppercase mb-2">
            {profile.name}
          </h1>
          <p className="text-base md:text-lg text-gray-700 font-sans font-medium mb-1">
            {profile.title}
          </p>
          <p className="text-sm opacity-80 font-sans">
            {profile.location} |{' '}
            <a 
              href="https://www.linkedin.com/in/abdiel-antonio-magaña-ayala-6a558335a" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline cursor-pointer hover:opacity-100 font-semibold text-blue-900"
            >
              LinkedIn
            </a>{' '}
            |{' '}
            <a 
              href="https://github.com/Pan-di-tas" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline cursor-pointer hover:opacity-100 font-semibold text-gray-900"
            >
              GitHub
            </a>
          </p>
        </header>

        {/* Resumen Profesional */}
        <section className="mb-8">
          <h2 className="text-xl font-bold uppercase tracking-wider border-b border-gray-400 text-gray-900 mb-4 pb-1">
            Perfil Profesional
          </h2>
          <p className="leading-relaxed text-justify">
            {profile.about}
          </p>
        </section>

        {/* Habilidades Técnicas */}
        <section className="mb-8">
          <h2 className="text-xl font-bold uppercase tracking-wider border-b border-gray-400 text-gray-900 mb-4 pb-1">
            Habilidades Técnicas
          </h2>
          <div className="flex flex-wrap gap-2 pt-2 font-sans text-sm">
            {profile.skills.map((skill, index) => (
              <span 
                key={index} 
                className="px-3 py-1 rounded border bg-gray-100 border-gray-300 text-gray-800 font-semibold"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Proyectos Destacados con Vistas Previas */}
        <section className="mb-8">
          <h2 className="text-xl font-bold uppercase tracking-wider border-b border-gray-400 text-gray-900 mb-4 pb-1">
            Proyectos Destacados
          </h2>
          <div className="space-y-6">
            {projects.map((project) => (
              <a 
                key={project.id} 
                href={project.link || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-5 rounded border border-gray-200 hover:border-gray-400 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  
                  {/* Vista Previa OpenGraph de GitHub */}
                  {project.link && project.link.includes('github.com') && (
                    <div className="w-full md:w-48 h-28 shrink-0 overflow-hidden rounded border border-gray-300 bg-gray-100">
                      <img 
                        src={`https://opengraph.githubassets.com/1/${project.link.replace('https://github.com/', '')}`} 
                        alt={`Vista previa de ${project.title}`}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}

                  {/* Texto del Proyecto */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-bold">
                        {project.title}
                      </h3>
                      <span className="text-xs opacity-70">↗ Ver en GitHub</span>
                    </div>
                    <p className="text-sm leading-relaxed mb-3 opacity-90">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 font-sans">
                      {project.tech_stack.map((tech, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-semibold">
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

        {/* Experiencia Laboral & Operativa */}
        <section className="mb-8">
          <h2 className="text-xl font-bold uppercase tracking-wider border-b border-gray-400 text-gray-900 mb-4 pb-1">
            Experiencia
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

      </div>
    </div>
  );
}

export default App;