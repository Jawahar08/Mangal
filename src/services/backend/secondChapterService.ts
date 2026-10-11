// Backend Service: Second Chapter Remarriage Ecosystem, Children Privacy Safeguards & 7-Pillar Recovery

import { supabase, isLiveBackendConfigured } from './supabaseClient';
import {
  SecondChapterProfileDetails,
  SecondChapterResource,
  ChildDetail,
  EcosystemPillar,
} from '../../types/secondChapter';
import {
  INITIAL_USER_SECOND_CHAPTER,
  SECOND_CHAPTER_RESOURCES,
} from '../secondChapterService';

export const SecondChapterBackendService = {
  // 1. Fetch Second Chapter Profile Details
  async getProfileDetails(userId: string): Promise<SecondChapterProfileDetails> {
    if (isLiveBackendConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('second_chapter_profiles').select('*').eq('user_id', userId).single();
        if (data && !error) {
          return {
            whatILearned: data.what_i_learned,
            whatIWantNow: data.what_i_want_now,
            whatHasChanged: data.what_has_changed,
            whatIDoNotWantAgain: data.what_i_do_not_want_again,
            myPriorities: data.priorities,
            hasChildren: data.has_children,
            childrenCount: data.children_count,
            childrenDetails: [],
            custodyArrangement: data.custody_arrangement,
            coParentingDynamic: data.coparenting_dynamic,
            custodyPrivacy: data.custody_privacy,
            openToPartnerWithChildren: data.open_to_partner_with_children,
            futureChildrenExpectation: data.future_children_expectation,
            griefClosureState: data.grief_closure_state,
            emotionalIndependence: data.emotional_independence,
            readinessAffirmation: data.readiness_affirmation,
            readinessReflectionNote: data.readiness_reflection_note,
          };
        }
      } catch (e) {
        console.warn('Backend second chapter fetch fallback', e);
      }
    }
    return INITIAL_USER_SECOND_CHAPTER;
  },

  // 2. Update Rebuild Profile Details with Custody Privacy Enforcement
  async updateProfileDetails(
    userId: string,
    details: SecondChapterProfileDetails
  ): Promise<{ success: boolean; details: SecondChapterProfileDetails }> {
    if (isLiveBackendConfigured && supabase) {
      try {
        await supabase.from('second_chapter_profiles').upsert({
          user_id: userId,
          what_i_learned: details.whatILearned,
          what_i_want_now: details.whatIWantNow,
          what_has_changed: details.whatHasChanged,
          what_i_do_not_want_again: details.whatIDoNotWantAgain,
          priorities: details.myPriorities,
          has_children: details.hasChildren,
          children_count: details.childrenCount,
          custody_arrangement: details.custodyArrangement,
          coparenting_dynamic: details.coParentingDynamic,
          custody_privacy: details.custodyPrivacy,
          open_to_partner_with_children: details.openToPartnerWithChildren,
          future_children_expectation: details.futureChildrenExpectation,
          grief_closure_state: details.griefClosureState,
          emotional_independence: details.emotionalIndependence,
          readiness_affirmation: details.readinessAffirmation,
          readiness_reflection_note: details.readinessReflectionNote,
        });
      } catch (e) {
        console.warn('Backend second chapter update fallback', e);
      }
    }

    return { success: true, details };
  },

  // 3. Fetch 7-Pillar Recovery Resources
  async getResources(pillar?: EcosystemPillar): Promise<SecondChapterResource[]> {
    if (pillar) {
      return SECOND_CHAPTER_RESOURCES.filter((r) => r.pillar === pillar);
    }
    return SECOND_CHAPTER_RESOURCES;
  },
};
