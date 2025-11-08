'use client';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCurrentUser, getConversations, User } from '@/lib/data';
import { ArrowLeft, Loader2, Send, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { generateIcebreaker } from '@/ai/flows/icebreaker-tool';

// Mock messages for a conversation
const getMockMessages = (otherUser: User) => {
    const currentUser = getCurrentUser();
    return [
        { id: '1', sender: otherUser, text: 'Hey! I saw your profile, you seem like a great fit for our project.', time: '10:30 AM' },
        { id: '2', sender: currentUser, text: 'Hi! Thanks for reaching out. Your project sounds really interesting.', time: '10:31 AM' },
    ]
}


export default function ChatPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [icebreakerLoading, setIcebreakerLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  
  const conversations = getConversations();
  const currentConversation = conversations.find(c => c.conversationId === params.id);
  const currentUser = getCurrentUser();
  
  if (!currentConversation) {
    return <div className="p-4">Conversation not found.</div>;
  }
  
  const otherUser = currentConversation.otherUser;
  const messages = getMockMessages(otherUser);

  const handleGenerateIcebreaker = async () => {
    setIcebreakerLoading(true);
    try {
      const result = await generateIcebreaker({
        userProfile: JSON.stringify(currentUser),
        teamOpening: "Looking for a skilled teammate for a hackathon project.",
      });
      setInputMessage(result.icebreakerSuggestion);
      toast({
        title: 'Icebreaker Suggested!',
        description: 'AI has generated a conversation starter for you.',
      });
    } catch(e) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not generate an icebreaker.'
      })
    } finally {
        setIcebreakerLoading(false);
    }
  }


  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-4 border-b bg-background p-3">
        <Button asChild variant="ghost" size="icon" className="md:hidden">
            <Link href="/messages"><ArrowLeft className="h-6 w-6" /></Link>
        </Button>
        <Avatar>
          <AvatarImage src={otherUser.image.imageUrl} alt={otherUser.name} />
          <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{otherUser.name}</p>
          <p className="text-xs text-muted-foreground">Active now</p>
        </div>
      </header>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex items-end gap-2',
                message.sender.id === currentUser.id ? 'justify-end' : 'justify-start'
              )}
            >
              {message.sender.id !== currentUser.id && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.sender.image.imageUrl} alt={message.sender.name} />
                  <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-xs rounded-lg p-3 text-sm',
                  message.sender.id === currentUser.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card'
                )}
              >
                <p>{message.text}</p>
                <p className={cn(
                    "text-xs mt-1",
                     message.sender.id === currentUser.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                )}>{message.time}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <footer className="border-t bg-background p-4">
        <div className="relative">
          <Input
            placeholder="Type a message..."
            className="pr-24"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <Button variant="ghost" size="icon" onClick={handleGenerateIcebreaker} disabled={icebreakerLoading}>
              {icebreakerLoading ? <Loader2 className="h-5 w-5 animate-spin"/> : <Sparkles className="h-5 w-5 text-primary" />}
              <span className="sr-only">Generate Icebreaker</span>
            </Button>
            <Button type="submit" size="icon" className="mr-2">
              <Send className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
