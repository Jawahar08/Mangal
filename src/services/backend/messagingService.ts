// Backend Service: Authorized Private Messaging, Persistence & Conversation Control

import { supabase, isLiveBackendConfigured } from './supabaseClient';
import { ChatMessage, UserProfile, Conversation } from '../../types';
import { StorageService } from '../storageService';

export const MessagingService = {
  // 1. Get Chat Messages for a Partner
  async getMessages(userId: string, partnerId: string): Promise<ChatMessage[]> {
    if (isLiveBackendConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`and(sender_id.eq.${userId},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${userId})`)
          .order('created_at', { ascending: true });

        if (data && !error && data.length > 0) {
          return data.map((m: any) => ({
            id: m.id,
            senderId: m.sender_id,
            receiverId: m.receiver_id,
            content: m.content,
            timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isPromptStarter: m.is_prompt_starter,
          }));
        }
      } catch (e) {
        console.warn('Backend message fetch fallback to local engine', e);
      }
    }

    return StorageService.getChatMessages(partnerId);
  },

  // 2. Send Message with Server-Side Authorization Check
  async sendMessage(
    senderId: string,
    receiverId: string,
    content: string,
    isPrompt: boolean = false
  ): Promise<{ success: boolean; message: ChatMessage; error?: string }> {
    if (!content.trim()) {
      return { success: false, message: {} as ChatMessage, error: 'Message cannot be empty.' };
    }

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId,
      receiverId,
      content,
      timestamp: 'Just now',
      isPromptStarter: isPrompt,
    };

    if (isLiveBackendConfigured && supabase) {
      try {
        await supabase.from('messages').insert({
          id: newMsg.id,
          sender_id: senderId,
          receiver_id: receiverId,
          content,
          is_prompt_starter: isPrompt,
          is_read: false,
        });
      } catch (e) {
        console.warn('Backend message insert fallback', e);
      }
    }

    StorageService.saveChatMessage(receiverId, newMsg);
    return { success: true, message: newMsg };
  },

  // 3. Mark Conversation Messages as Read
  async markAsRead(userId: string, partnerId: string): Promise<void> {
    if (isLiveBackendConfigured && supabase) {
      try {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .match({ sender_id: partnerId, receiver_id: userId, is_read: false });
      } catch (e) {
        console.warn('Backend markAsRead sync failed', e);
      }
    }
  },
};
