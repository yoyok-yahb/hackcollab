'use client'

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getConversations } from '@/lib/data';
import { useIsClient } from '@/hooks/use-is-client';

export default function MessagesPage() {
  const isClient = useIsClient();

  if (!isClient) {
    return (
        <div className="h-full flex flex-col">
            <div className="p-4 md:p-6">
                <h1 className="text-2xl font-bold">Messages</h1>
            </div>
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <h3 className="text-xl font-semibold">Loading messages...</h3>
            </div>
        </div>
    );
  }
  const conversations = getConversations();

  return (
    <div className="h-full flex flex-col">
       <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold">Messages</h1>
       </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length > 0 ? (
            <ul className="divide-y">
              {conversations.map(({ conversationId, otherUser, lastMessage, lastMessageAt }) => (
                <li key={conversationId}>
                  <Link href={`/messages/${conversationId}`} className="flex items-center gap-4 p-4 hover:bg-accent transition-colors">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={otherUser.image.imageUrl} alt={otherUser.name} />
                      <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <p className="font-semibold">{otherUser.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(lastMessageAt, { addSuffix: true })}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {lastMessage}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <h3 className="text-xl font-semibold">No messages yet</h3>
                <p className="mt-2 text-muted-foreground">
                    Match with someone to start a conversation.
                </p>
            </div>
          )}
        </div>
    </div>
  );
}
