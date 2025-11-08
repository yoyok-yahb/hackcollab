'use client';
import { useState, use, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getCurrentUser, getConversations, User, Message, addMessage, getMessagesForConversation, getUserById } from '@/lib/data';
import { ArrowLeft, Loader2, Send, ShieldAlert, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { generateIcebreaker } from '@/ai/flows/icebreaker-tool';
import { moderateContent } from '@/ai/flows/content-moderation-flow';


export default function ChatPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise);
  const { toast } = useToast();
  const [icebreakerLoading, setIcebreakerLoading] = useState(false);
  const [messageSending, setMessageSending] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  
  const conversations = getConversations();
  const currentConversation = conversations.find(c => c.conversationId === params.id);
  const currentUser = getCurrentUser();
    
  const [messages, setMessages] = useState<Message[]>(() => getMessagesForConversation(params.id));

  // Poll for new messages (in a real app, you'd use websockets)
  useEffect(() => {
    const interval = setInterval(() => {
        const newMessages = getMessagesForConversation(params.id);
        if(newMessages.length !== messages.length) {
            setMessages(newMessages);
        }
    }, 1000);
    return () => clearInterval(interval);
  }, [params.id, messages.length])


  if (!currentConversation) {
    return <div className="p-4">Conversation not found.</div>;
  }
  
  const otherUser = currentConversation.otherUser;

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || messageSending) return;

    setMessageSending(true);

    try {
        const moderationResult = await moderateContent({ text: inputMessage.trim() });
        
        if (!moderationResult.isAppropriate) {
            toast({
                variant: 'destructive',
                title: 'Inappropriate Language Detected',
                description: 'Your message has been censored.',
                icon: <ShieldAlert className="h-6 w-6" />,
            });
        }
        
        const newMessage = addMessage({
            conversationId: params.id,
            senderId: currentUser.id,
            text: moderationResult.censoredText,
        });

        setMessages([...messages, newMessage]);
        setInputMessage('');

    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not send the message.',
        });
    } finally {
        setMessageSending(false);
    }
  }

  const getSender = (senderId: string): User | undefined => {
    if (senderId === currentUser.id) return currentUser;
    return getUserById(senderId);
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
          {messages.map((message) => {
            const sender = getSender(message.senderId);
            if (!sender) return null;

            return (
                <div
                key={message.id}
                className={cn(
                    'flex items-end gap-2',
                    message.senderId === currentUser.id ? 'justify-end' : 'justify-start'
                )}
                >
                {message.senderId !== currentUser.id && (
                    <Avatar className="h-8 w-8">
                    <AvatarImage src={sender.image.imageUrl} alt={sender.name} />
                    <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                )}
                <div
                    className={cn(
                    'max-w-xs rounded-lg p-3 text-sm',
                    message.senderId === currentUser.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card'
                    )}
                >
                    <p>{message.text}</p>
                    <p className={cn(
                        "text-xs mt-1",
                        message.senderId === currentUser.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    )}>{new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                </div>
            )
          })}
        </div>
      </ScrollArea>
      <footer className="border-t bg-background p-4">
        <form onSubmit={handleSendMessage} className="relative">
          <Input
            placeholder="Type a message..."
            className="pr-24"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={messageSending}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <Button variant="ghost" size="icon" type="button" onClick={handleGenerateIcebreaker} disabled={icebreakerLoading || messageSending}>
              {icebreakerLoading ? <Loader2 className="h-5 w-5 animate-spin"/> : <Sparkles className="h-5 w-5 text-primary" />}
              <span className="sr-only">Generate Icebreaker</span>
            </Button>
            <Button type="submit" size="icon" className="mr-2" disabled={messageSending}>
              {messageSending ? <Loader2 className="h-5 w-5 animate-spin"/> : <Send className="h-5 w-5" />}
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>
      </footer>
    </div>
  );
}
