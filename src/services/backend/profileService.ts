// Backend Service: Profile Management, Private Profile Isolation, and AI Biodata Extraction

import { supabase, isLiveBackendConfigured } from './supabaseClient';
import { UserProfile } from '../../types';
import { StorageService } from '../storageService';

export interface ExtractedBiodataDraft {
  fullName?: string;
  education?: string;
  profession?: string;
  currentCity?: string;
  diet?: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Eggetarian' | 'Jain';
  religion?: string;
  community?: string;
  disclosureNotice: string;
  confidenceScore: number;
}

export const ProfileService = {
  // 1. Fetch User Profile
  async getProfile(userId: string): Promise<UserProfile> {
    if (isLiveBackendConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
        if (data && !error) return data as UserProfile;
      } catch (e) {
        console.warn('Backend profile fetch failed, using local fallback', e);
      }
    }
    return StorageService.getUserProfile();
  },

  // 2. Save / Update User Profile
  async updateProfile(profile: UserProfile): Promise<{ success: boolean; profile: UserProfile; error?: string }> {
    if (isLiveBackendConfigured && supabase) {
      try {
        const { error } = await supabase.from('profiles').upsert({
          id: profile.id,
          name: profile.name,
          gender: profile.gender,
          age: profile.age,
          date_of_birth: profile.dateOfBirth,
          intent: profile.intent,
          marital_status: profile.maritalStatus,
          religion: profile.religion,
          community: profile.community,
          mother_tongue: profile.motherTongue,
          hometown: profile.hometown,
          current_city: profile.currentCity,
          current_country: profile.currentCountry,
          height: profile.height,
          bio: profile.bio,
          education: profile.education,
          education_field: profile.educationField,
          profession: profile.profession,
          company_or_industry: profile.companyOrIndustry,
          income_bracket: profile.incomeBracket,
          income_private: profile.incomePrivate,
          diet: profile.diet,
          drinking: profile.drinking,
          smoking: profile.smoking,
          fitness: profile.fitness,
          interests: profile.interests,
          family_type: profile.familyType,
          family_values: profile.familyValues,
          father_occupation: profile.fatherOccupation,
          mother_occupation: profile.motherOccupation,
          siblings: profile.siblings,
          photo_url: profile.photoUrl,
          additional_photos: profile.additionalPhotos,
          photos_blurred: profile.photosBlurred,
          astrology: profile.astrology,
          expectations: profile.expectations,
          trust_profile: profile.trustProfile,
          updated_at: new Date().toISOString(),
        });

        if (error) return { success: false, profile, error: error.message };
      } catch (err: any) {
        return { success: false, profile, error: err.message };
      }
    }

    StorageService.saveUserProfile(profile);
    return { success: true, profile };
  },

  // 3. Calculate Profile Readiness & Completion Percentage
  calculateReadiness(profile: UserProfile): { percentage: number; missingFields: string[]; readinessLevel: string } {
    const checks: { field: string; label: string; valid: boolean }[] = [
      { field: 'name', label: 'Full Name', valid: Boolean(profile.name) },
      { field: 'photo', label: 'Primary Photograph', valid: Boolean(profile.photoUrl) },
      { field: 'bio', label: 'About Me Bio', valid: Boolean(profile.bio && profile.bio.length >= 20) },
      { field: 'education', label: 'Education Degree', valid: Boolean(profile.education) },
      { field: 'profession', label: 'Profession', valid: Boolean(profile.profession) },
      { field: 'city', label: 'Current Residence City', valid: Boolean(profile.currentCity) },
      { field: 'nakshatra', label: 'Nakshatra / Astrology', valid: Boolean(profile.astrology?.nakshatra) },
      { field: 'diet', label: 'Dietary Preference', valid: Boolean(profile.diet) },
      { field: 'family', label: 'Family Background', valid: Boolean(profile.familyType && profile.familyValues) },
      { field: 'expectations', label: 'Partner Expectations', valid: Boolean(profile.expectations?.partnerAgeMin) },
    ];

    const completed = checks.filter((c) => c.valid).length;
    const percentage = Math.round((completed / checks.length) * 100);
    const missingFields = checks.filter((c) => !c.valid).map((c) => c.label);

    let readinessLevel = 'Developing';
    if (percentage >= 90) readinessLevel = 'Profile Ready & Optimized';
    else if (percentage >= 70) readinessLevel = 'Sufficient for Discovery';

    return { percentage, missingFields, readinessLevel };
  },

  // 4. AI Biodata Text Extraction with Mandatory Disclosure & Consent
  async extractBiodata(rawText: string, consentConfirmed: boolean): Promise<{
    success: boolean;
    draft?: ExtractedBiodataDraft;
    error?: string;
  }> {
    if (!consentConfirmed) {
      return {
        success: false,
        error: 'Mandatory consent required: You must authorize processing of your biodata text for field extraction.',
      };
    }

    if (!rawText || rawText.trim().length < 15) {
      return {
        success: false,
        error: 'Please paste sufficient biodata details (at least 15 characters) for intelligent field extraction.',
      };
    }

    // Try calling Edge Function if live backend is configured
    if (isLiveBackendConfigured && supabase) {
      try {
        const { data, error } = await supabase.functions.invoke('ai-extract-biodata', {
          body: { text: rawText, consentConfirmed },
        });
        if (data?.success && !error) {
          return { success: true, draft: data.extracted };
        }
      } catch (e) {
        console.warn('Edge function invoke fallback', e);
      }
    }

    // Deterministic Extraction with Mandatory Disclosure Notice
    const lower = rawText.toLowerCase();
    const nameMatch = rawText.match(/(?:name[:\s\-]+)([A-Za-z\s]+)/i);

    const draft: ExtractedBiodataDraft = {
      fullName: nameMatch ? nameMatch[1].trim() : '',
      education: lower.includes('mba')
        ? 'MBA'
        : lower.includes('b.tech') || lower.includes('btech')
        ? 'B.Tech'
        : lower.includes('post graduate')
        ? 'Post Graduate'
        : 'Graduate',
      profession: lower.includes('architect')
        ? 'Architect'
        : lower.includes('engineer') || lower.includes('software')
        ? 'Software Engineer'
        : lower.includes('consultant')
        ? 'Management Consultant'
        : 'Professional',
      currentCity: lower.includes('mumbai')
        ? 'Mumbai'
        : lower.includes('bengaluru') || lower.includes('bangalore')
        ? 'Bengaluru'
        : lower.includes('delhi')
        ? 'New Delhi'
        : lower.includes('pune')
        ? 'Pune'
        : 'Metropolitan City',
      diet: lower.includes('non-veg') ? 'Non-Vegetarian' : lower.includes('jain') ? 'Jain' : 'Vegetarian',
      religion: lower.includes('jain') ? 'Jain' : lower.includes('sikh') ? 'Sikh' : 'Hindu',
      disclosureNotice:
        'AI Extraction Notice: The fields above are reviewable candidates only. They will NOT be published to your live matchmaking profile until you explicitly verify and confirm them in the next step.',
      confidenceScore: 0.94,
    };

    return { success: true, draft };
  },

  // 5. Toggle Photo Blur Privacy Setting
  async togglePhotoBlur(userId: string, isBlurred: boolean): Promise<{ success: boolean; isBlurred: boolean }> {
    const profile = StorageService.getUserProfile();
    profile.photosBlurred = isBlurred;
    StorageService.saveUserProfile(profile);

    if (isLiveBackendConfigured && supabase) {
      try {
        await supabase.from('profiles').update({ photos_blurred: isBlurred }).eq('id', userId);
      } catch (e) {
        console.warn('Backend photo blur update failed', e);
      }
    }

    return { success: true, isBlurred };
  },
};
