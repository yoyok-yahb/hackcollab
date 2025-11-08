import type { ImagePlaceholder } from './placeholder-images';
import { PlaceHolderImages } from './placeholder-images';

export interface Project {
  title: string;
  description: string;
  link?: string;
}

export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  skills: string[];
  experience: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  image: ImagePlaceholder;
  email?: string;
  projects: Project[];
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
  teamOpeningId: string;
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
    socialLinks: {
      github: 'https://github.com/alice',
      linkedin: 'https://linkedin.com/in/alice',
    },
    image: getUserImage('user1'),
    projects: [{ title: 'E-commerce Platform', description: 'Built a full-stack e-commerce site.', link: 'https://github.com/alice/ecom'}]
  },
  {
    id: 'user2',
    name: 'Bob',
    age: 24,
    bio: 'UX/UI designer focused on creating intuitive and user-centered designs. Loves to bring ideas to life with Figma.',
    skills: ['Figma', 'Sketch', 'Adobe XD', 'User Research', 'Prototyping'],
    experience: '3 years in design',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/bob',
    },
    image: getUserImage('user2'),
    projects: []
  },
  {
    id: 'user3',
    name: 'Charlie',
    age: 32,
    bio: 'Data scientist and Python expert. Fascinated by machine learning and its potential to solve real-world problems.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'scikit-learn', 'Pandas'],
    experience: '7 years in data science',
    socialLinks: {
      github: 'https://github.com/charlie',
    },
    image: getUserImage('user3'),
    projects: []
  },
  {
    id: 'user4',
    name: 'Diana',
    age: 29,
    bio: 'Product Manager with a knack for strategy and execution. I thrive in fast-paced environments and love building products users love.',
    skills: ['Product Strategy', 'Agile', 'Roadmapping', 'Jira'],
    experience: '6 years in product management',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/diana',
      twitter: 'https://twitter.com/diana'
    },
    image: getUserImage('user4'),
    projects: []
  },
  {
    id: 'user5',
    name: 'Ethan',
    age: 22,
    bio: 'Aspiring mobile developer, currently mastering Swift and Kotlin. Eager to learn and contribute to an exciting project.',
    skills: ['Swift', 'Kotlin', 'iOS', 'Android', 'Git'],
    experience: '1 year of personal projects',
    socialLinks: {
        github: 'https://github.com/ethan'
    },
    image: getUserImage('user5'),
    projects: []
  },
   {
    id: 'user6',
    name: 'Fiona',
    age: 27,
    bio: 'DevOps engineer who loves automating all the things. Let\'s build a solid and scalable infrastructure.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    experience: '4 years in DevOps',
    socialLinks: {
      github: 'https://github.com/fiona',
      linkedin: 'https://linkedin.com/in/fiona',
    },
    image: getUserImage('user6'),
    projects: []
  },
  {
    id: 'user7',
    name: 'George',
    age: 35,
    bio: 'Frontend wizard with expertise in creating pixel-perfect, performant user interfaces.',
    skills: ['Vue.js', 'Next.js', 'CSS-in-JS', 'Performance Optimization'],
    experience: '10+ years in frontend development',
    socialLinks: {
        github: 'https://github.com/george',
        twitter: 'https://twitter.com/george'
    },
    image: getUserImage('user7'),
    projects: []
  }
];

// Default user data, can be customized
const defaultUser: User = {
    id: `user${Date.now()}`,
    name: '',
    age: 18,
    bio: '',
    email: '',
    skills: [],
    experience: '',
    socialLinks: { github: '', linkedin: '', twitter: '' },
    image: getUserImage('user1'),
    projects: []
};

// Function to save user data to local storage
export const saveCurrentUser = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
};

export const getCurrentUser = (): User => {
    if (typeof window === 'undefined') {
        return defaultUser;
    }
    try {
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            // Ensure image is correctly loaded if it's just an id
            if (typeof parsedUser.image === 'string') {
                parsedUser.image = getUserImage(parsedUser.image);
            }
             // Ensure projects array exists
            if (!parsedUser.projects) {
                parsedUser.projects = [];
            }
            return parsedUser;
        }
        // If no user is saved, save the default one and return it
        saveCurrentUser(defaultUser);
        return defaultUser;
    } catch (error) {
        console.error("Failed to get current user from localStorage", error);
        return defaultUser;
    }
};

// Function to get a user by their ID
export const getUserById = (id: string) => {
    if (id === getCurrentUser().id) {
        return getCurrentUser();
    }
    return users.find(user => user.id === id);
}


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

let matches: Match[] = [];
if (typeof window !== 'undefined') {
    const savedMatches = localStorage.getItem('matches');
    if (savedMatches) {
        matches = JSON.parse(savedMatches).map((m: any) => ({...m, createdAt: new Date(m.createdAt)}));
    }
}

const saveMatches = () => {
     if (typeof window !== 'undefined') {
        localStorage.setItem('matches', JSON.stringify(matches));
    }
}

// Function to add a match
export const addMatch = (match: Omit<Match, 'id' | 'createdAt'>) => {
  const newMatch: Match = {
    ...match,
    id: `match${matches.length + 1}`,
    createdAt: new Date(),
  };
  matches.push(newMatch);
  saveMatches();
  return newMatch;
};

// Function to remove a match by its ID
export const removeMatch = (matchId: string) => {
  matches = matches.filter(match => match.id !== matchId);
  saveMatches();
};


// Function to get all matches
export const getMatches = () => {
    return matches;
}


export const getConversations = () => {
    const currentUser = getCurrentUser();
    const currentMatches = getMatches();
    return currentMatches.filter(m => m.userId1 === currentUser.id || m.userId2 === currentUser.id)
        .map(match => {
            const otherUserId = match.userId1 === currentUser.id ? match.userId2 : match.userId1;
            const otherUser = users.find(u => u.id === otherUserId)!;
            const teamOpening = teamOpenings.find(t => t.id === match.teamOpeningId);
            return {
                conversationId: `conv-${match.id}`,
                matchId: match.id,
                otherUser,
                teamOpeningTitle: teamOpening?.title || 'A Project',
                lastMessage: `You matched for ${teamOpening?.title || 'a project'}.`,
                lastMessageAt: match.createdAt
            }
        })
        .sort((a,b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime())
}
