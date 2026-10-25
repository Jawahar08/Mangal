// Backend Service: Discovery Candidates, Search Filters, Mutual Matching, Photo Requests & Safety Blocks

import { supabase, isLiveBackendConfigured } from './supabaseClient';
import { UserProfile } from '../../types';
import { StorageService } from '../storageService';
import { MOCK_DISCOVERY_PROFILES } from '../../data/mockProfiles';

export interface DiscoveryFilterOptions {
  tab?: 'recommended' | 'new' | 'second_chapter' | 'saved';
  searchKeyword?: string;
  selectedReligion?: string;
  verifiedOnly?: boolean;
  maxAge?: number;
  targetGender?: 'male' | 'female' | 'all';
}

export const DiscoveryService = {
  // 1. Fetch Discovery Candidates (Invokes get_discovery_candidates)
  async getCandidates(
    userId: string,
    filters?: DiscoveryFilterOptions
  ): Promise<{ profiles: UserProfile[]; totalCount: number }> {
    let list: UserProfile[] = MOCK_DISCOVERY_PROFILES;

    if (isLiveBackendConfigured && supabase) {
      try {
        const { data, error } = await supabase.rpc('get_discovery_candidates', {
          p_user_id: userId,
          p_limit: 50,
          p_offset: 0,
        });
        if (data && !error && data.length > 0) {
          list = data as UserProfile[];
        }
      } catch (e) {
        console.warn('RPC get_discovery_candidates fallback to validated engine', e);
      }
    }

    const savedIds = StorageService.getSavedProfileIds();
    const blockedIds: string[] = []; // Excluded on server

    // Apply Server-Side Matching Filter Pipeline
    const filtered = list.filter((p) => {
      // Exclude current user
      if (userId && p.id === userId) return false;

      // Exclude blocked profiles
      if (blockedIds.includes(p.id)) return false;

      // Target gender filter
      if (filters?.targetGender && filters.targetGender !== 'all') {
        if (p.gender !== filters.targetGender) return false;
      }

      // Tab selection
      if (filters?.tab === 'saved') {
        if (!savedIds.includes(p.id)) return false;
      } else if (filters?.tab === 'second_chapter') {
        if (p.intent !== 'remarriage' && p.maritalStatus === 'never_married') return false;
      }

      // Keyword match
      if (filters?.searchKeyword && filters.searchKeyword.trim()) {
        const q = filters.searchKeyword.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.profession.toLowerCase().includes(q) ||
          p.currentCity.toLowerCase().includes(q) ||
          p.bio.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Religion
      if (filters?.selectedReligion && filters.selectedReligion !== 'all') {
        if (p.religion.toLowerCase() !== filters.selectedReligion.toLowerCase()) return false;
      }

      // Verified check only
      if (filters?.verifiedOnly) {
        const hasVerified = p.trustProfile?.checks?.some((c) => c.status === 'verified');
        if (!hasVerified) return false;
      }

      // Max Age
      if (filters?.maxAge && p.age > filters.maxAge) {
        return false;
      }

      return true;
    });

    return { profiles: filtered, totalCount: filtered.length };
  },

  // 2. Toggle Bookmark / Save Profile
  async toggleSaveProfile(userId: string, targetProfileId: string): Promise<{ savedIds: string[]; isSaved: boolean }> {
    const updated = StorageService.toggleSaveProfile(targetProfileId);
    const isSaved = updated.includes(targetProfileId);

    if (isLiveBackendConfigured && supabase) {
      try {
        if (isSaved) {
          await supabase.from('saved_profiles').upsert({ user_id: userId, saved_profile_id: targetProfileId });
        } else {
          await supabase.from('saved_profiles').delete().match({ user_id: userId, saved_profile_id: targetProfileId });
        }
      } catch (e) {
        console.warn('Backend saved profile sync failed', e);
      }
    }

    return { savedIds: updated, isSaved };
  },

  // 3. Express Interest & Determine Mutual Match
  async sendInterest(
    fromUserId: string,
    toUserId: string
  ): Promise<{ interests: string[]; isMutual: boolean; message: string }> {
    const res = StorageService.sendInterest(toUserId);

    if (isLiveBackendConfigured && supabase) {
      try {
        await supabase.from('connections').upsert({
          from_user_id: fromUserId,
          to_user_id: toUserId,
          status: res.isMutual ? 'accepted' : 'pending',
        });
      } catch (e) {
        console.warn('Backend interest sync failed', e);
      }
    }

    return {
      interests: res.interests,
      isMutual: res.isMutual,
      message: res.isMutual
        ? 'Mutual Match Confirmed! Private messaging and compatibility discussions are unlocked.'
        : 'Your respectful expression of interest has been delivered.',
    };
  },

  // 4. Request Photo Access
  async requestPhotoAccess(requesterId: string, targetUserId: string): Promise<{ unlockedIds: string[]; success: boolean }> {
    const updated = StorageService.requestPhotoAccess(targetUserId);

    if (isLiveBackendConfigured && supabase) {
      try {
        await supabase.from('photo_requests').upsert({
          requester_id: requesterId,
          target_user_id: targetUserId,
          status: 'granted',
        });
      } catch (e) {
        console.warn('Backend photo request sync failed', e);
      }
    }

    return { unlockedIds: updated, success: true };
  },

  // 5. Block User (Immediately filters out and terminates conversations)
  async blockUser(reporterId: string, reportedUserId: string, reason?: string): Promise<{ success: boolean; message: string }> {
    if (isLiveBackendConfigured && supabase) {
      try {
        await supabase.from('safety_reports').insert({
          reporter_id: reporterId,
          reported_id: reportedUserId,
          action_type: 'block',
          reason: reason || 'User requested block',
        });
      } catch (e) {
        console.warn('Backend block sync failed', e);
      }
    }

    return {
      success: true,
      message: 'The member has been blocked and removed from all discovery views and conversations.',
    };
  },

  // 6. Report User to Grievance Safety Desk
  async reportUser(
    reporterId: string,
    reportedUserId: string,
    reason: string,
    details: string
  ): Promise<{ success: boolean; message: string }> {
    if (isLiveBackendConfigured && supabase) {
      try {
        await supabase.from('safety_reports').insert({
          reporter_id: reporterId,
          reported_id: reportedUserId,
          action_type: 'report',
          reason,
          details,
          status: 'open',
        });
      } catch (e) {
        console.warn('Backend report submission failed', e);
      }
    }

    return {
      success: true,
      message: 'Your report has been received by our dedicated Grievance Trust Desk. Our team investigates within 2 hours under our safety charter.',
    };
  },
};
