
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
  rating: {
    average: number;
    count: number;
  };
}

export type TaskStatus = 'Not Started Yet' | 'Ongoing' | 'Completed';

export interface Task {
  id: string;
  openingId: string;
  description: string;
  status: TaskStatus;
  assignedTo?: string;
  deadline?: Date;
  createdAt: Date;
}


export interface TeamOpening {
  id: string;
  authorId: string;
  hackathonName: string;
  hackathonLink?: string;
  location: string; // Venue
  problemStatement?: string;
  requiredRoles: string[];
  techStack: string[];
  deadline: Date;
  hackathonEndDate: Date;
  createdAt: Date;
  approvedMembers: string[];
  tasks: Task[];
  title?: string;
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

export let users: User[] = [
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
    projects: [{ title: 'E-commerce Platform', description: 'Built a full-stack e-commerce site.', link: 'https://github.com/alice/ecom'}],
    rating: { average: 4.8, count: 15 }
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
    projects: [],
    rating: { average: 4.5, count: 8 }
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
    projects: [],
    rating: { average: 4.9, count: 22 }
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
    projects: [],
    rating: { average: 4.7, count: 12 }
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
    projects: [],
    rating: { average: 4.2, count: 5 }
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
    projects: [],
    rating: { average: 4.6, count: 9 }
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
    projects: [],
    rating: { average: 4.9, count: 30 }
  }
];

if (typeof window !== 'undefined') {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
}

const saveUsers = () => {
     if (typeof window !== 'undefined') {
        localStorage.setItem('users', JSON.stringify(users));
    }
}


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
    projects: [],
    rating: { average: 0, count: 0 },
};

// Function to save user data to local storage
export const saveCurrentUser = (user: User) => {
  if (typeof window !== 'undefined') {
    const userToSave = { ...user };
    
    // Check if the image is a large base64 string. If so, don't save it to avoid quota errors.
    // In a real app, you would upload this to a storage service and save the URL.
    if (userToSave.image.imageUrl && userToSave.image.imageUrl.startsWith('data:image')) {
       userToSave.image.imageUrl = user.image.imageUrl;
    }

    localStorage.setItem('currentUser', JSON.stringify(userToSave));

    const userIndex = users.findIndex(u => u.id === userToSave.id);
    if(userIndex > -1) {
        users[userIndex] = userToSave;
    } else {
        users.push(userToSave);
    }
    saveUsers();
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
            if (typeof parsedUser.image === 'string' || !parsedUser.image.imageUrl) {
                parsedUser.image = getUserImage(parsedUser.image?.id || parsedUser.id || 'user1');
            }
             // Ensure projects array exists
            if (!parsedUser.projects) {
                parsedUser.projects = [];
            }
            if (!parsedUser.rating) {
                parsedUser.rating = { average: 0, count: 0 };
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
    if (id === 'system') {
      return { id: 'system', name: 'System', image: { imageUrl: '', imageHint: '', id: '', description: '' }, age: 0, bio: '', skills: [], experience: '', socialLinks: {}, projects: [], rating: { average: 0, count: 0 } };
    }
    if (getCurrentUser().id === id) {
        return getCurrentUser();
    }
    return users.find(user => user.id === id);
}

export const rateUser = (userId: string, rating: number) => {
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        const user = users[userIndex];
        const currentTotalRating = user.rating.average * user.rating.count;
        const newCount = user.rating.count + 1;
        const newAverage = (currentTotalRating + rating) / newCount;
        
        users[userIndex].rating = {
            average: parseFloat(newAverage.toFixed(1)),
            count: newCount,
        };

        // If the rated user is the current user, update localStorage
        const currentUser = getCurrentUser();
        if (currentUser.id === userId) {
            saveCurrentUser(users[userIndex]);
        }

        saveUsers();
        return users[userIndex];
    }
    return null;
}


let teamOpenings: TeamOpening[] = [
  {
    id: 'opening1',
    authorId: 'user3',
    hackathonName: 'AI Finance Hack',
    location: 'Remote',
    hackathonLink: 'https://example.com/hackathon/ai-finance',
    problemStatement: 'Build a mobile app that uses AI to analyze spending habits and provide personalized financial advice.',
    requiredRoles: ['Frontend Developer', 'UI/UX Designer', 'Data Scientist'],
    techStack: ['React Native', 'Python', 'TensorFlow', 'Figma', 'Firebase'],
    deadline: new Date('2026-02-01'),
    hackathonEndDate: new Date('2026-02-04'),
    createdAt: new Date(),
    approvedMembers: [],
    tasks: [],
    title: 'AI Finance Hack'
  },
  {
    id: 'opening2',
    authorId: 'user4',
    hackathonName: 'NYC Connect',
    location: 'New York, NY',
    hackathonLink: 'https://example.com/hackathon/nyc-connect',
    problemStatement: 'A platform to help people discover and join local events and community activities, with a focus on spontaneous meetups.',
    requiredRoles: ['Full-stack Developer', 'Mobile Developer (iOS)'],
    techStack: ['Next.js', 'Firebase', 'Swift', 'Mapbox API'],
    deadline: new Date('2026-03-01'),
    hackathonEndDate: new Date('2026-03-04'),
    createdAt: new Date(),
    approvedMembers: [],
    tasks: [],
    title: 'NYC Connect'
  },
  {
    id: 'opening3',
    authorId: 'user2',
    hackathonName: 'Language Gamify',
    location: 'San Francisco, CA',
    hackathonLink: 'https://example.com/hackathon/lang-gamify',
    problemStatement: 'Create an engaging language learning app that uses gamification, leaderboards, and interactive stories to make learning fun.',
    requiredRoles: ['Backend Developer (Node.js)', 'Data Scientist', 'Frontend Developer'],
    techStack: ['Node.js', 'PostgreSQL', 'Python', 'React', 'D3.js'],
    deadline: new Date('2026-04-01'),
    hackathonEndDate: new Date('2026-04-04'),
    createdAt: new Date(),
    approvedMembers: ['user1'],
    tasks: [],
    title: 'Language Gamify'
  },
  {
    id: 'opening4',
    authorId: 'user7',
    hackathonName: 'HealthTech Innovation 2024',
    location: 'Boston, MA',
    hackathonLink: 'https://example.com/hackathon/healthtech-2024',
    problemStatement: 'Develop a wearable tech solution to monitor and improve posture for remote workers.',
    requiredRoles: ['Firmware Engineer', 'Mobile Developer (Android)', 'Cloud Backend Engineer'],
    techStack: ['C++', 'Kotlin', 'GCP', 'Bluetooth LE'],
    deadline: new Date('2026-05-01'),
    hackathonEndDate: new Date('2026-05-04'),
    createdAt: new Date(),
    approvedMembers: [],
    tasks: [],
    title: 'HealthTech Innovation 2024'
  },
   {
    id: 'opening5',
    authorId: 'user6',
    hackathonName: 'DeFi Future',
    location: 'Remote',
    hackathonLink: 'https://example.com/hackathon/defi-future',
    problemStatement: 'Design a decentralized identity verification system using blockchain to enhance security and privacy in financial applications.',
    requiredRoles: ['Blockchain Developer', 'Smart Contract Auditor', 'Frontend Dev (React)'],
    techStack: ['Solidity', 'Ethereum', 'Hardhat', 'Next.js', 'ethers.js'],
    deadline: new Date('2026-06-01'),
    hackathonEndDate: new Date('2026-06-04'),
    createdAt: new Date(),
    approvedMembers: [],
    tasks: [],
    title: 'DeFi Future'
  }
];

const parseOpeningDates = (openings: any[]): TeamOpening[] => {
    return openings.map(o => ({
        ...o,
        createdAt: new Date(o.createdAt),
        deadline: new Date(o.deadline),
        hackathonEndDate: new Date(o.hackathonEndDate),
        approvedMembers: o.approvedMembers || [],
        tasks: (o.tasks || []).map((t: any) => ({ ...t, createdAt: new Date(t.createdAt), deadline: t.deadline ? new Date(t.deadline) : undefined })),
    }));
}

export const getTeamOpenings = (): TeamOpening[] => {
    if (typeof window === 'undefined') {
        return parseOpeningDates(teamOpenings);
    }
    try {
        const savedOpenings = localStorage.getItem('teamOpenings');
        if (savedOpenings) {
            return parseOpeningDates(JSON.parse(savedOpenings));
        } else {
            localStorage.setItem('teamOpenings', JSON.stringify(teamOpenings));
            return parseOpeningDates(teamOpenings);
        }
    } catch (e) {
        console.error("Failed to get team openings from localStorage", e);
        return parseOpeningDates(teamOpenings);
    }
}


const saveTeamOpenings = (openings: TeamOpening[]) => {
    if (typeof window !== 'undefined') {
       localStorage.setItem('teamOpenings', JSON.stringify(openings));
   }
}

export const addTeamOpening = (opening: Omit<TeamOpening, 'id' | 'createdAt' | 'approvedMembers' | 'tasks'>) => {
    let currentOpenings = getTeamOpenings();
    const newOpening: TeamOpening = {
      ...opening,
      id: `opening${Date.now()}`,
      createdAt: new Date(),
      approvedMembers: [],
      tasks: [],
    };
    currentOpenings = [newOpening, ...currentOpenings];
    saveTeamOpenings(currentOpenings);
    
    // Create a group chat for the new opening
    addGroupChatPlaceholder(newOpening);

    return newOpening;
}

export const updateTeamOpening = (updatedOpening: TeamOpening) => {
  let openings = getTeamOpenings();
  const openingIndex = openings.findIndex(o => o.id === updatedOpening.id);

  if (openingIndex !== -1) {
    openings[openingIndex] = updatedOpening;
    saveTeamOpenings(openings);
  }
};

export const deleteTeamOpening = (openingId: string) => {
  let openings = getTeamOpenings();
  openings = openings.filter(o => o.id !== openingId);
  saveTeamOpenings(openings);
};


export const approveMemberForOpening = (openingId: string, userId: string) => {
  let openings = getTeamOpenings();
  const openingIndex = openings.findIndex(o => o.id === openingId);

  if (openingIndex !== -1) {
    const opening = openings[openingIndex];
    if (!opening.approvedMembers) {
      opening.approvedMembers = [];
    }
    if (!opening.approvedMembers.includes(userId)) {
      opening.approvedMembers.push(userId);
      openings[openingIndex] = opening;
      saveTeamOpenings(openings);

      const user = getUserById(userId);
      if (user) {
        addMessage({
            conversationId: `conv-group-${openingId}`,
            senderId: 'system',
            text: `${user.name} has been added to the team.`
        });
      }
    }
  }
};

export const removeMemberFromOpening = (openingId: string, userId: string) => {
  let openings = getTeamOpenings();
  const openingIndex = openings.findIndex(o => o.id === openingId);

  if (openingIndex !== -1) {
    const opening = openings[openingIndex];
    const user = getUserById(userId);
    const initialMemberCount = opening.approvedMembers.length;
    
    opening.approvedMembers = opening.approvedMembers.filter(id => id !== userId);
    
    if (opening.approvedMembers.length < initialMemberCount) {
      openings[openingIndex] = opening;
      saveTeamOpenings(openings);

      if (user) {
        addMessage({
            conversationId: `conv-group-${openingId}`,
            senderId: 'system',
            text: `${user.name} has been removed from the team.`
        });
      }
    }
  }
};


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
  // Prevent duplicate matches for the same opening
  const existingMatch = matches.find(m => 
    m.teamOpeningId === match.teamOpeningId &&
    ((m.userId1 === match.userId1 && m.userId2 === match.userId2) || (m.userId1 === match.userId2 && m.userId2 === match.userId1))
  );

  if (existingMatch) {
    return existingMatch;
  }
  
  const newMatch: Match = {
    ...match,
    id: `match${Date.now()}`,
    createdAt: new Date(),
  };
  matches.push(newMatch);
  saveMatches();
  // Also create a conversation
  addConversationPlaceholder(newMatch);

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

let messages: Message[] = [];
if (typeof window !== 'undefined') {
    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
        messages = JSON.parse(savedMessages).map((m: any) => ({...m, createdAt: new Date(m.createdAt)}));
    } else {
        localStorage.setItem('messages', '[]');
    }
}

const saveMessages = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('messages', JSON.stringify(messages));
    }
}

const addConversationPlaceholder = (match: Match) => {
    const openings = getTeamOpenings();
    const opening = openings.find(o => o.id === match.teamOpeningId);
    // Don't add placeholder if messages already exist for this conversation
    const conversationId = `conv-match-${match.id}`;
    const existingMessages = messages.filter(m => m.conversationId === conversationId);
    if(existingMessages.length > 0) return;

    addMessage({
        conversationId: conversationId,
        senderId: 'system',
        text: `You matched for "${opening?.hackathonName || 'a project'}". Say hi!`
    });
}

const addGroupChatPlaceholder = (opening: TeamOpening) => {
    const conversationId = `conv-group-${opening.id}`;
    const existingMessages = messages.filter(m => m.conversationId === conversationId);
    if(existingMessages.length > 0) return;

    addMessage({
        conversationId,
        senderId: 'system',
        text: `Group chat for "${opening.hackathonName}" created.`,
    });
};


export const getMessagesForConversation = (conversationId: string) => {
    return messages
        .filter(m => m.conversationId === conversationId)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

export const addMessage = (message: Omit<Message, 'id' | 'createdAt'>) => {
    const newMessage: Message = {
        ...message,
        id: `msg-${Date.now()}`,
        createdAt: new Date(),
    };
    messages.push(newMessage);
    saveMessages();
    return newMessage;
}

const getLastMessageForConversation = (conversationId: string): Message | undefined => {
    const convMessages = messages
        .filter(m => m.conversationId === conversationId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return convMessages[0];
}


export const getConversations = () => {
    const currentUser = getCurrentUser();
    const currentMatches = getMatches();
    const openings = getTeamOpenings();
    return currentMatches.filter(m => m.userId1 === currentUser.id || m.userId2 === currentUser.id)
        .map(match => {
            const otherUserId = match.userId1 === currentUser.id ? match.userId2 : match.userId1;
            const otherUser = users.find(u => u.id === otherUserId)!;
            const teamOpening = openings.find(t => t.id === match.teamOpeningId);
            const conversationId = `conv-match-${match.id}`;
            const lastMessage = getLastMessageForConversation(conversationId);

            return {
                conversationId,
                matchId: match.id,
                teamOpeningId: teamOpening?.id,
                otherUser,
                teamOpeningTitle: teamOpening?.hackathonName || 'A Project',
                lastMessage: lastMessage?.text || `You matched for ${teamOpening?.hackathonName || 'a project'}.`,
                lastMessageAt: lastMessage?.createdAt || match.createdAt
            }
        })
        .sort((a,b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime())
}

export const getGroupConversations = () => {
    const currentUser = getCurrentUser();
    const allOpenings = getTeamOpenings();

    // User is part of a group chat if they created the opening OR if they are an approved member
    const userOpenings = allOpenings.filter(o => o.authorId === currentUser.id || o.approvedMembers.includes(currentUser.id));

    return userOpenings.map(opening => {
        const conversationId = `conv-group-${opening.id}`;
        const lastMessage = getLastMessageForConversation(conversationId);

        return {
            conversationId,
            opening,
            lastMessage: lastMessage?.text || `Group chat for "${opening.hackathonName}"`,
            lastMessageAt: lastMessage?.createdAt || opening.createdAt,
        };
    })
    .sort((a,b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
}


export const getTasksForOpening = (openingId: string): Task[] => {
    const openings = getTeamOpenings();
    const opening = openings.find(o => o.id === openingId);
    return opening?.tasks.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()) || [];
}

export const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const openings = getTeamOpenings();
    const openingIndex = openings.findIndex(o => o.id === taskData.openingId);
    if (openingIndex === -1) {
        throw new Error('Opening not found');
    }

    const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}`,
        createdAt: new Date(),
    };
    
    openings[openingIndex].tasks.push(newTask);
    saveTeamOpenings(openings);
    return newTask;
}

export const updateTask = (updatedTask: Task): Task => {
    const openings = getTeamOpenings();
    const openingIndex = openings.findIndex(o => o.id === updatedTask.openingId);
    if (openingIndex === -1) {
        throw new Error('Opening not found');
    }

    const taskIndex = openings[openingIndex].tasks.findIndex(t => t.id === updatedTask.id);
    if (taskIndex === -1) {
        throw new Error('Task not found');
    }
    
    openings[openingIndex].tasks[taskIndex] = updatedTask;
    saveTeamOpenings(openings);
    return updatedTask;
}

    

    