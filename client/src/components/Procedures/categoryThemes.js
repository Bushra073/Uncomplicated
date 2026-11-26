import {
  Fingerprint,
  GraduationCap,
  Scale,
  BriefcaseBusiness,
  House,
  Compass,
} from 'lucide-react'

export const categoryThemes = {
  1: {
    icon: Fingerprint,
    number: '01',
    tagline: 'Your identity. Your essentials.',
    mood: 'THE ESSENTIALS',

    colors: {
      dark: '#112250',
      primary: '#3C507D',
      accent: '#E0C58F',
      background: '#F5F0E9',
      secondary: '#D9CBC2',
    },

    gradient: 'from-[#112250] via-[#3C507D] to-[#112250]',
    surface: 'bg-[#F5F0E9]',
    text: 'text-[#112250]',
    accent: 'text-[#E0C58F]',
    lightAccent: 'bg-[#E0C58F]',
    border: 'border-[#D9CBC2]',
  },

  2: {
    icon: GraduationCap,
    number: '02',
    tagline: 'Dream bigger. Go further.',
    mood: 'THE NEXT CHAPTER',

    colors: {
      dark: '#35245D',
      primary: '#8468CF',
      accent: '#DDF478',
      background: '#F8F5FF',
      secondary: '#D8CCFA',
    },

    gradient: 'from-[#35245D] via-[#8468CF] to-[#35245D]',
    surface: 'bg-[#F8F5FF]',
    text: 'text-[#35245D]',
    accent: 'text-[#DDF478]',
    lightAccent: 'bg-[#DDF478]',
    border: 'border-[#D8CCFA]',
  },

  3: {
    icon: Scale,
    number: '03',
    tagline: 'Know your rights. Find clarity.',
    mood: 'KNOW WHERE YOU STAND',

    colors: {
      dark: '#591F35',
      primary: '#A64B5C',
      accent: '#D99479',
      background: '#FFF4E8',
      secondary: '#E8C9BD',
    },

    gradient: 'from-[#591F35] via-[#A64B5C] to-[#591F35]',
    surface: 'bg-[#FFF4E8]',
    text: 'text-[#591F35]',
    accent: 'text-[#D99479]',
    lightAccent: 'bg-[#D99479]',
    border: 'border-[#E8C9BD]',
  },

  4: {
    icon: BriefcaseBusiness,
    number: '04',
    tagline: 'Build something. Make your move.',
    mood: 'MAKE IT HAPPEN',

    colors: {
      dark: '#103C35',
      primary: '#087F68',
      accent: '#63D9AB',
      background: '#F0FAF4',
      secondary: '#D9F99D',
    },

    gradient: 'from-[#103C35] via-[#087F68] to-[#103C35]',
    surface: 'bg-[#F0FAF4]',
    text: 'text-[#103C35]',
    accent: 'text-[#63D9AB]',
    lightAccent: 'bg-[#63D9AB]',
    border: 'border-[#D9F99D]',
  },

  5: {
    icon: House,
    number: '05',
    tagline: 'Make everyday life a little easier.',
    mood: 'LIFE, SORTED',

    colors: {
      dark: '#87452C',
      primary: '#F29B65',
      accent: '#A8D5E5',
      background: '#FFF6E9',
      secondary: '#FFD6AD',
    },

    gradient: 'from-[#87452C] via-[#C76C42] to-[#87452C]',
    surface: 'bg-[#FFF6E9]',
    text: 'text-[#87452C]',
    accent: 'text-[#A8D5E5]',
    lightAccent: 'bg-[#A8D5E5]',
    border: 'border-[#FFD6AD]',
  },
}

const defaultTheme = {
  ...categoryThemes[1],
  icon: Compass,
  number: '00',
  tagline: 'Find your next step.',
  mood: 'EXPLORE',
}

export function getCategoryTheme(categoryId) {
  return categoryThemes[Number(categoryId)] || defaultTheme
}