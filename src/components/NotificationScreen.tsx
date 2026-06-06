/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Medication, UserProfile } from '../types';
import { Bell, Heart, Check, Clock, Volume2, ShieldAlert, AlertCircle, Phone } from 'lucide-react';

interface NotificationScreenProps {
  activeNotificationMeds: Medication[];
  profile: UserProfile;
  onConfirmTakeAll: () => void;
  onSnoozeAll: () => void;
}

export default function NotificationScreen({
  activeNotificationMeds,
  profile,
  onConfirmTakeAll,
  onSnoozeAll
}: NotificationScreenProps) {
  const [snoozeCount, setSnoozeCount] = useState(0);

  if (activeNotificationMeds.length === 0) {
    return (
      <div id="no-notifications" className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100 max-w-lg mx-auto mt-6">
        <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
          <Bell className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">ไม่มีการแจ้งเตือนค้างอยู่</h3>
        <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
          ปัจจุบันตู้ป้อนยาไม่มีรอบยาที่ต้องจ่ายในนาทีนี้ ตู้ของคุณยังปลอดภัยและทำงานอย่างถูกต้อง
        </p>
        <div className="mt-6 border-t border-slate-50 pt-6">
          <p className="text-xs text-indigo-500 font-semibold bg-indigo-50 px-3 py-1.5 rounded-full inline-block">
            💡 คุณสามารถคลิกปุ่ม &quot;สุ่มจำลองเหตุการณ์ระฆังยา&quot; จากแถบด้านข้างได้ตลอดเวลา
          </p>
        </div>
      </div>
    );
  }

  const handleSnooze = () => {
    setSnoozeCount(prev => prev + 1);
    onSnoozeAll();
  };

  return (
    <div id="active-alarm-panel" className="max-w-xl mx-auto bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400 relative mt-4 animate-bounce-slow">
      {/* Soundwaves and status indicator effect */}
      <div className="absolute top-0 right-0 left-0 bg-amber-400 text-slate-950 py-2.5 px-4 text-center font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
        <span>แจ้งเตือนด่วน: ถึงเวลารับประทานยาแล้ว (Medication Alarm)</span>
      </div>

      <div className="p-8 pt-16 flex flex-col items-center text-center text-white">
        
        {/* Animated pulse ring */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-amber-400/25 rounded-full animate-ping scale-150 opacity-75" />
          <div className="absolute inset-0 bg-amber-400/10 rounded-full animate-ping scale-200 opacity-50" />
          <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center text-slate-950 shadow-lg relative z-10">
            <Bell className="w-12 h-12 stroke-[2.5] animate-wiggle" />
          </div>
        </div>

        {/* Audio Sound Trigger Simulator */}
        <div className="flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 text-xs font-mono mb-4 text-amber-300">
          <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>เสียงเตือนที่เปิด: {profile.alertSound === 'gentle' ? 'ระฆังพรมละมุน' : 'ไซเรนดนตรี'}</span>
        </div>

        <h3 className="text-2xl font-black text-white mt-2 leading-snug">
          กรุณารับยาที่ช่องจ่ายของตู้ MedCare!
        </h3>
        <p className="text-slate-400 text-xs mt-1 max-w-sm">
          ระบบเทคเลเซอร์ทำการเปิดช่องจ่ายยาหมายเลขซีสเต็มแล้ว กรุณาตรวจสอบยาที่รับดังนี้:
        </p>

        {/* Medication List Details for Grandma */}
        <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 p-4 my-6 text-left space-y-4">
          {activeNotificationMeds.map(med => (
            <div key={med.id} className="flex justify-between items-start border-b border-slate-800/60 pb-3 last:border-0 last:pb-0">
              <div>
                <span className="inline-block bg-amber-400/15 text-amber-400 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-400/20 mb-1">
                  ช่องจ่ายอัตโนมัติ
                </span>
                <h4 className="font-bold text-white text-base leading-snug">{med.name}</h4>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>ประเภทกระเพาะ: {med.relationToMeal === 'before' ? 'ก่อนอาหารเช้า/เย็น 30 นาที' : 'หลังอาหารทันที'}</span>
                </p>
                {med.notes && (
                  <p className="text-xs text-amber-300/90 italic font-medium mt-1">
                    ⚠ คำเตือนสำคัญ: {med.notes}
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <span className="text-xs text-slate-400 block font-semibold">จำนวน:</span>
                <span className="text-xl font-bold font-mono text-amber-400">{med.dosage}</span>
              </div>
            </div>
          ))}
        </div>

        {/* HUGE touch responsive buttons for seniors */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          
          <button
            onClick={handleSnooze}
            id="alarm-snooze-button"
            className="bg-slate-900 border-2 border-slate-800 hover:bg-slate-800 text-slate-300 font-bold py-4 rounded-2xl transition duration-300 cursor-pointer text-sm flex items-center justify-center gap-2 order-2 sm:order-1"
          >
            <Clock className="w-4.5 h-4.5 text-amber-400" />
            <span>เลื่อนการแจ้งเตือน (อีก 10 นาที)</span>
          </button>

          <button
            onClick={onConfirmTakeAll}
            id="alarm-taken-button"
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] text-slate-950 font-black py-4 rounded-2xl transition duration-300 shadow-xl shadow-emerald-500/10 text-sm flex items-center justify-center gap-2 order-1 sm:order-2 cursor-pointer"
          >
            <Check className="w-6 h-6 stroke-[3]" />
            <span>รับประทานยาเรียบร้อยแล้ว</span>
          </button>
          
        </div>

        {/* Emergency contact speeddial block */}
        <div className="w-full border-t border-slate-900 mt-6 pt-5 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2 text-rose-400 font-semibold bg-rose-500/10 px-3 py-2 rounded-xl border border-rose-500/20">
            <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>หากรู้สึกผิดปกติ โทรแจ้งทันที:</span>
          </div>
          <a
            href={`tel:${profile.emergencyContact.phone}`}
            id="emergency-quick-call"
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl transition duration-300 flex items-center gap-1.5"
          >
            <Phone className="w-4 h-4 fill-white" />
            <span>โทรหาผู้ดูแล ({profile.emergencyContact.name})</span>
          </a>
        </div>

      </div>
    </div>
  );
}
