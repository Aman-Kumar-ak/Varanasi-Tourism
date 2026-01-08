import React from 'react';
import { 
  // Transport icons
  FaCar,
  FaBus,
  FaShip,
  FaTrain,
  FaPlane,
  FaMotorcycle,
  FaTaxi,
  
  // Academic icons
  FaGraduationCap,
  FaBook,
  
  // Event icons
  FaCalendarAlt,
  
  // Hotel/Restaurant icons
  FaHotel,
  FaUtensils,
  
  // Sports icons
  FaBaseballBall,
} from 'react-icons/fa';
import { 
  // Spiritual/Religious icons
  GiPrayerBeads,
  GiScrollUnfurled,
  GiCandleFlame,
  GiPartyPopper,
  GiMeditation,
} from 'react-icons/gi';
import { 
  // Location/Place icons
  HiLocationMarker,
  HiMap,
} from 'react-icons/hi';
import { 
  // Cable car
  MdCable,
} from 'react-icons/md';
import AutoRickshawIcon from '@/components/common/AutoRickshawIcon';

// Icon mapping from emoji/string to React Icon component
export const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  // Spiritual/Religious
  '🕉️': GiPrayerBeads,
  '📜': GiScrollUnfurled,
  '🕯️': GiCandleFlame,
  '🎉': GiPartyPopper,
  '📿': GiPrayerBeads,
  '🧘': GiMeditation,
  
  // Location
  '📍': HiLocationMarker,
  '🗺️': HiMap,
  
  // Transport
  '🚗': FaCar,
  '🚕': FaTaxi,
  '🚌': FaBus,
  '🚢': FaShip,
  '🚂': FaTrain,
  '✈️': FaPlane,
  '🏍️': FaMotorcycle,
  '🚡': MdCable,
  '🛺': AutoRickshawIcon, // Auto rickshaw - custom three-wheeled vehicle icon
  '🚇': FaTrain, // Metro
  '⛵': FaShip, // Boat
  
  // Academic
  '🎓': FaGraduationCap,
  '📚': FaBook,
  
  // Events
  '📅': FaCalendarAlt,
  
  // Hotel/Restaurant
  '🏨': FaHotel,
  '🍽️': FaUtensils,
  
  // Sports
  '🏏': FaBaseballBall,
};

// Helper function to get icon component from emoji/string
export function getIconComponent(iconString?: string): React.ComponentType<{ className?: string }> | null {
  if (!iconString) return null;
  return iconMap[iconString] || null;
}

// Helper function to render icon
export function renderIcon(iconString?: string, className?: string): React.ReactNode {
  const IconComponent = getIconComponent(iconString);
  if (!IconComponent) return null;
  return <IconComponent className={className} />;
}
