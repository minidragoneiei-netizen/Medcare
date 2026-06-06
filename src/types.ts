/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'elderly' | 'caregiver' | 'visitor';

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  diseases: string[]; // โรคประจำตัว
  emergencyContact: EmergencyContact;
  photoUrl?: string;
  pinCode: string;
  deviceConnectedId: string;
  alertSound: string; // 'radar' | 'classic' | 'gentle'
  caregiverName: string;
  caregiverPhone: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string; // e.g., "1 เม็ด" (1 tablet), "500 มก."
  times: string[]; // e.g., ["08:00", "20:00"]
  relationToMeal: 'before' | 'after' | 'with'; // ก่อนอาหาร / หลังอาหาร / พร้อมอาหาร
  notes: string; // เช่น ยาละลายลิ่มเลือด, ห้ามทานพร้อมนม
  remainingCount: number; // จำนวนยาคงเหลือในเครื่อง
  maxStorage: number; // ความจุเต็มกล่อง
  active: boolean; // มีผลใช้งาน
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string; // "HH:MM" e.g., "08:00"
  date: string; // "YYYY-MM-DD"
  takenTime: string | null; // "HH:MM" or null
  status: 'taken' | 'missed' | 'pending' | 'snoozed';
  notes?: string;
}

export interface DispenserHardwareState {
  deviceId: string;
  status: 'online' | 'offline' | 'dispensing' | 'error';
  batteryPercent: number;
  wifiSignal: 'strong' | 'medium' | 'weak' | 'none';
  compartments: {
    slot: string;
    medName: string;
    count: number;
    maxCount: number;
  }[];
  dispenseLogs: {
    time: string;
    medName: string;
    status: 'success' | 'failed';
  }[];
}

// Initial Mock Data to keep app fully rich and pre-populated
export const INITIAL_PROFILE: UserProfile = {
  name: "คุณยาย สมศรี สุขสบาย",
  age: 78,
  gender: "หญิง",
  diseases: ["โรคเบาหวาน (Type 2 Diabetes)", "ความดันโลหิตสูง (Hypertension)", "ไขมันในเลือดสูง"],
  emergencyContact: {
    name: "คุณวิชัย สุขสบาย",
    relation: "ลูกชาย (ผู้ดูแล)",
    phone: "081-234-5678"
  },
  photoUrl: "https://images.unsplash.com/photo-1544120190-2751b3271578?w=150&auto=format&fit=crop&q=80",
  pinCode: "1234",
  deviceConnectedId: "MC-9082-AUT",
  alertSound: "gentle",
  caregiverName: "คุณวิชัย สุขสบาย",
  caregiverPhone: "081-234-5678"
};

export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: "med-1",
    name: "Metformin (ยาเบาหวาน)",
    dosage: "1 เม็ด (500 มก.)",
    times: ["08:00", "18:00"],
    relationToMeal: "before",
    notes: "ทานก่อนอาหาร 15-30 นาที",
    remainingCount: 24,
    maxStorage: 30,
    active: true
  },
  {
    id: "med-2",
    name: "Amlodipine (ยาลดความดัน)",
    dosage: "1 เม็ด (5 มก.)",
    times: ["08:00"],
    relationToMeal: "after",
    notes: "ทานทันทีหลังอาหารเช้า ห้ามลืมเด็ดขาด",
    remainingCount: 15,
    maxStorage: 30,
    active: true
  },
  {
    id: "med-3",
    name: "Baby Aspirin (ป้องกันลิ่มเลือด)",
    dosage: "1 เม็ด (81 มก.)",
    times: ["08:00"],
    relationToMeal: "after",
    notes: "เคี้ยวหรือกลืนพร้อมหลังอาหารเช้า ป้องกันการระคายเคืองกระเพาะ",
    remainingCount: 10,
    maxStorage: 15,
    active: true
  },
  {
    id: "med-4",
    name: "Atorvastatin (ยาลดไขมัน)",
    dosage: "1 เม็ด (20 มก.)",
    times: ["21:00"],
    relationToMeal: "after",
    notes: "ทานหลังอาหารเย็นหรือก่อนนอน",
    remainingCount: 18,
    maxStorage: 30,
    active: true
  }
];

// Prepopulate some logs for historical reporting
export const INITIAL_LOGS: MedicationLog[] = [
  // Today (simulated)
  { id: "log-t1", medicationId: "med-1", medicationName: "Metformin (ยาเบาหวาน)", dosage: "1 เม็ด (500 มก.)", scheduledTime: "08:00", date: "2026-06-06", takenTime: "08:05", status: "taken" },
  { id: "log-t2", medicationId: "med-2", medicationName: "Amlodipine (ยาลดความดัน)", dosage: "1 เม็ด (5 มก.)", scheduledTime: "08:00", date: "2026-06-06", takenTime: "08:06", status: "taken" },
  { id: "log-t3", medicationId: "med-3", medicationName: "Baby Aspirin (ป้องกันลิ่มเลือด)", dosage: "1 เม็ด (81 มก.)", scheduledTime: "08:00", date: "2026-06-06", takenTime: "08:06", status: "taken" },
  { id: "log-t4", medicationId: "med-1", medicationName: "Metformin (ยาเบาหวาน)", dosage: "1 เม็ด (500 มก.)", scheduledTime: "18:00", date: "2026-06-06", takenTime: null, status: "pending" },
  { id: "log-t5", medicationId: "med-4", medicationName: "Atorvastatin (ยาลดไขมัน)", dosage: "1 เม็ด (20 มก.)", scheduledTime: "21:00", date: "2026-06-06", takenTime: null, status: "pending" },

  // Yesterday (June 5, 2026) -> Grandma took everything!
  { id: "log-y1", medicationId: "med-1", medicationName: "Metformin (ยาเบาหวาน)", dosage: "1 เม็ด (500 มก.)", scheduledTime: "08:00", date: "2026-06-05", takenTime: "07:58", status: "taken" },
  { id: "log-y2", medicationId: "med-2", medicationName: "Amlodipine (ยาลดความดัน)", dosage: "1 เม็ด (5 มก.)", scheduledTime: "08:00", date: "2026-06-05", takenTime: "08:12", status: "taken" },
  { id: "log-y3", medicationId: "med-3", medicationName: "Baby Aspirin (ป้องกันลิ่มเลือด)", dosage: "1 เม็ด (81 มก.)", scheduledTime: "08:00", date: "2026-06-05", takenTime: "08:12", status: "taken" },
  { id: "log-y4", medicationId: "med-1", medicationName: "Metformin (ยาเบาหวาน)", dosage: "1 เม็ด (500 มก.)", scheduledTime: "18:00", date: "2026-06-05", takenTime: "18:10", status: "taken" },
  { id: "log-y5", medicationId: "med-4", medicationName: "Atorvastatin (ยาลดไขมัน)", dosage: "1 เม็ด (20 มก.)", scheduledTime: "21:00", date: "2026-06-05", takenTime: "21:05", status: "taken" },

  // June 4, 2026 -> Missed one! (Atorvastatin was missed, Metformin post-noon snoozed)
  { id: "log-d4-1", medicationId: "med-1", medicationName: "Metformin (ยาเบาหวาน)", dosage: "1 เม็ด (500 มก.)", scheduledTime: "08:00", date: "2026-06-04", takenTime: "08:01", status: "taken" },
  { id: "log-d4-2", medicationId: "med-2", medicationName: "Amlodipine (ยาลดความดัน)", dosage: "1 เม็ด (5 มก.)", scheduledTime: "08:00", date: "2026-06-04", takenTime: "08:03", status: "taken" },
  { id: "log-d4-3", medicationId: "med-3", medicationName: "Baby Aspirin (ป้องกันลิ่มเลือด)", dosage: "1 เม็ด (81 มก.)", scheduledTime: "08:00", date: "2026-06-04", takenTime: "08:03", status: "taken" },
  { id: "log-d4-4", medicationId: "med-1", medicationName: "Metformin (ยาเบาหวาน)", dosage: "1 เม็ด (500 มก.)", scheduledTime: "18:00", date: "2026-06-04", takenTime: "18:40", status: "snoozed" }, // was recorded taken later
  { id: "log-d4-5", medicationId: "med-4", medicationName: "Atorvastatin (ยาลดไขมัน)", dosage: "1 เม็ด (20 มก.)", scheduledTime: "21:00", date: "2026-06-04", takenTime: null, status: "missed" },

  // June 3, 2026 -> perfect day
  { id: "log-d3-1", medicationId: "med-1", medicationName: "Metformin (ยาเบาหวาน)", dosage: "1 เม็ด (500 มก.)", scheduledTime: "08:00", date: "2026-06-03", takenTime: "08:15", status: "taken" },
  { id: "log-d3-2", medicationId: "med-2", medicationName: "Amlodipine (ยาลดความดัน)", dosage: "1 เม็ด (5 มก.)", scheduledTime: "08:00", date: "2026-06-03", takenTime: "08:15", status: "taken" },
  { id: "log-d3-3", medicationId: "med-3", medicationName: "Baby Aspirin (ป้องกันลิ่มเลือด)", dosage: "1 เม็ด (81 มก.)", scheduledTime: "08:00", date: "2026-06-03", takenTime: "08:16", status: "taken" },
  { id: "log-d3-4", medicationId: "med-1", medicationName: "Metformin (ยาเบาหวาน)", dosage: "1 เม็ด (500 มก.)", scheduledTime: "18:00", date: "2026-06-03", takenTime: "18:05", status: "taken" },
  { id: "log-d3-5", medicationId: "med-4", medicationName: "Atorvastatin (ยาลดไขมัน)", dosage: "1 เม็ด (20 มก.)", scheduledTime: "21:00", date: "2026-06-03", takenTime: "21:10", status: "taken" },

  // June 2, 2026 -> Missed morning amlodipine & aspirin! (Out of stock trigger)
  { id: "log-d2-1", medicationId: "med-1", medicationName: "Metformin (ยาเบาหวาน)", dosage: "1 เม็ด (500 มก.)", scheduledTime: "08:00", date: "2026-06-02", takenTime: "08:10", status: "taken" },
  { id: "log-d2-2", medicationId: "med-2", medicationName: "Amlodipine (ยาลดความดัน)", dosage: "1 เม็ด (5 มก.)", scheduledTime: "08:00", date: "2026-06-02", takenTime: null, status: "missed" },
  { id: "log-d2-3", medicationId: "med-3", medicationName: "Baby Aspirin (ป้องกันลิ่มเลือด)", dosage: "1 เม็ด (81 มก.)", scheduledTime: "08:00", date: "2026-06-02", takenTime: null, status: "missed" },
  { id: "log-d2-4", medicationId: "med-1", medicationName: "Metformin (ยาเบาหวาน)", dosage: "1 เม็ด (500 มก.)", scheduledTime: "18:00", date: "2026-06-02", takenTime: "18:00", status: "taken" },
  { id: "log-d2-5", medicationId: "med-4", medicationName: "Atorvastatin (ยาลดไขมัน)", dosage: "1 เม็ด (20 มก.)", scheduledTime: "21:00", date: "2026-06-02", takenTime: "21:00", status: "taken" }
];

export const INITIAL_DISPENSER: DispenserHardwareState = {
  deviceId: "MC-9082-AUT",
  status: "online",
  batteryPercent: 94,
  wifiSignal: "strong",
  compartments: [
    { slot: "ช่องที่ 1 (A เช้า)", medName: "Metformin (ยาเบาหวาน)", count: 24, maxCount: 30 },
    { slot: "ช่องที่ 2 (B เช้า)", medName: "Amlodipine (ยาลดความดัน)", count: 15, maxCount: 30 },
    { slot: "ช่องที่ 3 (C เช้า)", medName: "Baby Aspirin (ยาบำรุง)", count: 10, maxCount: 15 },
    { slot: "ช่องที่ 4 (D เย็น/นอน)", medName: "Atorvastatin (ยาลดไขมัน)", count: 18, maxCount: 30 }
  ],
  dispenseLogs: [
    { time: "2026-06-06 08:00", medName: "Metformin, Amlodipine, Baby Aspirin", status: "success" },
    { time: "2026-06-05 21:00", medName: "Atorvastatin", status: "success" },
    { time: "2026-06-05 18:00", medName: "Metformin", status: "success" },
    { time: "2026-06-05 08:00", medName: "Metformin, Amlodipine, Baby Aspirin", status: "success" }
  ]
};
