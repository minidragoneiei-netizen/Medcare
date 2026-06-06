/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Medication, MedicationLog, UserProfile } from '../types';
import { Clock, Check, AlertCircle, Heart, CheckCircle2, ChevronRight, Tablet, Activity, AlertTriangle } from 'lucide-react';

interface HomeScreenProps {
  medications: Medication[];
  logs: MedicationLog[];
  profile: UserProfile;
  onTakeMedication: (medId: string, logId: string) => void;
  onTriggerDispenseAnimation: (meds: Medication[]) => void;
}

export default function HomeScreen({
  medications,
  logs,
  profile,
  onTakeMedication,
  onTriggerDispenseAnimation
}: HomeScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Keep ticking time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time beautifully in Thai style
  const formattedTime = currentTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDay = currentTime.toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Filter logs for today
  const todayStr = "2026-06-06"; // Synchronized with our fixed simulated date
  const todayLogs = logs.filter(log => log.date === todayStr);

  // Group medications and logs to see status
  const todayList = medications.flatMap(med => {
    return med.times.map(time => {
      // Find matching log
      const associatedLog = todayLogs.find(log => log.medicationId === med.id && log.scheduledTime === time);
      return {
        med,
        time,
        log: associatedLog,
        status: associatedLog ? associatedLog.status : 'pending' as const,
        takenTime: associatedLog ? associatedLog.takenTime : null
      };
    });
  }).sort((a, b) => a.time.localeCompare(b.time));

  // Find next medication due
  // For a reliable demo, let's look for the first 'pending' medication
  const nextMedGroup = todayList.find(item => item.status === 'pending');
  // If all are finished, then next might be tomorrow or next time, let's default nicely
  const nextTime = nextMedGroup ? nextMedGroup.time : "08:00 (วันพรุ่งนี้)";
  const nextMeds = nextMedGroup 
    ? todayList.filter(item => item.time === nextMedGroup.time && item.status === 'pending')
    : [];

  // Statistics
  const totalToday = todayList.length;
  const takenCount = todayList.filter(item => item.status === 'taken').length;
  const missedCount = todayList.filter(item => item.status === 'missed').length;
  const pendingCount = todayList.filter(item => item.status === 'pending').length;

  const progressPercent = totalToday > 0 ? Math.round((takenCount / totalToday) * 100) : 100;

  // Handle click to dispense medications currently due
  const handleDispenseClick = () => {
    if (nextMeds.length > 0) {
      // Collect medication objects
      const medsToDispense = nextMeds.map(item => item.med);
      onTriggerDispenseAnimation(medsToDispense);
    } else {
      // If none are pending, let the user select any to simulate dispensing!
      // This is a great interactive helper.
      const allActive = medications.filter(m => m.active);
      onTriggerDispenseAnimation(allActive.slice(0, 2));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Time & Quick Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Time Widget */}
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 pointer-events-none">
            <Clock className="w-48 h-48" />
          </div>
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-indigo-100 font-mono">สถานะเชื่อมต่อกล่องป้อนยาเสร็จสิ้น</p>
              <h2 className="text-sm font-semibold text-white/90 mt-1">{formattedDay}</h2>
            </div>
            <div className="bg-white/15 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-sm flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>เครื่องทำงานปกติ</span>
            </div>
          </div>
          <div className="mt-4 z-10">
            <span className="text-4xl md:text-5xl font-mono font-bold tracking-tight">{formattedTime}</span>
            <span className="text-xs text-indigo-100 ml-2 font-semibold">น. (ICT)</span>
          </div>
        </div>

        {/* Action / Next Dose Panel */}
        <div id="next-dose-summary" className="bg-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between border border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>เวลารับประทานยาถัดไป</span>
            </div>
            <p className="text-3xl font-mono font-bold text-amber-300">{nextTime}</p>
            {nextMeds.length > 0 ? (
              <p className="text-xs text-slate-300 mt-2 font-medium">
                ยาที่ต้องรับประทาน ({nextMeds.length} รายการ): <br/>
                <span className="text-white italic font-semibold">{nextMeds.map(m => m.med.name).join(', ')}</span>
              </p>
            ) : (
              <p className="text-xs text-emerald-400 mt-2 font-medium">🎉 ยอดเยี่ยม! ทานยาของวันนี้ครบถ้วนแล้ว</p>
            )}
          </div>

          <button
            onClick={handleDispenseClick}
            id="home-confirm-dispense-button"
            className={`w-full font-bold text-xs py-3 rounded-xl transition duration-300 uppercase tracking-wider mt-4 flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
              nextMeds.length > 0 
                ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-amber-400/10' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10'
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span>{nextMeds.length > 0 ? 'สั่งเครื่องจ่ายยา ณ ตอนนี้' : 'สั่งทำความสะอาดตู้ / จ่ายยาทดสอบ'}</span>
          </button>
        </div>

      </div>

      {/* Today's Stats & Big Circular Indicator */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-6 items-center">
        
        {/* Progress Circle Visualizer (Custom beautiful SVG) */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              {/* Back track */}
              <circle
                cx="56"
                cy="56"
                r="45"
                className="stroke-slate-100 fill-none"
                strokeWidth="8"
              />
              {/* Dash circle */}
              <circle
                cx="56"
                cy="56"
                r="45"
                className="stroke-emerald-500 fill-none transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={2 * Math.PI * 45 * (1 - progressPercent / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center flex flex-col items-center">
              <span className="text-2xl font-mono font-black text-slate-900">{progressPercent}%</span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider">สำเร็จวันนี้</span>
            </div>
          </div>
        </div>

        {/* Text Statistics block */}
        <div className="sm:col-span-3 grid grid-cols-3 gap-4 border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6">
          <div className="bg-emerald-50/50 p-3.5 rounded-xl text-center border border-emerald-50">
            <p className="text-xs text-slate-400 font-semibold">ทานยาแล้ว</p>
            <p className="text-2xl font-mono font-bold text-emerald-600 mt-1">{takenCount} <span className="text-xs text-slate-400 font-normal">ครั้ง</span></p>
          </div>
          
          <div className="bg-amber-50/50 p-3.5 rounded-xl text-center border border-amber-50">
            <p className="text-xs text-slate-400 font-semibold">รอรับประทาน</p>
            <p className="text-2xl font-mono font-bold text-amber-600 mt-1">{pendingCount} <span className="text-xs text-slate-400 font-normal">ครั้ง</span></p>
          </div>

          <div className="bg-rose-50/50 p-3.5 rounded-xl text-center border border-rose-50">
            <p className="text-xs text-slate-400 font-semibold">ลืมทานยา</p>
            <p className="text-2xl font-mono font-bold text-rose-600 mt-1">{missedCount} <span className="text-xs text-slate-400 font-normal">ครั้ง</span></p>
          </div>
        </div>

      </div>

      {/* Today's Checklist Schedule */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1 px-2.5 bg-indigo-500 text-white rounded-lg text-xs font-mono font-black">7</div>
            <h3 className="font-bold text-slate-800">ตารางจ่ายยาประจำวันนี้ (Today&apos;s Checklist)</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">วันที่ 6 มิถุนายน 2026 (ซิมูเลชัน)</span>
        </div>

        <div className="divide-y divide-slate-100">
          {todayList.map((item, idx) => {
            const isTaken = item.status === 'taken';
            const isMissed = item.status === 'missed';
            const isPending = item.status === 'pending';
            const isSnoozed = item.status === 'snoozed';

            return (
              <div 
                key={`${item.med.id}-${item.time}-${idx}`} 
                id={`med-item-${item.med.id}-${item.time}`} 
                className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between transition-colors gap-4 ${
                  isTaken ? 'bg-emerald-50/10' : isMissed ? 'bg-rose-50/5' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Time Badge & Visual Status */}
                  <div className={`w-16 py-2 rounded-xl text-center text-xs font-mono font-bold flex-shrink-0 ${
                    isTaken 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : isMissed 
                      ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                      : isSnoozed
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                  }`}>
                    {item.time}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{item.med.name}</h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-500 font-medium">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                        ขนาด: {item.med.dosage}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-semibold ${
                        item.med.relationToMeal === 'before' 
                          ? 'bg-blue-50 text-blue-700' 
                          : item.med.relationToMeal === 'after'
                          ? 'bg-orange-50 text-orange-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {item.med.relationToMeal === 'before' ? 'ก่อนอาหารเช้า/เย็น 30 นาที' : item.med.relationToMeal === 'after' ? 'หลังอาหารทันที' : 'พร้อมอาหาร'}
                      </span>
                    </div>
                    {item.med.notes && (
                      <p className="text-xs text-slate-400 mt-1 italic font-medium">
                        ℹ หมายเหตุพิเศษ: {item.med.notes}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-3 justify-end">
                  {isTaken && (
                    <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>ทานแล้วเมื่อ {item.takenTime} น.</span>
                    </div>
                  )}

                  {isMissed && (
                    <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-3 py-1.5 rounded-full text-xs font-bold border border-rose-100">
                      <AlertCircle className="w-4 h-4" />
                      <span>ลืมทานยา (เกินเวลาจ่าย)</span>
                    </div>
                  )}

                  {isSnoozed && (
                    <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-100">
                      <AlertCircle className="w-4 h-4 animate-bounce" />
                      <span>เลื่อนรับยา (กด Snooze)</span>
                    </div>
                  )}

                  {isPending && (
                    <button
                      onClick={() => item.log && onTakeMedication(item.med.id, item.log.id)}
                      id={`btn-take-${item.med.id}-${item.time}`}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>ยืนยันรับยาแล้ว</span>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Safety Message */}
      <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 flex items-start gap-3">
        <Activity className="w-5 h-5 text-sky-500 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-sky-800 leading-relaxed">
          <p className="font-bold">ข้อมูลความรู้เพื่อครอบครัวอุ่นใจ:</p>
          <p className="mt-0.5">
            เครื่องจ่ายป้อนยา MedCare จะตัดเข้าระบบเซฟตี้ล็อก (Safety Lock) หากผู้สูงอายุไม่ออกจากช่องรับยาภายใน 30 นาที 
            และจะแจ้งส่งสลิปเตือนไปยังแอปพลิเคชันผู้ดูแลทันทีโดยอัตโนมัติ เพื่อป้องกันสัตว์เลี้ยงหรือเด็กเล็กหยิบไปรับประทาน
          </p>
        </div>
      </div>

    </div>
  );
}
