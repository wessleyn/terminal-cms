// TODO: Query directly from the skillicons dev site

const formatTag = (tag: string): string => {
  // Create a mapping for special cases
  const tagMap: Record<string, string> = {
    'Next.js': 'nextjs',
    'Node.js': 'nodejs',
    'Vue.js': 'vuejs',
    'React Native': 'react',
    'Tailwind CSS': 'tailwind',
    'Styled Components': 'styledcomponents',
    Express: 'express',
    MongoDB: 'mongodb',
    PostgreSQL: 'postgresql',
    GraphQL: 'graphql',
    'Material UI': 'materialui',
    Firebase: 'firebase',
    TypeScript: 'ts',
    JavaScript: 'js',
    CSS: 'css',
    HTML: 'html',
    Docker: 'docker',
    AWS: 'aws',
    Bootstrap: 'bootstrap',
    Redux: 'redux',
    Git: 'git',
    GitHub: 'github',
    Angular: 'angular',
    PHP: 'php',
    Python: 'python',
    Java: 'java',
  }

  // Return the mapped tag or format it correctly
  return tagMap[tag] || tag.toLowerCase().replace(/\s+/g, '').replace(/\./g, '')
}

export default formatTag
