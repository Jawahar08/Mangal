// CitySelectModal.tsx
// Two-Column State & City Selector
// Column 1: State / Region Selection
// Column 2: Cities in the Selected State

import React, { useState, useMemo } from 'react';
import { Modal } from './Modal';
import { 
  Search, 
  MapPin, 
  Check, 
  Sparkles, 
  X, 
  PlusCircle, 
  Building2,
  ChevronRight,
  Globe
} from 'lucide-react';

export interface CityData {
  name: string;
  popular?: boolean;
  heritageNote?: string;
}

export interface StateData {
  state: string;
  region: 'North' | 'West' | 'South' | 'East' | 'Central' | 'Global';
  cities: CityData[];
}

export const STATES_AND_CITIES: StateData[] = [
  {
    state: 'Rajasthan',
    region: 'North',
    cities: [
      { name: 'Jaipur', popular: true, heritageNote: 'Pink City • Rajputana Heritage' },
      { name: 'Jodhpur', popular: true, heritageNote: 'Sun City • Marwar Heritage' },
      { name: 'Udaipur', popular: true, heritageNote: 'City of Lakes • Mewar' },
      { name: 'Bikaner', heritageNote: 'Rathore Heritage • Desert Hub' },
      { name: 'Ajmer', heritageNote: 'Pushkar & Dargah Heritage' },
      { name: 'Kota', heritageNote: 'Chambal Valley • Coaching Hub' },
      { name: 'Alwar', heritageNote: 'Matsya Desh • Sariska' },
      { name: 'Bhilwara', heritageNote: 'Textile Capital of Rajasthan' },
      { name: 'Sikar', heritageNote: 'Shekhawati Heritage' },
      { name: 'Jhunjhunu', heritageNote: 'Shekhawati Havelis' },
      { name: 'Pali', heritageNote: 'Marwar Region' },
      { name: 'Bharatpur', heritageNote: 'Brij Region • Bird Sanctuary' },
      { name: 'Chittorgarh', heritageNote: 'Historic Mewar Fort' },
      { name: 'Sri Ganganagar', heritageNote: 'Northern Canal Belt' },
      { name: 'Barmer', heritageNote: 'Thar Desert Cultural Hub' },
    ],
  },
  {
    state: 'Maharashtra',
    region: 'West',
    cities: [
      { name: 'Mumbai', popular: true, heritageNote: 'Maximum City • Financial Capital' },
      { name: 'Pune', popular: true, heritageNote: 'Oxford of the East • Peshwa' },
      { name: 'Nagpur', popular: true, heritageNote: 'Orange City • Vidarbha Hub' },
      { name: 'Nashik', popular: true, heritageNote: 'Godavari • Kumbh Dham' },
      { name: 'Chhatrapati Sambhajinagar', heritageNote: 'Marathwada • Ellora Gateway' },
      { name: 'Kolhapur', heritageNote: 'Mahalakshmi Peeth • Historical' },
      { name: 'Solapur', heritageNote: 'Siddheshwar Heritage • Textile' },
      { name: 'Thane', heritageNote: 'Metropolitan Mumbai Region' },
      { name: 'Navi Mumbai', heritageNote: 'Planned Metropolitan Hub' },
      { name: 'Satara', heritageNote: 'Chhatrapati Heritage • Western Ghats' },
      { name: 'Sangli', heritageNote: 'Turmeric City • Krishna Valley' },
      { name: 'Ratnagiri', heritageNote: 'Konkan Coast Heritage' },
      { name: 'Amravati', heritageNote: 'Vidarbha Heartland' },
      { name: 'Jalgaon', heritageNote: 'Banana City • Khandesh' },
    ],
  },
  {
    state: 'Karnataka',
    region: 'South',
    cities: [
      { name: 'Bangalore', popular: true, heritageNote: 'Silicon Valley of India' },
      { name: 'Mysore', popular: true, heritageNote: 'City of Palaces • Wodeyar' },
      { name: 'Mangalore', popular: true, heritageNote: 'Tulunadu Coastal Hub' },
      { name: 'Hubli-Dharwad', heritageNote: 'North Karnataka Commercial Hub' },
      { name: 'Belgaum', heritageNote: 'Malenadu Gateway' },
      { name: 'Udupi', heritageNote: 'Krishna Temple Coast' },
      { name: 'Shimoga', heritageNote: 'Gateway of Malnad' },
      { name: 'Bellary', heritageNote: 'Vijayanagara Heartland' },
      { name: 'Davanagere', heritageNote: 'Central Karnataka Hub' },
      { name: 'Gulbarga', heritageNote: 'Bahmani Heritage' },
    ],
  },
  {
    state: 'Delhi NCR',
    region: 'North',
    cities: [
      { name: 'New Delhi', popular: true, heritageNote: 'National Capital Territory' },
      { name: 'South Delhi', popular: true, heritageNote: 'Capital City Hub' },
      { name: 'Noida', popular: true, heritageNote: 'Uttar Pradesh NCR' },
      { name: 'Gurugram', popular: true, heritageNote: 'Millennium Cyber City' },
      { name: 'Faridabad', heritageNote: 'Haryana NCR Industrial Hub' },
      { name: 'Ghaziabad', heritageNote: 'Western UP NCR' },
    ],
  },
  {
    state: 'Uttar Pradesh',
    region: 'North',
    cities: [
      { name: 'Lucknow', popular: true, heritageNote: 'City of Nawabs • Awadh' },
      { name: 'Varanasi', popular: true, heritageNote: 'Kashi • Holy Ganges Ghats' },
      { name: 'Kanpur', popular: true, heritageNote: 'Ganges Hub • Industrial' },
      { name: 'Prayagraj', popular: true, heritageNote: 'Triveni Sangam • Kumbh Dham' },
      { name: 'Agra', popular: true, heritageNote: 'Braj Bhoomi • Taj Heritage' },
      { name: 'Mathura', heritageNote: 'Braj Heartland • Krishna Janmabhoomi' },
      { name: 'Meerut', heritageNote: 'Hastinapur Region' },
      { name: 'Bareilly', heritageNote: 'Rohilkhand Heartland' },
      { name: 'Aligarh', heritageNote: 'Lock City • Western UP' },
      { name: 'Gorakhpur', heritageNote: 'Purvanchal Gateway' },
      { name: 'Ayodhya', heritageNote: 'Awadh • Saryu Riverfront' },
      { name: 'Jhansi', heritageNote: 'Bundelkhand Heritage' },
      { name: 'Moradabad', heritageNote: 'Brass City of India' },
    ],
  },
  {
    state: 'Gujarat',
    region: 'West',
    cities: [
      { name: 'Ahmedabad', popular: true, heritageNote: 'World Heritage City • Sabarmati' },
      { name: 'Surat', popular: true, heritageNote: 'Silk & Diamond Capital' },
      { name: 'Vadodara', popular: true, heritageNote: 'Sanskari Nagari • Gaekwad' },
      { name: 'Rajkot', popular: true, heritageNote: 'Saurashtra Hub' },
      { name: 'Bhavnagar', heritageNote: 'Gohilwad Coast' },
      { name: 'Jamnagar', heritageNote: 'Chhoti Kashi • Marine Hub' },
      { name: 'Junagadh', heritageNote: 'Girnar Foothills' },
      { name: 'Gandhinagar', heritageNote: 'Capital City' },
      { name: 'Bhuj', heritageNote: 'Kutch White Desert Heritage' },
      { name: 'Anand', heritageNote: 'Milk Capital of India' },
      { name: 'Navsari', heritageNote: 'South Gujarat' },
    ],
  },
  {
    state: 'Tamil Nadu',
    region: 'South',
    cities: [
      { name: 'Chennai', popular: true, heritageNote: 'Singara Chennai • Gateway to South' },
      { name: 'Coimbatore', popular: true, heritageNote: 'Manchester of South India' },
      { name: 'Madurai', popular: true, heritageNote: 'Temple City • Pandya Heritage' },
      { name: 'Tiruchirappalli', popular: true, heritageNote: 'Chola Capital • Rockfort' },
      { name: 'Salem', heritageNote: 'Mango City • Steel Hub' },
      { name: 'Tirunelveli', heritageNote: 'Tamirabarani River Heritage' },
      { name: 'Thanjavur', heritageNote: 'Brihadeeswara • Cauvery Delta' },
      { name: 'Kanchipuram', heritageNote: 'Silk Saree & Temple City' },
      { name: 'Vellore', heritageNote: 'Fort City' },
      { name: 'Erode', heritageNote: 'Turmeric City' },
      { name: 'Tiruppur', heritageNote: 'Knitwear Capital of India' },
    ],
  },
  {
    state: 'Telangana',
    region: 'South',
    cities: [
      { name: 'Hyderabad', popular: true, heritageNote: 'City of Pearls • Tech & Nizam' },
      { name: 'Warangal', heritageNote: 'Kakatiya Heritage • Thousand Pillar' },
      { name: 'Nizamabad', heritageNote: 'Northern Telangana Hub' },
      { name: 'Karimnagar', heritageNote: 'Manair Riverfront' },
      { name: 'Khammam', heritageNote: 'Eastern Telangana' },
    ],
  },
  {
    state: 'Andhra Pradesh',
    region: 'South',
    cities: [
      { name: 'Visakhapatnam', popular: true, heritageNote: 'City of Destiny • Coastal Hub' },
      { name: 'Vijayawada', popular: true, heritageNote: 'Krishna Riverfront • Commercial' },
      { name: 'Guntur', heritageNote: 'Amaravati Region • Chilli Hub' },
      { name: 'Tirupati', heritageNote: 'Lord Venkateswara Sanctuary' },
      { name: 'Rajahmundry', heritageNote: 'Godavari Cultural Capital' },
      { name: 'Nellore', heritageNote: 'Simhapuri' },
      { name: 'Kurnool', heritageNote: 'Rayalaseema Gateway' },
    ],
  },
  {
    state: 'West Bengal',
    region: 'East',
    cities: [
      { name: 'Kolkata', popular: true, heritageNote: 'City of Joy • Cultural Capital' },
      { name: 'Howrah', heritageNote: 'Ganges Riverfront Hub' },
      { name: 'Siliguri', popular: true, heritageNote: 'Gateway to Northeast & Hills' },
      { name: 'Durgapur', heritageNote: 'Steel City of Bengal' },
      { name: 'Asansol', heritageNote: 'Bardhaman Mining & Rail Hub' },
      { name: 'Burdwan', heritageNote: 'Historic Rarh Heartland' },
      { name: 'Kharagpur', heritageNote: 'Academic & Medinipur Hub' },
      { name: 'Malda', heritageNote: 'Mango & Silk Capital' },
    ],
  },
  {
    state: 'Punjab',
    region: 'North',
    cities: [
      { name: 'Chandigarh', popular: true, heritageNote: 'The City Beautiful • Capital' },
      { name: 'Amritsar', popular: true, heritageNote: 'Golden Temple • Majha Heritage' },
      { name: 'Ludhiana', popular: true, heritageNote: 'Industrial & Hosiery Capital' },
      { name: 'Jalandhar', heritageNote: 'Doaba Heartland' },
      { name: 'Patiala', heritageNote: 'Royal Heritage City' },
      { name: 'Bathinda', heritageNote: 'Malwa Region' },
      { name: 'Mohali', heritageNote: 'Greater Chandigarh' },
    ],
  },
  {
    state: 'Haryana',
    region: 'North',
    cities: [
      { name: 'Gurugram', popular: true, heritageNote: 'Millennium Cyber City' },
      { name: 'Faridabad', heritageNote: 'Industrial Hub' },
      { name: 'Panipat', heritageNote: 'City of Weavers' },
      { name: 'Karnal', heritageNote: 'City of Karna' },
      { name: 'Ambala', heritageNote: 'Twin City Gateway' },
      { name: 'Rohtak', heritageNote: 'Heart of Haryana' },
      { name: 'Hisar', heritageNote: 'City of Steel' },
    ],
  },
  {
    state: 'Madhya Pradesh',
    region: 'North',
    cities: [
      { name: 'Indore', popular: true, heritageNote: 'Cleanest City • Commercial Hub' },
      { name: 'Bhopal', popular: true, heritageNote: 'City of Lakes • State Capital' },
      { name: 'Gwalior', popular: true, heritageNote: 'Scindia Fort Heritage' },
      { name: 'Jabalpur', popular: true, heritageNote: 'Marble Rocks • Narmada' },
      { name: 'Ujjain', heritageNote: 'Mahakaleshwar Dham • Shipra' },
      { name: 'Sagar', heritageNote: 'Bundelkhand Hub' },
      { name: 'Ratlam', heritageNote: 'Malwa Junction' },
    ],
  },
  {
    state: 'Kerala',
    region: 'South',
    cities: [
      { name: 'Kochi', popular: true, heritageNote: 'Queen of Arabian Sea • Commercial' },
      { name: 'Thiruvananthapuram', popular: true, heritageNote: 'Travancore Capital' },
      { name: 'Kozhikode', heritageNote: 'City of Spices • Malabar Coast' },
      { name: 'Thrissur', heritageNote: 'Cultural Capital of Kerala' },
      { name: 'Kollam', heritageNote: 'Cashew & Backwaters Hub' },
      { name: 'Alappuzha', heritageNote: 'Venice of the East' },
      { name: 'Kannur', heritageNote: 'Theyyam Heritage Coast' },
    ],
  },
  {
    state: 'Bihar',
    region: 'East',
    cities: [
      { name: 'Patna', popular: true, heritageNote: 'Ancient Pataliputra • State Capital' },
      { name: 'Gaya', heritageNote: 'Bodh Gaya & Vishnupad Dham' },
      { name: 'Bhagalpur', heritageNote: 'Silk City of Bihar' },
      { name: 'Muzaffarpur', heritageNote: 'Litchi City • Tirhut' },
      { name: 'Darbhanga', heritageNote: 'Mithila Cultural Capital' },
      { name: 'Purnia', heritageNote: 'Seemanchal Hub' },
    ],
  },
  {
    state: 'Odisha',
    region: 'East',
    cities: [
      { name: 'Bhubaneswar', popular: true, heritageNote: 'Temple City of India • Capital' },
      { name: 'Cuttack', popular: true, heritageNote: 'Silver City • Mahanadi' },
      { name: 'Rourkela', heritageNote: 'Ispat Nagar • Steel City' },
      { name: 'Puri', heritageNote: 'Lord Jagannath Dham' },
      { name: 'Sambalpur', heritageNote: 'Western Odisha Cultural Hub' },
    ],
  },
  {
    state: 'Jharkhand',
    region: 'East',
    cities: [
      { name: 'Ranchi', popular: true, heritageNote: 'City of Waterfalls • Capital' },
      { name: 'Jamshedpur', popular: true, heritageNote: 'Tatanagar • Steel City' },
      { name: 'Dhanbad', heritageNote: 'Coal Capital of India' },
      { name: 'Bokaro', heritageNote: 'Steel City Hub' },
      { name: 'Deoghar', heritageNote: 'Baidyanath Dham' },
    ],
  },
  {
    state: 'Uttarakhand',
    region: 'North',
    cities: [
      { name: 'Dehradun', popular: true, heritageNote: 'Doon Valley • Capital' },
      { name: 'Haridwar', heritageNote: 'Ganges Gateway • Kumbh Dham' },
      { name: 'Rishikesh', heritageNote: 'Yoga Capital of the World' },
      { name: 'Nainital', heritageNote: 'Lake District of Kumaon' },
      { name: 'Haldwani', heritageNote: 'Gateway to Kumaon' },
    ],
  },
  {
    state: 'Himachal Pradesh',
    region: 'North',
    cities: [
      { name: 'Shimla', popular: true, heritageNote: 'Queen of Hills • Capital' },
      { name: 'Dharamshala', heritageNote: 'Kangra Valley • Dhauladhar' },
      { name: 'Mandi', heritageNote: 'Chhoti Kashi' },
      { name: 'Solan', heritageNote: 'City of Red Gold' },
      { name: 'Manali', heritageNote: 'Kullu Valley' },
    ],
  },
  {
    state: 'Jammu & Kashmir',
    region: 'North',
    cities: [
      { name: 'Srinagar', popular: true, heritageNote: 'Dal Lake Paradise' },
      { name: 'Jammu', heritageNote: 'City of Temples' },
      { name: 'Anantnag', heritageNote: 'Kashmir Valley' },
    ],
  },
  {
    state: 'Chhattisgarh',
    region: 'East',
    cities: [
      { name: 'Raipur', popular: true, heritageNote: 'Mahanadi Basin • Capital' },
      { name: 'Bilaspur', heritageNote: 'Nyaydhani of Chhattisgarh' },
      { name: 'Bhilai', heritageNote: 'Steel City' },
    ],
  },
  {
    state: 'Assam & North-East',
    region: 'East',
    cities: [
      { name: 'Guwahati', popular: true, heritageNote: 'Gateway to Northeast • Kamakhya' },
      { name: 'Shillong', heritageNote: 'Scotland of the East' },
      { name: 'Dibrugarh', heritageNote: 'Tea City of India' },
      { name: 'Silchar', heritageNote: 'Barak Valley' },
      { name: 'Agartala', heritageNote: 'Tripura Capital' },
      { name: 'Imphal', heritageNote: 'Manipur Valley' },
    ],
  },
  {
    state: 'Goa',
    region: 'West',
    cities: [
      { name: 'Panaji', heritageNote: 'State Capital • Mandovi River' },
      { name: 'Margao', heritageNote: 'Commercial Capital • South Goa' },
      { name: 'Vasco da Gama', heritageNote: 'Port City' },
    ],
  },
  {
    state: 'Global / NRI Diaspora',
    region: 'Global',
    cities: [
      { name: 'Dubai', popular: true, heritageNote: 'United Arab Emirates' },
      { name: 'Abu Dhabi', heritageNote: 'United Arab Emirates' },
      { name: 'Singapore', popular: true, heritageNote: 'Southeast Asia Hub' },
      { name: 'London', popular: true, heritageNote: 'United Kingdom' },
      { name: 'New York', popular: true, heritageNote: 'New York, USA' },
      { name: 'San Francisco / Bay Area', popular: true, heritageNote: 'Silicon Valley, USA' },
      { name: 'Dallas / Fort Worth', heritageNote: 'Texas, USA' },
      { name: 'Toronto', popular: true, heritageNote: 'Ontario, Canada' },
      { name: 'Sydney', heritageNote: 'Australia' },
      { name: 'Melbourne', heritageNote: 'Australia' },
    ],
  },
];

interface CitySelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (selectedCityString: string) => void;
  currentValue?: string;
  title?: string;
  subtitle?: string;
}

export const CitySelectModal: React.FC<CitySelectModalProps> = ({
  isOpen,
  onClose,
  onSelectCity,
  currentValue = '',
  title = 'Select State & City',
  subtitle = 'First choose the state on the left, then select the city from that state on the right',
}) => {
  // Determine initial state based on currentValue if it has a comma (e.g. "Jaipur, Rajasthan")
  const initialDetectedState = useMemo(() => {
    if (currentValue && currentValue.includes(',')) {
      const parts = currentValue.split(',');
      const stateName = parts[1]?.trim().toLowerCase();
      const match = STATES_AND_CITIES.find(
        (s) => s.state.toLowerCase() === stateName || s.state.toLowerCase().includes(stateName)
      );
      if (match) return match.state;
    }
    return 'Rajasthan'; // Default selected state
  }, [currentValue]);

  const [selectedStateName, setSelectedStateName] = useState<string>(initialDetectedState);
  const [searchQuery, setSearchQuery] = useState('');
  const [customCity, setCustomCity] = useState('');

  // Currently active state data
  const activeState = useMemo(() => {
    return (
      STATES_AND_CITIES.find((s) => s.state === selectedStateName) || STATES_AND_CITIES[0]
    );
  }, [selectedStateName]);

  // Filtered states list for the left column (if searching)
  const filteredStates = useMemo(() => {
    if (!searchQuery.trim()) return STATES_AND_CITIES;
    const q = searchQuery.toLowerCase().trim();
    return STATES_AND_CITIES.filter((s) => {
      const stateMatches = s.state.toLowerCase().includes(q);
      const cityMatches = s.cities.some((c) => c.name.toLowerCase().includes(q));
      return stateMatches || cityMatches;
    });
  }, [searchQuery]);

  // Filtered cities list for the right column
  const filteredCitiesForActiveState = useMemo(() => {
    if (!searchQuery.trim()) return activeState.cities;
    const q = searchQuery.toLowerCase().trim();
    // If search matches city name or heritage note
    const matchedInState = activeState.cities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.heritageNote && c.heritageNote.toLowerCase().includes(q))
    );

    // If no direct city match in active state, but searching, show all matched in state
    return matchedInState.length > 0 ? matchedInState : activeState.cities;
  }, [searchQuery, activeState]);

  const handleSelectCity = (cityName: string) => {
    const formatted = `${cityName}, ${activeState.state}`;
    onSelectCity(formatted);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCity.trim()) return;
    const formatted = `${customCity.trim()}, ${activeState.state}`;
    onSelectCity(formatted);
    setCustomCity('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="880px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Subtitle */}
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '-0.5rem', lineHeight: 1.5 }}>
          {subtitle}
        </p>

        {/* Global Search Bar */}
        <div style={{ position: 'relative' }}>
          <Search
            size={18}
            color="var(--color-gold-dark)"
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            style={{
              paddingLeft: '2.6rem',
              paddingRight: searchQuery ? '2.5rem' : '1rem',
              fontSize: '0.92rem',
              borderColor: 'var(--color-gold)',
              background: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(197, 160, 89, 0.1)',
            }}
            placeholder="Search state or city (e.g. Rajasthan, Jaipur, Pune, Bangalore...)"
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              // Auto-select first matching state if searching
              if (val.trim()) {
                const q = val.toLowerCase().trim();
                const matched = STATES_AND_CITIES.find(
                  (s) =>
                    s.state.toLowerCase().includes(q) ||
                    s.cities.some((c) => c.name.toLowerCase().includes(q))
                );
                if (matched) {
                  setSelectedStateName(matched.state);
                }
              }
            }}
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
              }}
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Two Separate Columns Container */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(220px, 260px) 1fr',
            gap: '1rem',
            background: 'var(--bg-primary)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(197, 160, 89, 0.3)',
            overflow: 'hidden',
            minHeight: '420px',
          }}
        >
          {/* COLUMN 1: States List (Left Column) */}
          <div
            style={{
              borderRight: '1px solid rgba(197, 160, 89, 0.25)',
              background: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '460px',
            }}
          >
            {/* Column 1 Header */}
            <div
              style={{
                padding: '0.75rem 1rem',
                background: 'var(--bg-secondary)',
                borderBottom: '1px solid rgba(197, 160, 89, 0.2)',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: 'var(--color-burgundy-dark)',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <MapPin size={13} color="var(--color-burgundy)" />
              <span>1. Choose State / Region</span>
            </div>

            {/* State items scrollable list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.4rem 0' }}>
              {filteredStates.map((st) => {
                const isStateActive = st.state === activeState.state;
                return (
                  <div
                    key={st.state}
                    onClick={() => setSelectedStateName(st.state)}
                    style={{
                      padding: '0.7rem 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      borderLeft: isStateActive ? '4px solid var(--color-burgundy)' : '4px solid transparent',
                      background: isStateActive ? 'var(--color-burgundy-subtle)' : 'transparent',
                      transition: 'all 120ms ease',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: isStateActive ? 800 : 600,
                          fontSize: '0.86rem',
                          color: isStateActive ? 'var(--color-burgundy-dark)' : 'var(--text-primary)',
                        }}
                      >
                        {st.state}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {st.cities.length} cities listed
                      </div>
                    </div>

                    <ChevronRight
                      size={14}
                      color={isStateActive ? 'var(--color-burgundy)' : 'rgba(110, 85, 90, 0.3)'}
                    />
                  </div>
                );
              })}

              {filteredStates.length === 0 && (
                <div style={{ padding: '1.5rem 1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  No state found for "{searchQuery}"
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 2: Cities in Selected State (Right Column) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '460px',
              padding: '0.75rem 1rem 1rem',
            }}
          >
            {/* Column 2 Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '0.65rem',
                borderBottom: '1px solid rgba(197, 160, 89, 0.25)',
                marginBottom: '0.75rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-gold-dark)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  2. Select City in
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-burgundy-dark)' }}>
                  {activeState.state}
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  background: 'var(--color-gold-subtle)',
                  color: 'var(--color-gold-dark)',
                  border: '1px solid rgba(197, 160, 89, 0.3)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {filteredCitiesForActiveState.length} Cities Available
              </span>
            </div>

            {/* Cities Grid List */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '0.6rem',
                paddingRight: '0.3rem',
                paddingBottom: '0.5rem',
              }}
            >
              {filteredCitiesForActiveState.map((city) => {
                const fullStr = `${city.name}, ${activeState.state}`;
                const isSelected = currentValue.toLowerCase().includes(city.name.toLowerCase());

                return (
                  <div
                    key={city.name}
                    onClick={() => handleSelectCity(city.name)}
                    style={{
                      padding: '0.75rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'var(--color-gold-subtle)' : '#FFFFFF',
                      border: isSelected ? '1.5px solid var(--color-gold)' : '1px solid rgba(197, 160, 89, 0.25)',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'var(--color-burgundy)';
                        e.currentTarget.style.background = 'var(--color-burgundy-subtle)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(197, 160, 89, 0.25)';
                        e.currentTarget.style.background = '#FFFFFF';
                      }
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.3rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-burgundy-dark)' }}>
                          {city.name}
                        </span>
                        {isSelected && (
                          <span
                            style={{
                              background: 'var(--color-burgundy)',
                              color: '#FFFFFF',
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Check size={12} />
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {activeState.state}
                      </div>
                    </div>

                    {city.heritageNote && (
                      <div
                        style={{
                          fontSize: '0.67rem',
                          color: 'var(--color-gold-dark)',
                          marginTop: '0.35rem',
                          fontStyle: 'italic',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {city.heritageNote}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Custom City in Active State */}
            <div
              style={{
                marginTop: '0.75rem',
                paddingTop: '0.75rem',
                borderTop: '1px dashed var(--color-gold)',
                background: '#FFFFFF',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--color-burgundy-dark)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Building2 size={13} color="var(--color-gold-dark)" />
                <span>Town, Tehsil or Village in {activeState.state} not listed?</span>
              </div>
              <form onSubmit={handleCustomSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
                  placeholder={`e.g. Specific place in ${activeState.state}`}
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                  disabled={!customCity.trim()}
                >
                  <PlusCircle size={14} />
                  <span>Use City</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: 'var(--border-light)', paddingTop: '0.75rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Selected: <strong style={{ color: 'var(--color-burgundy-dark)' }}>{currentValue || 'None chosen yet'}</strong>
          </div>
          <button type="button" className="btn-outline" onClick={onClose} style={{ fontSize: '0.85rem' }}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};
