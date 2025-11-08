import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  skills: string[];
  experience: string;
  preferences: string[];
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  image: ImagePlaceholder;
}

export interface TeamOpening {
  id: string;
  title: string;
  authorId: string;
  projectIdea: string;
  requiredRoles: string[];
  techStack: string[];
  createdAt: Date;
}

export interface Match {
  id: string;
  userId1: string;
  userId2: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: Date;
}

const getUserImage = (id: string): ImagePlaceholder => {
  return PlaceHolderImages.find((img) => img.id === id) || PlaceHolderImages[1];
};

export const users: User[] = [
  {
    id: 'user1',
    name: 'Alice',
    age: 28,
    bio: 'Full-stack developer with a passion for creating beautiful and functional web applications. Coffee enthusiast and dog lover.',
    skills: ['React', 'Node.js', 'TypeScript', 'GraphQL', 'Firebase'],
    experience: '5+ years in software development',
    preferences: ['Web Development', 'AI/ML', 'Social Good'],
    socialLinks: {
      github: 'https://github.com/alice',
      linkedin: 'https://linkedin.com/in/alice',
    },
    image: getUserImage('user1'),
  },
  {
    id: 'user2',
    name: 'Bob',
    age: 24,
    bio: 'UX/UI designer focused on creating intuitive and user-centered designs. Loves to bring ideas to life with Figma.',
    skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research', 'Prototyping'],
    experience: '3 years in design',
    preferences: ['Mobile App Design', 'SaaS', 'Fintech'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/bob',
    },
    image: getUserImage('user2'),
  },
  {
    id: 'user3',
    name: 'Charlie',
    age: 32,
    bio: 'Data scientist and Python expert. Fascinated by machine learning and its potential to solve real-world problems.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'scikit-learn', 'Pandas'],
    experience: '7 years in data science',
    preferences: ['AI/ML', 'Big Data', 'Healthtech'],
    socialLinks: {
      github: 'https://github.com/charlie',
    },
    image: getUserImage('user3'),
  },
  {
    id: 'user4',
    name: 'Diana',
    age: 29,
    bio: 'Product Manager with a knack for strategy and execution. I thrive in fast-paced environments and love building products users love.',
    skills: ['Product Strategy', 'Agile', 'Roadmapping', 'Jira'],
    experience: '6 years in product management',
    preferences: ['E-commerce', 'Social Media', 'Productivity Tools'],
    socialLinks: {
      linkedin: 'https://linkedin.com/in/diana',
      twitter: 'https://twitter.com/diana'
    },
    image: getUserImage('user4'),
  },
  {
    id: 'user5',
    name: 'Ethan',
    age: 22,
    bio: 'Aspiring mobile developer, currently mastering Swift and Kotlin. Eager to learn and contribute to an exciting project.',
    skills: ['Swift', 'Kotlin', 'iOS', 'Android', 'Git'],
    experience: '1 year of personal projects',
    preferences: ['Mobile App Design', 'Gaming', 'Social Media'],
    socialLinks: {
        github: 'https://github.com/ethan'
    },
    image: getUserImage('user5'),
  },
   {
    id: 'user6',
    name: 'Fiona',
    age: 27,
    bio: 'DevOps engineer who loves automating all the things. Let\'s build a solid and scalable infrastructure.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    experience: '4 years in DevOps',
    preferences: ['Cloud Infrastructure', 'Fintech', 'SaaS'],
    socialLinks: {
      github: 'https://github.com/fiona',
      linkedin: 'https://linkedin.com/in/fiona',
    },
    image: getUserImage('user6'),
  },
  {
    id: 'user7',
    name: 'George',
    age: 35,
    bio: 'Frontend wizard with expertise in creating pixel-perfect, performant user interfaces.',
    skills: ['Vue.js', 'Next.js', 'CSS-in-JS', 'Performance Optimization'],
    experience: '10+ years in frontend development',
    preferences: ['Web Development', 'E-commerce', 'Design Systems'],
    socialLinks: {
        github: 'https://github.com/george',
        twitter: 'https://twitter.com/george'
    },
    image: getUserImage('user7'),
  }
];

// Let's assume the current user is 'user1' (Alice) for context
export const getCurrentUser = () => users[0];


export const teamOpenings: TeamOpening[] = [
  {
    id: 'opening1',
    title: 'AI-Powered Personal Finance Advisor',
    authorId: 'user3',
    projectIdea: 'Build a mobile app that uses AI to analyze spending habits and provide personalized financial advice.',
    requiredRoles: ['Frontend Developer', 'UI/UX Designer'],
    techStack: ['React Native', 'Python', 'TensorFlow', 'Figma'],
    createdAt: new Date('2024-07-20T10:00:00Z'),
  },
  {
    id: 'opening2',
    title: 'Social App for Local Events',
    authorId: 'user4',
    projectIdea: 'A platform to help people discover and join local events and community activities, with a focus on spontaneous meetups.',
    requiredRoles: ['Full-stack Developer', 'Mobile Developer'],
    techStack: ['Next.js', 'Firebase', 'Swift', 'Kotlin'],
    createdAt: new Date('2024-07-19T14:30:00Z'),
  },
  {
    id: 'opening3',
    title: 'Gamified Language Learning Platform',
    authorId: 'user2',
    projectIdea: 'Create an engaging language learning app that uses gamification, leaderboards, and interactive stories to make learning fun.',
    requiredRoles: ['Backend Developer', 'Data Scientist'],
    techStack: ['Node.js', 'PostgreSQL', 'Python', 'React'],
    createdAt: new Date('2024-07-21T09:00:00Z'),
  },
];

export const matches: Match[] = [
    {
        id: 'match1',
        userId1: 'user1',
        userId2: 'user2',
        createdAt: new Date('2024-07-20T11:00:00Z'),
    },
    {
        id: 'match2',
        userId1: 'user1',
        userId2: 'user4',
        createdAt: new Date('2024-07-19T18:00:00Z'),
    }
];


export const getConversations = () => {
    const currentUser = getCurrentUser();
    return matches.filter(m => m.userId1 === currentUser.id || m.userId2 === currentUser.id)
        .map(match => {
            const otherUserId = match.userId1 === currentUser.id ? match.userId2 : match.userId1;
            const otherUser = users.find(u => u.id === otherUserId)!;
            return {
                conversationId: `conv-${match.id}`,
                otherUser,
                lastMessage: `Sounds good! Let's chat more.`,
                lastMessageAt: new Date(match.createdAt.getTime() + 1000 * 60 * 5)
            }
        })
        .sort((a,b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime())
}
