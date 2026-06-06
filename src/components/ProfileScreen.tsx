/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile } from '../types';
import { User, Shield, Phone, Bell, Key, Plus, Trash2, Check, Save } from 'lucide-react';

interface ProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export default function ProfileScreen({ profile, onUpdateProfile }: ProfileScreenProps) {
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [gender, setGender] = useState(profile.gender);
  const [pinCode, setPinCode] = useState(profile.pinCode);
  const [alertSound, setAlertSound] = useState(profile.alertSound);
  const [caregiverName, setCaregiverName] = useState(profile.caregiverName);
  const [caregiverPhone, setCaregiverPhone] = useState(profile.caregiverPhone);
  
  // Emergency contacts state
  const [emergencyName, setEmergencyName] = useState(profile.emergencyContact.name);
  const [emergencyRelation, setEmergencyRelation] = useState(profile.emergencyContact.relation);
  const [emergencyPhone, setEmergencyPhone] = useState(profile.emergencyContact.phone);

  // Diseases tags
  const [diseases, setDiseases] = useState<string[]>(profile.diseases);
  const [newDisease, setNewDisease] = useState('');

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleAddDisease = () => {
    if (newDisease.trim() && !diseases.includes(newDisease.trim())) {
      setDiseases([...diseases, newDisease.trim()]);
      setNewDisease('');
    }
  };

  const handleRemoveDisease = (idxToRemove: number) => {
    setDiseases(diseases.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name,
      age: Number(age),
      gender,
      pinCode,
      alertSound,
      caregiverName,
      caregiverPhone,
      diseases,
      emergencyContact: {
        name: emergencyName,
        relation: emergencyRelation,
        phone: emergencyPhone
      }
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Save Success Alert floating overlay style */}
      {saveSuccess && (
        <div id="save-profile-success-alert" className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold rounded-2xl flex items-center gap-2 shadow-md animate-fade-in">
          <Check className="w-5 h-5 stroke-[3] text-emerald-600" />
          <span>บันทึกการเปลี่ยนแปลงประวัติและตั้งค่าลงตู้ยาเรียบร้อยแล้ว! (Synced successfully)</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Row 1: Patient main details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center justify-center p-4 border-b md:border-b-0 md:border-r border-slate-100 text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-100 shadow-sm mb-3">
              <img
                src={profile.photoUrl || "https://images.unsplash.com/photo-1544120190-2751b3271578?w=150&auto=format&fit=crop&q=80"}
                alt="Patient Profile"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-extrabold text-slate-950 text-lg leading-snug">{profile.name}</h3>
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md mt-1 mb-3">
              ผู้รับประสานสิทธิ์
            </span>
            <div className="text-xs text-slate-400 font-mono">ID: {profile.deviceConnectedId}</div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <User className="w-4 h-4 text-indigo-500" />
              <span>ข้อมูลส่วนตัวผู้สูงอายุ (Personal Info)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">ชื่อ-นามสกุลจริง</label>
                <input
                  type="text"
                  value={name}
                  id="profile-name-input"
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">อายุ (ปี)</label>
                  <input
                    type="number"
                    value={age}
                    id="profile-age-input"
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">เพศ</label>
                  <select
                    value={gender}
                    id="profile-gender-input"
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-medium"
                  >
                    <option value="ชาย">ชาย</option>
                    <option value="หญิง">หญิง</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Chronic diseases edit tool */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">โรคประจำตัว / ข้อควรระวังทางการแพทย์</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {diseases.map((d, index) => (
                  <span key={index} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-indigo-100">
                    <span>{d}</span>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveDisease(index)}
                      className="text-indigo-400 hover:text-indigo-700 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDisease}
                  placeholder="เพิ่มโรค เช่น ไตเสื่อม / โรคหอบหืด"
                  onChange={(e) => setNewDisease(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddDisease}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่ม</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Emergency Contact info */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
          <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-2">
            <Phone className="w-4 h-4 text-indigo-500" />
            <span>กรณีฉุกเฉิน / ผู้ดูแลอันดับที่หนึ่ง (Emergency Call Details)</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">ชื่อผู้ติดต่อฉุกเฉิน</label>
              <input
                type="text"
                value={emergencyName}
                id="profile-emergency-name"
                onChange={(e) => setEmergencyName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">ความสัมพันธ์</label>
              <input
                type="text"
                value={emergencyRelation}
                id="profile-emergency-relation"
                onChange={(e) => setEmergencyRelation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">เบอร์สายด่วนความปลอดภัย</label>
              <input
                type="text"
                value={emergencyPhone}
                id="profile-emergency-phone"
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium font-mono"
              />
            </div>
          </div>
        </div>

        {/* Row 3: Device alarm settings and passcode Security */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Sound choice */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <Bell className="w-4 h-4 text-indigo-500" />
              <span>ความดังและทำนองเสียงตู้ยา (Alarm Settings)</span>
            </h4>
            <p className="text-xs text-slate-400">
              เสียงดนตรีที่จะดังขึ้นที่บริเวณเครื่องจ่ายยาอัตโนมัติเมื่อถึงรอบเวลา
            </p>

            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 cursor-pointer transition-all">
                <input
                  type="radio"
                  name="ringtone"
                  value="gentle"
                  checked={alertSound === 'gentle'}
                  onChange={() => setAlertSound('gentle')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="block font-bold text-slate-800 text-xs">🔔 ระฆังวิหารพรมละมุน (Gentle Bell)</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">เสียงเบา สั่นสว่าง นุ่มนวล เหมาะสำหรับอาม่าขี้ตกใจ</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-100 cursor-pointer transition-all">
                <input
                  type="radio"
                  name="ringtone"
                  value="classic"
                  checked={alertSound === 'classic'}
                  onChange={() => setAlertSound('classic')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <span className="block font-bold text-slate-800 text-xs">🚨 ไซเรนแจ้งภัยดนตรี (Classic Beep)</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">เสียงแหลม ถี่ พุ่ง ชัดเจน สำหรับกรณีผู้ที่มีสัมผัสทัศนเสียงค่อนข้างลึก</span>
                </div>
              </label>
            </div>
          </div>

          {/* Secure PIN code */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <Key className="w-4 h-4 text-indigo-500" />
              <span>ระบบความปลอดภัยตู้ (Lock PIN)</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              รหัสผ่าน 4 หลักสำหรับใช้ในการปลดล็อกหน้าจอเครื่องจ่าย และยืนยันการตั้งค่าตารางยาใหม่
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">รหัส PIN ปัจจุบัน</label>
              <input
                type="text"
                maxLength={4}
                value={pinCode}
                id="profile-pin-input"
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                className="w-32 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-mono text-center text-lg font-bold text-indigo-700 tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="block text-[10px] text-slate-400 mt-1.5 leading-relaxed">
                *ใช้รหัสผ่านด่วน 4 ตัวนี้ บำรุงรักษาการป้อนยารวมหรือกรณีเด็กเล็กเปิดหวงหักถอน
              </span>
            </div>
          </div>

        </div>

        {/* Save and update Trigger */}
        <div className="flex justify-end p-2">
          <button
            type="submit"
            id="profile-save-button"
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 text-xs flex items-center gap-2 cursor-pointer transition-all"
          >
            <Save className="w-4.5 h-4.5" />
            <span>อัปเดตและบันทึกประวัติทั้งหมด</span>
          </button>
        </div>

      </form>

    </div>
  );
}
