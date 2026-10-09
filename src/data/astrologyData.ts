// Vedic Astrology Reference Data for Ashta Kuta (36 Guna) Calculation

export interface NakshatraInfo {
  name: string;
  rashi: string;
  rashiLord: string;
  varna: 'Brahmin' | 'Kshatriya' | 'Vaishya' | 'Shudra';
  vashya: 'Chatushpada' | 'Manava' | 'Jalachara' | 'Vanachara' | 'Keeta';
  yoni: string;
  gana: 'Deva' | 'Manushya' | 'Rakshasa';
  nadi: 'Aadi' | 'Madhya' | 'Antya';
}

export const NAKSHATRAS: NakshatraInfo[] = [
  { name: 'Ashwini', rashi: 'Aries', rashiLord: 'Mars', varna: 'Kshatriya', vashya: 'Chatushpada', yoni: 'Horse', gana: 'Deva', nadi: 'Aadi' },
  { name: 'Bharani', rashi: 'Aries', rashiLord: 'Mars', varna: 'Kshatriya', vashya: 'Chatushpada', yoni: 'Elephant', gana: 'Manushya', nadi: 'Madhya' },
  { name: 'Krittika', rashi: 'Taurus', rashiLord: 'Venus', varna: 'Vaishya', vashya: 'Chatushpada', yoni: 'Sheep', gana: 'Rakshasa', nadi: 'Antya' },
  { name: 'Rohini', rashi: 'Taurus', rashiLord: 'Venus', varna: 'Vaishya', vashya: 'Chatushpada', yoni: 'Serpent', gana: 'Manushya', nadi: 'Antya' },
  { name: 'Mrigashira', rashi: 'Gemini', rashiLord: 'Mercury', varna: 'Shudra', vashya: 'Manava', yoni: 'Serpent', gana: 'Deva', nadi: 'Madhya' },
  { name: 'Ardra', rashi: 'Gemini', rashiLord: 'Mercury', varna: 'Shudra', vashya: 'Manava', yoni: 'Dog', gana: 'Manushya', nadi: 'Aadi' },
  { name: 'Punarvasu', rashi: 'Cancer', rashiLord: 'Moon', varna: 'Brahmin', vashya: 'Jalachara', yoni: 'Cat', gana: 'Deva', nadi: 'Aadi' },
  { name: 'Pushya', rashi: 'Cancer', rashiLord: 'Moon', varna: 'Brahmin', vashya: 'Jalachara', yoni: 'Sheep', gana: 'Deva', nadi: 'Madhya' },
  { name: 'Ashlesha', rashi: 'Cancer', rashiLord: 'Moon', varna: 'Brahmin', vashya: 'Jalachara', yoni: 'Cat', gana: 'Rakshasa', nadi: 'Antya' },
  { name: 'Magha', rashi: 'Leo', rashiLord: 'Sun', varna: 'Kshatriya', vashya: 'Vanachara', yoni: 'Rat', gana: 'Rakshasa', nadi: 'Antya' },
  { name: 'Purva Phalguni', rashi: 'Leo', rashiLord: 'Sun', varna: 'Kshatriya', vashya: 'Vanachara', yoni: 'Rat', gana: 'Manushya', nadi: 'Madhya' },
  { name: 'Uttara Phalguni', rashi: 'Virgo', rashiLord: 'Mercury', varna: 'Vaishya', vashya: 'Manava', yoni: 'Cow', gana: 'Manushya', nadi: 'Aadi' },
  { name: 'Hasta', rashi: 'Virgo', rashiLord: 'Mercury', varna: 'Vaishya', vashya: 'Manava', yoni: 'Buffalo', gana: 'Deva', nadi: 'Aadi' },
  { name: 'Chitra', rashi: 'Libra', rashiLord: 'Venus', varna: 'Shudra', vashya: 'Manava', yoni: 'Tiger', gana: 'Rakshasa', nadi: 'Madhya' },
  { name: 'Swati', rashi: 'Libra', rashiLord: 'Venus', varna: 'Shudra', vashya: 'Manava', yoni: 'Buffalo', gana: 'Deva', nadi: 'Antya' },
  { name: 'Vishakha', rashi: 'Scorpio', rashiLord: 'Mars', varna: 'Brahmin', vashya: 'Keeta', yoni: 'Tiger', gana: 'Rakshasa', nadi: 'Antya' },
  { name: 'Anuradha', rashi: 'Scorpio', rashiLord: 'Mars', varna: 'Brahmin', vashya: 'Keeta', yoni: 'Deer', gana: 'Deva', nadi: 'Madhya' },
  { name: 'Jyeshtha', rashi: 'Scorpio', rashiLord: 'Mars', varna: 'Brahmin', vashya: 'Keeta', yoni: 'Deer', gana: 'Rakshasa', nadi: 'Aadi' },
  { name: 'Mula', rashi: 'Sagittarius', rashiLord: 'Jupiter', varna: 'Kshatriya', vashya: 'Manava', yoni: 'Dog', gana: 'Rakshasa', nadi: 'Aadi' },
  { name: 'Purva Ashadha', rashi: 'Sagittarius', rashiLord: 'Jupiter', varna: 'Kshatriya', vashya: 'Manava', yoni: 'Monkey', gana: 'Manushya', nadi: 'Madhya' },
  { name: 'Uttara Ashadha', rashi: 'Capricorn', rashiLord: 'Saturn', varna: 'Vaishya', vashya: 'Jalachara', yoni: 'Mongoose', gana: 'Manushya', nadi: 'Antya' },
  { name: 'Shravana', rashi: 'Capricorn', rashiLord: 'Saturn', varna: 'Vaishya', vashya: 'Jalachara', yoni: 'Monkey', gana: 'Deva', nadi: 'Antya' },
  { name: 'Dhanishta', rashi: 'Aquarius', rashiLord: 'Saturn', varna: 'Shudra', vashya: 'Manava', yoni: 'Lion', gana: 'Rakshasa', nadi: 'Madhya' },
  { name: 'Shatabhisha', rashi: 'Aquarius', rashiLord: 'Saturn', varna: 'Shudra', vashya: 'Manava', yoni: 'Horse', gana: 'Rakshasa', nadi: 'Aadi' },
  { name: 'Purva Bhadrapada', rashi: 'Pisces', rashiLord: 'Jupiter', varna: 'Brahmin', vashya: 'Jalachara', yoni: 'Lion', gana: 'Manushya', nadi: 'Aadi' },
  { name: 'Uttara Bhadrapada', rashi: 'Pisces', rashiLord: 'Jupiter', varna: 'Brahmin', vashya: 'Jalachara', yoni: 'Cow', gana: 'Manushya', nadi: 'Madhya' },
  { name: 'Revati', rashi: 'Pisces', rashiLord: 'Jupiter', varna: 'Brahmin', vashya: 'Jalachara', yoni: 'Elephant', gana: 'Deva', nadi: 'Antya' },
];

export const COMMON_GOTRAS = [
  'Bharadwaja',
  'Kashyapa',
  'Vashistha',
  'Vishwamitra',
  'Gautama',
  'Jamadagni',
  'Atri',
  'Agastya',
  'Bhrigu',
  'Parashara',
  'Kaushika',
  'Sandilya',
  'Harita',
  'Garga',
  'Shrivatsa',
  'Moudgalya',
  'Kaundinya',
  'Other / Not Known'
];

export const RASHI_ORDER = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];
