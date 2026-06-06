/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DispenserHardwareState, Medication, MedicationLog, UserProfile } from '../types';
import { Wifi, Battery, AlertTriangle, Phone, MessageSquare, ShieldAlert, CheckCircle, RefreshCw, Layers, Bell, Activity } from 'lucide-react';

interface CaregiverScreenProps {
  hardware: DispenserHardwareState;
  profile: UserProfile;
  medications: Medication[];
  logs: MedicationLog[];
  onTriggerSimulatedCall: () => void;
  onSendVoiceMessage: (msg: string) => void;
}

export default function CaregiverScreen({
  hardware,
  profile,
  medications,
  logs,
  onTriggerSimulatedCall,
  onSendVoiceMessage
}: CaregiverScreenProps) {
  const [voiceText, setVoiceText] = useState('อาม่าครับ อย่าลืมกินยาเบาหวานที่เครื่องจ่ายให้แล้วนะ');
  const [deviceSyncing, setDeviceSyncing] = useState(false);

  // Syncing simulation
  const handleSyncDevices = () => {
    setDeviceSyncing(true);
    setTimeout(() => setDeviceSyncing(false), 800);
  };

  const handleVoiceSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voiceText.trim()) return;
    onSendVoiceMessage(voiceText);
    setVoiceText('');
  };

  // Extract recent logs (last few today)
  const todayStr = "2026-06-06";
  const todayLogs = [...logs]
    .filter(l => l.date === todayStr && l.status !== 'pending')
    .sort((a, b) => b.scheduledTime.localeCompare(a.scheduledTime));

  const missedCount = logs.filter(l => l.date === todayStr && l.status === 'missed').length;

  return (
    <div className="space-y-6">
      
      {/* Real-time Hardware Telemetry Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 mb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">แผงควบคุมตู้ยา IoT (MedCare Telemetry Center)</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">เชื่อมต่อผ่าน ID ฮาร์ดแวร์: {profile.deviceConnectedId}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <button
              onClick={handleSyncDevices}
              className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 cursor-pointer font-bold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${deviceSyncing ? 'animate-spin' : ''}`} />
              <span>{deviceSyncing ? 'คำนวณซิงค์...' : 'รีเฟรชตู้'}</span>
            </button>

            <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>ONLINE</span>
            </span>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-medium uppercase block">สัญญาณ 4G Wi-Fi</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Wifi className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-bold font-mono">เยี่ยมยอด (96dBm)</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-medium uppercase block">แบตเตอรี่สำรองตู้</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Battery className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
              <span className="text-sm font-bold font-mono">94% (จ่าย AC ชาร์จ)</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-medium uppercase block">ความจุถาดรองน้ำแก้ว</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Activity className="w-4 h-4 text-sky-400" />
              <span className="text-sm font-bold">เต็มแก้วปกติ (Water OK)</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 font-medium uppercase block">สภาพเครื่องรวม</span>
            <div className="flex items-center gap-1.5 mt-1">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold">ปกติ (No mechanical Jam)</span>
            </div>
          </div>

        </div>

      </div>

      {/* Missed Pills Warnings and Fast Speaker/Text Sync */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left: Contact patient and emergency warnings */}
        <div className="md:col-span-2 space-y-6">
          
          {missedCount > 0 && (
            <div id="caregiver-missed-alert" className="bg-red-50 border-2 border-red-300 rounded-2xl p-5 flex items-start gap-4 animate-pulse">
              <div className="p-3 bg-red-100 rounded-xl text-red-700">
                <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-red-900 text-base">⚠️ มีรายงานผู้สูงอายุลืมรับประทานยาเช้าวันนี้!</h4>
                <p className="text-xs text-red-700 leading-relaxed font-medium">
                  เครื่องจ่ายป้อนยาส่งสัญญาณเสียงบัสเซอร์นาน 15 นาทียังไม่มีการดึงแก้วยาออก 
                  เซฟตี้ล็อกล็อคช่องเรียบร้อยแล้วเพื่อความปลอดภัยสูงสุด กรุณารีบติดต่อด่วน
                </p>
                <div className="pt-2 flex gap-3">
                  <a
                    href={`tel:${profile.emergencyContact.phone}`}
                    className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 fill-white" />
                    <span>โทรทางด่วนหาอาม่า</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Compartment Levels Progress inside Physical box */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-3">
              <h4 className="font-bold text-slate-800">ปริมาณคงเหลือในขวดเก็บตู้ยา (Compartment Slots)</h4>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md">อัปเดตแบบเรียลไทม์</span>
            </div>

            <div className="space-y-4">
              {medications.map(med => {
                const isUnderStock = med.remainingCount < 5;
                const ratio = Math.min(100, Math.round((med.remainingCount / med.maxStorage) * 100));

                return (
                  <div key={med.id} className="space-y-1.5 p-3 rounded-xl border border-slate-50 hover:bg-slate-50/50">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">{med.name}</span>
                      <span className={`font-mono font-bold ${isUnderStock ? 'text-rose-600' : 'text-slate-600'}`}>
                        เหลือ {med.remainingCount} เม็ด / กล่องจุ {med.maxStorage}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isUnderStock ? 'bg-rose-500 animate-pulse' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                    {isUnderStock && (
                      <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">
                        ⚠️ ยารายการนี้ระดับวิกฤต! กรุณานัดวันเติมเม็ดลงช่อง
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's log for caregiver oversight */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-1.5">
              <Bell className="w-4.5 h-4.5 text-indigo-500" />
              <span>ประวัติการดึงและการกินของอาม่าวันนี้</span>
            </h4>

            <div className="space-y-3">
              {todayLogs.map(log => (
                <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">{log.medicationName}</h5>
                    <p className="text-[11px] text-slate-400 font-semibold font-mono mt-0.5">
                      ตามกำหนดเวลา {log.scheduledTime} น. | จ่ายสำเร็จ {log.takenTime ? `${log.takenTime} น.` : 'ผิดเวลา'}
                    </p>
                  </div>
                  <div>
                    {log.status === 'taken' ? (
                      <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-100">
                        ทานครบสำเร็จ
                      </span>
                    ) : (
                      <span className="bg-rose-50 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-full border border-rose-100 animate-pulse">
                        ลืมกิน
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {todayLogs.length === 0 && (
                <p className="text-center text-slate-400 text-xs py-4 font-medium">ไม่มีประวัติการป้อนยาที่ดำเนินการแล้วของวันนี้</p>
              )}
            </div>
          </div>

        </div>

        {/* Right: Speaker message system and quick contact shortcut */}
        <div className="space-y-6">
          
          {/* Quick Contact & Tele-Support */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-2">ติดต่อผู้สูงอายุทันใจ (Remote Contact)</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              หน้าจอเครื่องจ่ายยา MedCare รองรับการต่อแฮงเอาท์/สายสัญญาณวิดีโอล็อคอัตโนมัติ คุณยายไม่ต้องกดรับสาย
            </p>

            <div className="space-y-2">
              <button
                onClick={onTriggerSimulatedCall}
                id="btn-voice-call-home"
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Phone className="w-4 h-4 fill-white" />
                <span>📞 โทรด่วนแฮงเอาท์วิดีโอ (Video Call)</span>
              </button>
            </div>
          </div>

          {/* Send voice announcer reminder text (dispenser speaker synthesis) */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h4 className="font-bold text-slate-800 mb-1.5 flex items-center gap-1">
              <MessageSquare className="w-4.5 h-4.5 text-indigo-500" />
              <span>ส่งเสียงเตือนผ่านลำโพงตู้ยา</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              พิมพ์ข้อความด้านล่าง ระบบจะแปลงเป็นสัญญาณเสียง AI ภาษาไทยสังเคราะห์ประกาศออกลำโพงที่ตัวเครื่องจ่ายทันที
            </p>

            <form onSubmit={handleVoiceSend} className="space-y-3">
              <textarea
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                rows={3}
                id="voice-announcer-text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                placeholder="พิมพ์สิ่งที่ต้องการให้อาม่าได้ยิน..."
              />
              <button
                type="submit"
                id="btn-send-voice-announcer"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl transition duration-300 cursor-pointer"
              >
                🎙 สังเคราะห์ส่งข้อความเสียงไปยังเครื่อง
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
