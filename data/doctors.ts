export interface Doctor {
  id: string
  name: string
  specialty: string
  clinic: string
  experience: number
  rating: number
  patients: number
  bio: string
  fee: number
  phone: string
  email: string
  password: string
  availableSlots: {
    date: string
    times: string[]
  }[]
}

const getNextDates = (days = 3) => {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i+1)
    return d.toISOString().split("T")[0]
  })
}

const dates = getNextDates()

export const DOCTORS: Doctor[] = [
  {
    id: "1",
    name: "Dr. Ahmed Bennani",
    specialty: "Cardiology",
    clinic: "Heart Care Center, Algiers",
    experience: 12,
    rating: 4.8,
    patients: 1230,
    bio: "Specialized in heart disease prevention and treatment with 12 years of experience in cardiovascular medicine.",
    fee: 2500,
    phone: "+213 21 123 4567",
    email: "a.bennani@heartcare.dz",
    password: "ahmed123",
    availableSlots: [
      { date: dates[0], times: ["09:00", "10:00", "14:00", "15:30"] },
      { date: dates[1], times: ["10:00", "11:00", "15:00", "16:00"] },
      { date: dates[2], times: ["09:30", "11:00", "14:00", "16:30"] },
    ],
  },
  {
    id: "2",
    name: "Dr. Fatima Saidane",
    specialty: "General Practice",
    clinic: "Health Plus Clinic, Oran",
    experience: 8,
    rating: 4.6,
    patients: 890,
    bio: "General practitioner with expertise in preventive care and family medicine. Committed to patient wellness.",
    fee: 1500,
    phone: "+213 41 222 5555",
    email: "f.saidane@healthplus.dz",
    password: "fatima123",
    availableSlots: [
      { date: dates[0], times: ["08:00", "09:00", "13:00", "14:00"] },
      { date: dates[1], times: ["08:30", "09:30", "13:30", "14:30"] },
      { date: dates[2], times: ["08:00", "10:00", "13:00", "15:00"] },
    ],
  },
  {
    id: "3",
    name: "Dr. Mohamed Khadra",
    specialty: "Neurology",
    clinic: "Neuroscience Institute, Algiers",
    experience: 15,
    rating: 4.9,
    patients: 1560,
    bio: "Leading neurologist with expertise in neurological disorders and advanced diagnostic techniques.",
    fee: 3000,
    phone: "+213 21 334 4567",
    email: "m.khadra@neuro.dz",
    password: "mohamed123",
    availableSlots: [
      { date: dates[0], times: ["10:00", "11:30", "15:00"] },
      { date: dates[1], times: ["09:00", "11:00", "14:00", "16:00"] },
      { date: dates[2], times: ["10:30", "12:00", "15:30"] },
    ],
  },
  {
    id: "4",
    name: "Dr. Leila Osman",
    specialty: "Dermatology",
    clinic: "Skin Care Clinic, Constantine",
    experience: 10,
    rating: 4.7,
    patients: 750,
    bio: "Dermatologist specializing in skin diseases and cosmetic treatments with advanced techniques.",
    fee: 2000,
    phone: "+213 31 555 6666",
    email: "l.osman@skincare.dz",
    password: "leila123",
    availableSlots: [
      { date: dates[0], times: ["09:00", "10:30", "14:00", "15:30"] },
      { date: dates[1], times: ["10:00", "11:30", "15:00", "16:30"] },
      { date: dates[2], times: ["09:30", "11:00", "14:30", "16:00"] },
    ],
  },
  {
    id: "5",
    name: "Dr. Hassan Bouazza",
    specialty: "Orthopedics",
    clinic: "Bone & Joint Center, Blida",
    experience: 14,
    rating: 4.8,
    patients: 1340,
    bio: "Orthopedic surgeon with expertise in joint replacement and sports medicine.",
    fee: 2800,
    phone: "+213 25 777 8888",
    email: "h.bouazza@orthocenter.dz",
    password: "hassan123",
    availableSlots: [
      { date: dates[0], times: ["08:30", "10:00", "13:30", "15:00"] },
      { date: dates[1], times: ["09:00", "10:30", "14:00", "15:30"] },
      { date: dates[2], times: ["08:00", "09:30", "13:00", "14:30"] },
    ],
  },
  {
    id: "6",
    name: "Dr. Zahra Medel",
    specialty: "Pediatrics",
    clinic: "Kids Health Center, Algiers",
    experience: 11,
    rating: 4.9,
    patients: 2100,
    bio: "Pediatrician passionate about child health and development with gentle, caring approach.",
    fee: 1800,
    phone: "+213 21 999 0000",
    email: "z.medel@kidshealth.dz",
    password: "zahra123",
    availableSlots: [
      { date: dates[0], times: ["09:30", "11:00", "14:30", "16:00"] },
      { date: dates[1], times: ["10:00", "11:30", "15:00", "16:30"] },
      { date: dates[2], times: ["09:00", "10:30", "14:00", "15:30"] },
    ],
  },
]
