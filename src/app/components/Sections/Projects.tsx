import CopyButton from '@/app/components/CopyButton';

interface Project {
  title: string;
  description: string;
  tags?: string[];
  githubUrl?: string;
}

interface ProjectsProps {
  projects: Project[];
}

export default function Projects({ projects }: ProjectsProps) {
  return (
    <section>
      <div className="border-l-2 border-white/50 pl-4 py-2">
        <h3 className="text-white font-bold mb-6 text-xl">PROJECTS</h3>
        
        {projects.length > 0 && (
          <div className="mb-8">
            <h4 className="font-bold text-white text-lg break-words">
              {projects[0].githubUrl ? (
                <a 
                  href={projects[0].githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white/80 transition-colors inline-flex items-center"
                >
                  <span className="break-all">{projects[0].title}</span>
                  <span className="ml-1 shrink-0">↗</span>
                </a>
              ) : (
                projects[0].title
              )}
            </h4>
            <p className="leading-relaxed mb-4 text-white max-w-3xl">{projects[0].description}</p>
            
            {projects[0].tags && (
              <div className="flex flex-wrap gap-2 mb-4">
                {projects[0].tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="bg-white/5 border border-white/50 text-white px-2 py-1 text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {projects[0].githubUrl && (
              <CopyButton text={`git clone ${projects[0].githubUrl}.git`} />
            )}
          </div>
        )}
        
        {projects.length > 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projects.slice(1).map((project, index) => (
              <div key={index} className="hover:bg-white/5 transition-colors p-4 rounded">
                <h4 className="font-bold text-white text-lg mb-2 break-words">
                  {project.githubUrl ? (
                    <a 
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white/80 transition-colors inline-flex items-center"
                    >
                      <span className="break-all">{project.title}</span>
                      <span className="ml-1 shrink-0">↗</span>
                    </a>
                  ) : (
                    project.title
                  )}
                </h4>
                <p className="leading-relaxed text-white">{project.description}</p>
                {project.tags && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="bg-white/5 border border-white/50 text-white px-2 py-1 text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {project.githubUrl && (
                  <div className="overflow-x-auto">
                    <CopyButton text={`git clone ${project.githubUrl}.git`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 