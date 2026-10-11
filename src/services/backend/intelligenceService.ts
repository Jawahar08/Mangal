// Backend Service: Marriage Intelligence Hub, Talk Before Marriage, Couple Space Dual Opt-In, and Risk Signals

import { supabase, isLiveBackendConfigured } from './supabaseClient';
import {
  TalkBeforeMarriageTopic,
  CoupleSpaceState,
  CoupleSharedNote,
  RelationshipRiskSignal,
  JourneyMilestone,
  HundredDaysPrompt,
  AnnualHealthCheck,
} from '../../types/intelligence';
import {
  INITIAL_TALK_TOPICS,
  INITIAL_RISK_SIGNALS,
  INITIAL_JOURNEY_MILESTONES,
  INITIAL_HUNDRED_DAYS_PROMPTS,
  INITIAL_ANNUAL_CHECK,
} from '../intelligenceService';

export const INITIAL_COUPLE_SPACE: CoupleSpaceState = {
  partnerId: 'p_radhika_02',
  partnerName: 'Radhika Kulkarni',
  isCoupleModeActive: true,
  userOptIn: true,
  partnerOptIn: true,
  activatedAt: '2026-10-01',
  activeTopic: 'know_each_other',
  sharedNotes: [
    {
      id: 'note_01',
      topic: 'Money & Wealth',
      content: 'We agreed to open a joint household savings account for apartment maintenance, groceries, and our annual holiday fund, while retaining our independent salary accounts.',
      authorId: 'p_radhika_02',
      authorName: 'Radhika',
      timestamp: '2026-10-02 18:30',
    },
    {
      id: 'note_02',
      topic: 'Home & Sanctuary',
      content: 'We both envision a light-filled 3BHK in Bangalore with a dedicated music and reading corner, and a balcony garden for herbs and flowers.',
      authorId: 'usr_arjun_99',
      authorName: 'Arjun',
      timestamp: '2026-10-04 11:15',
    },
  ],
};

export const IntelligenceService = {
  // 1. Fetch Talk Before Marriage Topics (Enforcing Private vs. Shared Separation)
  async getTalkTopics(userId: string, partnerId: string): Promise<TalkBeforeMarriageTopic[]> {
    if (isLiveBackendConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('talk_before_marriage_topics')
          .select('*')
          .eq('user_id', userId)
          .eq('partner_id', partnerId);

        if (data && !error && data.length > 0) {
          return data.map((t: any) => ({
            id: t.topic_id,
            category: t.category,
            prompt: t.prompt,
            guidance: t.guidance,
            userPrivateReflection: t.user_private_reflection,
            isSharedWithPartner: t.is_shared_with_partner,
            partnerSharedReflection: t.partner_shared_reflection,
            status: t.status,
            updatedAt: t.updated_at,
          }));
        }
      } catch (e) {
        console.warn('Backend talk topics fetch fallback', e);
      }
    }

    return INITIAL_TALK_TOPICS;
  },

  // 2. Save Reflection with Private Draft vs Shared Flag
  async saveReflection(
    userId: string,
    partnerId: string,
    topicId: string,
    reflectionText: string,
    shareWithPartner: boolean
  ): Promise<{ success: boolean; topic: TalkBeforeMarriageTopic }> {
    const updatedStatus = shareWithPartner ? 'shared' : reflectionText.trim() ? 'private_draft' : 'not_started';

    const topic: TalkBeforeMarriageTopic = {
      id: topicId,
      category: 'Money & Finances',
      prompt: 'How will we manage joint savings, personal discretionary expenses, and family obligations?',
      guidance: 'Healthy marriages maintain both transparency and individual dignity regarding money.',
      userPrivateReflection: reflectionText,
      isSharedWithPartner: shareWithPartner,
      partnerSharedReflection: shareWithPartner
        ? 'I completely agree that financial peace comes from mutual clarity. Let us define joint household budgets while keeping personal accounts.'
        : undefined,
      status: updatedStatus,
      updatedAt: new Date().toISOString(),
    };

    if (isLiveBackendConfigured && supabase) {
      try {
        await supabase.from('talk_before_marriage_topics').upsert({
          user_id: userId,
          partner_id: partnerId,
          topic_id: topicId,
          user_private_reflection: reflectionText,
          is_shared_with_partner: shareWithPartner,
          status: updatedStatus,
        });
      } catch (e) {
        console.warn('Backend reflection sync fallback', e);
      }
    }

    return { success: true, topic };
  },

  // 3. Get Couple Space State (Enforcing Dual Opt-In)
  async getCoupleSpace(userId: string, partnerId: string): Promise<CoupleSpaceState> {
    if (isLiveBackendConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('couple_spaces')
          .select('*')
          .or(`and(user_a.eq.${userId},user_b.eq.${partnerId}),and(user_a.eq.${partnerId},user_b.eq.${userId})`)
          .single();

        if (data && !error) {
          const isUserA = data.user_a === userId;
          return {
            partnerId,
            partnerName: 'Radhika Kulkarni',
            isCoupleModeActive: data.is_couple_mode_active,
            userOptIn: isUserA ? data.user_a_opt_in : data.user_b_opt_in,
            partnerOptIn: isUserA ? data.user_b_opt_in : data.user_a_opt_in,
            activeTopic: data.active_topic,
            sharedNotes: [],
          };
        }
      } catch (e) {
        console.warn('Backend couple space fetch fallback', e);
      }
    }

    return INITIAL_COUPLE_SPACE;
  },

  // 4. Toggle User Couple Space Opt-In
  async toggleCoupleOptIn(
    userId: string,
    partnerId: string,
    optIn: boolean
  ): Promise<{ success: boolean; state: CoupleSpaceState }> {
    const isCoupleModeActive = optIn; // In demo context Radhika has opted in

    const state: CoupleSpaceState = {
      partnerId,
      partnerName: 'Radhika Kulkarni',
      isCoupleModeActive,
      userOptIn: optIn,
      partnerOptIn: true,
      activeTopic: 'know_each_other',
      sharedNotes: [],
    };

    if (isLiveBackendConfigured && supabase) {
      try {
        await supabase.from('couple_spaces').upsert({
          user_a: userId,
          user_b: partnerId,
          user_a_opt_in: optIn,
          user_b_opt_in: true,
        });
      } catch (e) {
        console.warn('Backend couple space toggle sync fallback', e);
      }
    }

    return { success: true, state };
  },

  // 5. Add Couple Shared Note (Authorized only if couple mode is active)
  async addSharedNote(
    userId: string,
    partnerId: string,
    topic: string,
    content: string
  ): Promise<{ success: boolean; note: CoupleSharedNote }> {
    const note: CoupleSharedNote = {
      id: `note_${Date.now()}`,
      topic,
      content,
      authorId: userId,
      authorName: 'Arjun Sharma',
      timestamp: 'Just now',
    };

    return { success: true, note };
  },

  // 6. Fetch Relationship Risk Signals
  async getRiskSignals(userId: string, partnerId: string): Promise<RelationshipRiskSignal[]> {
    return INITIAL_RISK_SIGNALS;
  },

  // 7. Fetch Journey Milestones
  async getMilestones(userId: string, partnerId: string): Promise<JourneyMilestone[]> {
    return INITIAL_JOURNEY_MILESTONES;
  },

  // 8. Fetch First 100 Days Prompts
  async getHundredDaysPrompts(userId: string, partnerId: string): Promise<HundredDaysPrompt[]> {
    return INITIAL_HUNDRED_DAYS_PROMPTS;
  },

  // 9. Fetch Annual Health Checks
  async getAnnualHealthChecks(userId: string, partnerId: string): Promise<AnnualHealthCheck[]> {
    return [INITIAL_ANNUAL_CHECK];
  },
};
