
'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { analyzeProblemStatement, AnalyzeProblemStatementOutput, AnalyzeProblemStatementInput } from '@/ai/flows/analyze-problem-statement';
import { suggestProblemStatements, SuggestProblemStatementsOutput, SuggestProblemStatementsInput } from '@/ai/flows/suggest-problem-statements';
import { generalHackathonQuery } from '@/ai/flows/general-hackathon-query';
import { getCurrentUser } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Send, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type Message = {
  id: string;
  text: string | React.ReactNode;
  sender: 'user' | 'bot';
  isButtonPrompt?: boolean;
};

type ConversationState = 
  | 'idle'
  | 'awaiting_problem_statement_for_analysis'
  | 'awaiting_solution_info'
  | 'awaiting_domain_for_suggestion'
  | 'awaiting_statement_choice';

export default function LearnPage() {
  const currentUser = getCurrentUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hi there! I am your AI assistant. How can I help you with your hackathon project today?',
      isButtonPrompt: true
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>('idle');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages]);

  const addMessage = (sender: 'user' | 'bot', text: string | React.ReactNode, isButtonPrompt = false) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), sender, text, isButtonPrompt }]);
  };

  const handleInitialChoice = (choice: 'analyze' | 'suggest') => {
    const userMessage = choice === 'analyze' ? 'Analyze my problem statement' : 'Suggest problem statements';
    addMessage('user', userMessage);
    
    // Remove buttons from the initial prompt
    setMessages(prev => prev.map(m => m.isButtonPrompt ? { ...m, isButtonPrompt: false } : m));
    
    if (choice === 'analyze') {
      setConversationState('awaiting_problem_statement_for_analysis');
      setTimeout(() => addMessage('bot', 'Great! Please share the problem statement you have chosen.'), 500);
    } else {
      setConversationState('awaiting_domain_for_suggestion');
      setTimeout(() => addMessage('bot', 'Of course! What domain or area are you interested in? (e.g., healthcare, finance, education)'), 500);
    }
  };

  const processAIResponse = (response: any, type: 'analysis' | 'suggestion' | 'general') => {
    if (type === 'analysis') {
        const analysisJsx = (
            <Card className="bg-background">
                <CardContent className="p-4 space-y-4">
                    <div>
                        <h4 className="font-bold">Solution:</h4>
                        <p className="text-sm">{response.solution}</p>
                    </div>
                    <div>
                        <h4 className="font-bold">Tech Stack:</h4>
                        <p className="text-sm">{response.techStack.join(', ')}</p>
                    </div>
                    <div>
                        <h4 className="font-bold">Required Skills:</h4>
                        <p className="text-sm">{response.requiredSkills.join(', ')}</p>
                    </div>
                     <div>
                        <h4 className="font-bold">Workflow Diagram:</h4>
                        <p className="text-sm whitespace-pre-wrap font-mono">{response.workflowDiagram}</p>
                    </div>
                     <div>
                        <h4 className="font-bold">Estimated Build Time:</h4>
                        <p className="text-sm">{response.estimatedBuildTime}</p>
                    </div>
                     <div>
                        <h4 className="font-bold">Feasibility:</h4>
                        <p className="text-sm">{response.feasibility}</p>
                    </div>
                </CardContent>
            </Card>
        );
        addMessage('bot', analysisJsx);
    } else if (type === 'suggestion') {
        const suggestionJsx = (
             <div className="space-y-2">
                {response.map((item: any, index: number) => (
                    <Card key={index} className="bg-background">
                        <CardContent className="p-4">
                            <p className="font-semibold">{index + 1}. {item.statement}</p>
                            <p className="text-sm text-muted-foreground">Difficulty: {item.difficulty}</p>
                        </CardContent>
                    </Card>
                ))}
             </div>
        );
        addMessage('bot', suggestionJsx);
        setTimeout(() => addMessage('bot', "Let me know which one you'd like to analyze, or you can provide your own."), 500);
    } else if (type === 'general') {
        addMessage('bot', response.answer);
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    addMessage('user', userMessage);
    setInput('');
    setIsLoading(true);

    try {
        if (conversationState === 'awaiting_problem_statement_for_analysis' || conversationState === 'awaiting_statement_choice') {
            const analysis = await analyzeProblemStatement({ problemStatement: userMessage });
            processAIResponse(analysis, 'analysis');
            setConversationState('idle');
        } else if (conversationState === 'awaiting_domain_for_suggestion') {
            const suggestions = await suggestProblemStatements({ domain: userMessage });
            processAIResponse(suggestions, 'suggestion');
            setConversationState('awaiting_statement_choice');
        } else {
             // Fallback for general conversation
            const response = await generalHackathonQuery({ query: userMessage });
            processAIResponse(response, 'general');
            setConversationState('idle');
        }
    } catch (err) {
        addMessage('bot', 'Sorry, I ran into an error. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <ScrollArea className="flex-1 mb-4 pr-4" ref={scrollAreaRef}>
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={cn('flex items-start gap-4', message.sender === 'user' && 'justify-end')}>
              {message.sender === 'bot' && (
                <Avatar className="h-8 w-8 border">
                  <div className="flex h-full w-full items-center justify-center bg-primary">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                </Avatar>
              )}
              <div className={cn(
                'max-w-xl rounded-lg p-3 text-sm',
                message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card text-card-foreground'
              )}>
                {typeof message.text === 'string' ? <p>{message.text}</p> : message.text}
                {message.isButtonPrompt && (
                    <div className="mt-4 flex gap-2">
                        <Button variant="secondary" size="sm" onClick={() => handleInitialChoice('analyze')}>Analyze my problem statement</Button>
                        <Button variant="secondary" size="sm" onClick={() => handleInitialChoice('suggest')}>Suggest problem statements</Button>
                    </div>
                )}
              </div>
               {message.sender === 'user' && (
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={currentUser.image.imageUrl} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
             <div className='flex items-start gap-4'>
                 <Avatar className="h-8 w-8 border">
                  <div className="flex h-full w-full items-center justify-center bg-primary">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                </Avatar>
                 <div className="bg-card text-card-foreground rounded-lg p-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                 </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="mt-auto">
        <form onSubmit={handleSendMessage} className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message or choose an option..."
            className="pr-12"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
