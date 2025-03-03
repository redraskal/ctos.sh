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

        {projects.map((project, index) => (
          <div key={index} className="mb-8">
            <h4 className="font-bold text-white text-lg break-words">
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  className="hover:text-white/80 transition-colors inline-flex items-center"
                >
                  <span className="break-all">{project.title}</span>
                  <span className="ml-1 shrink-0">↗</span>
                </a>
              ) : (
                project.title
              )}
            </h4>
            <p className="leading-relaxed mb-4 text-white max-w-3xl">{project.description}</p>

            {project.tags && (
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="bg-white/5 border border-white/50 text-white px-2 py-1 text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {project.githubUrl && <CopyButton text={`git clone ${project.githubUrl}.git`} />}
          </div>
        ))}
      </div>
    </section>
  );
}
