// Backend Service: Pratha Spirituality & Wellbeing Layer

import {
  DailySankalpa,
  TempleExperience,
  PoojaGuide,
  CoupleJourneyDay,
  FestivalEvent,
  MeditationSession,
} from '../../types/pratha';
import {
  TODAY_SANKALPA,
  PRATHA_TEMPLES,
  POOJA_GUIDES,
  INITIAL_COUPLE_JOURNEY,
  UPCOMING_FESTIVALS,
  MEDITATION_SESSIONS,
} from '../prathaService';

export const PrathaBackendService = {
  // 1. Fetch Today's Sankalpa
  async getDailySankalpa(dateStr?: string): Promise<DailySankalpa> {
    return TODAY_SANKALPA;
  },

  // 2. Fetch Temple Experiences
  async getTemples(): Promise<TempleExperience[]> {
    return PRATHA_TEMPLES;
  },

  // 3. Fetch Pooja Guides
  async getPoojaGuides(category?: string): Promise<PoojaGuide[]> {
    if (category && category !== 'all') {
      return POOJA_GUIDES.filter((p) => p.category === category);
    }
    return POOJA_GUIDES;
  },

  // 4. Fetch 21-Day Couple Journey Days
  async getCoupleJourney(): Promise<CoupleJourneyDay[]> {
    return INITIAL_COUPLE_JOURNEY;
  },

  // 5. Complete a Journey Day
  async completeJourneyDay(dayNumber: number): Promise<{ success: boolean; dayNumber: number }> {
    return { success: true, dayNumber };
  },

  // 6. Fetch Festival Calendar
  async getFestivals(): Promise<FestivalEvent[]> {
    return UPCOMING_FESTIVALS;
  },

  // 7. Fetch Meditation Sessions
  async getMeditations(): Promise<MeditationSession[]> {
    return MEDITATION_SESSIONS;
  },
};
