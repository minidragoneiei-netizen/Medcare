/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  UserProfile, 
  Medication, 
  MedicationLog, 
  DispenserHardwareState,
  INITIAL_PROFILE, 
  INITIAL_MEDICATIONS, 
  INITIAL_LOGS, 
  INITIAL_DISPENSER 
} from './types';

// Importing Custom Views
import StageOverview from './components/StageOverview';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import ManageMedication from './components/ManageMedication';
import NotificationScreen from './components/NotificationScreen';
import ReportScreen from './components/ReportScreen';
import CaregiverScreen from './components/CaregiverScreen';
import ProfileScreen from './components/ProfileScreen';

// Lucide Icons
import { 
  Heart, 
  UserCheck, 
  Settings, 
  Layers, 
  Bell, 
  Activity, 
  ChevronRight, 
  RefreshCw, 
  AlertTriangle,
  Tablet,
  Smartphone,
  Check,
  X,
  Sparkles,
  Smile,
  PhoneCall
} from 'lucide-react';

export default function App() {
  // Global states
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [logs, setLogs] = useState<MedicationLog[]>(INITIAL_LOGS);
  const [hardware, setHardware] = useState<DispenserHardwareState>(INITIAL_DISPENSER);
  
  // Navigation & Role states
  const [activeTab, setActiveTab] = useState<string>('home'); // active page
  const [currentRole, setCurrentRole] = useState<UserRole>('visitor'); // current user role
  const [isLogged, setIsLogged] = useState<boolean>(true); // start logged in for a friendly demo

  // Alarm & Simulators States
  const [activeNotificationMeds, setActiveNotificationMeds] = useState<Medication[]>([]);
  const [voiceMessagesSent, setVoiceMessagesSent] = useState<string[]>([]);
  const [hasUnreadAlert, setHasUnreadAlert] = useState(false);
  
  // Modal states for animations
  const [showDispenseModal, setShowDispenseModal] = useState(false);
  const [dispensingMeds, setDispensingMeds] = useState<Medication[]>([]);
  const [showCallModal, setShowCallModal] = useState(false);

  // Trigger system warning if Metformin was missed
  useEffect(() => {
    // Look for missed medications in logs to toggle caregiver alarm badge
    const hasMissed = logs.some(l => l.date === "2026-06-06" && l.status === "missed");
    setHasUnreadAlert(hasMissed);
  }, [logs]);

  // Auth logins handler
  const handleLogin = (selectedRole: UserRole, userProfile: UserProfile) => {
    setCurrentRole(selectedRole);
    setProfile(userProfile);
    setIsLogged(true);
    // Redirect role neatly
    if (selectedRole === 'elderly') {
      setActiveTab('home');
    } else {
      setActiveTab('caregiver');
    }
  };

  const handleLogout = () => {
    setIsLogged(false);
    setActiveTab('login');
    setCurrentRole('visitor');
  };

  // Medication interactions
  const handleAddMedication = (newMed: Omit<Medication, 'id'>) => {
    const medWithId: Medication = {
      ...newMed,
      id: `med-${Date.now()}`
    };
    setMedications([...medications, medWithId]);

    // Add automatic logs for today for testing
    const todayStr = "2026-06-06";
    const newLogs: MedicationLog[] = medWithId.times.map((time, idx) => ({
      id: `log-new-${Date.now()}-${idx}`,
      medicationId: medWithId.id,
      medicationName: medWithId.name,
      dosage: medWithId.dosage,
      scheduledTime: time,
      date: todayStr,
      takenTime: null,
      status: 'pending'
    }));
    setLogs(prev => [...prev, ...newLogs]);
  };

  const handleDeleteMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
    setLogs(logs.filter(l => l.medicationId !== id));
  };

  const handleEditMedication = (editedMed: Medication) => {
    setMedications(medications.map(m => m.id === editedMed.id ? editedMed : m));
    // Update logs name
    setLogs(logs.map(l => l.medicationId === editedMed.id ? { 
      ...l, 
      medicationName: editedMed.name,
      dosage: editedMed.dosage
    } : l));
  };

  // Patient manually confirms pills taken from Home Screen or Notification Screen
  const handleTakeMedication = (medId: string, logId: string) => {
    const nowHours = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }).replace(':', ':');
    
    // Update consumption logs
    setLogs(prevLogs => prevLogs.map(log => 
      log.id === logId 
        ? { ...log, status: 'taken', takenTime: nowHours } 
        : log
    ));

    // Descale dispenser count
    setMedications(prevMeds => prevMeds.map(med => 
      med.id === medId 
        ? { ...med, remainingCount: Math.max(0, med.remainingCount - 1) } 
        : med
    ));

    // Descale corresponding telemetry inventory compartment
    setHardware(prevHw => ({
      ...prevHw,
      compartments: prevHw.compartments.map(comp => {
        // Find match
        const med = medications.find(m => m.id === medId);
        if (med && comp.medName.startsWith(med.name.substring(0, 10))) {
          return { ...comp, count: Math.max(0, comp.count - 1) };
        }
        return comp;
      })
    }));
  };

  // Sound and mechanical cylinder dispenser trigger!
  const triggerDispensationProgress = (meds: Medication[]) => {
    setDispensingMeds(meds);
    setShowDispenseModal(true);
    
    // Simulate mechanical delay turn timer before confirming delivery
    setTimeout(() => {
      // Complete physical dispense trigger on device logs
      const timeStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
      const names = meds.map(m => m.name).join(', ');
      
      setHardware(prevHw => ({
        ...prevHw,
        dispenseLogs: [
          { time: `2026-06-06 ${timeStr}`, medName: names, status: 'success' },
          ...prevHw.dispenseLogs
        ]
      }));
    }, 1500);
  };

  // Close the dispenser popup tray and prompt user standard success
  const handleMedsTakenFromDispenser = () => {
    setShowDispenseModal(false);
    
    // If we dispensed due to an active alarm, clear the active notification alarm!
    if (activeNotificationMeds.length > 0) {
      // Find matching today logs and mark all is 'taken'
      activeNotificationMeds.forEach(med => {
        const todayStr = "2026-06-06";
        const pendingLog = logs.find(l => l.medicationId === med.id && l.date === todayStr && l.status === 'pending');
        if (pendingLog) {
          handleTakeMedication(med.id, pendingLog.id);
        }
      });
      setActiveNotificationMeds([]);
    } else {
      // Just demo mode trigger, let's mark first pending med today as taken
      const todayStr = "2026-06-06";
      const pendingLog = logs.find(l => l.date === todayStr && l.status === 'pending');
      if (pendingLog) {
        handleTakeMedication(pendingLog.medicationId, pendingLog.id);
      }
    }
  };

  // Simulate an Alarm / Bell rings event at specific timing (Pushed by simulator)
  const handleSimulateAlarmTrigger = () => {
    // Load some medications that Grandma should takeเช้า (e.g., Metformin, Amlodipine)
    const activeMeds = medications.filter(m => m.active).slice(0, 2);
    setActiveNotificationMeds(activeMeds);
    setActiveTab('notifications'); // Route to notifications instantly
  };

  // Simulate missed medications - pushes a notification alert that caregiver will see
  const handleSimulateMissedPills = () => {
    const todayStr = "2026-06-06";
    // Change Metformin 18:00 log to missed
    setLogs(prevLogs => prevLogs.map(l => 
      l.date === todayStr && l.scheduledTime === "18:00" 
        ? { ...l, status: 'missed', takenTime: null } 
        : l
    ));
    setHasUnreadAlert(true);
    setActiveTab('caregiver'); // Jump to caregiver so they see the red alert log immediately
  };

  // Refill All Medication Stocks
  const handleRefillAllMeds = () => {
    setMedications(prev => prev.map(m => ({ ...m, remainingCount: m.maxStorage })));
    setHardware(prevHw => ({
      ...prevHw,
      compartments: prevHw.compartments.map(comp => ({ ...comp, count: comp.maxCount }))
    }));
    alert("🟢 ทำการเติมกระปุกยาในเครื่องตู้จนครบถ้วน 100% แล้ว! ตัวแสดงระดับสีเขียวพร้อมทำงาน");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
      
      {/* Upper header section */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            {/* Title / Brand logo mark */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-indigo-600/20 active:rotate-12 transition-all">
                <Heart className="w-5 h-5 fill-white text-indigo-600 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-900 font-display flex items-center gap-1">
                  <span>MedCare</span>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Smart IoT</span>
                </h1>
              </div>
            </div>

            {/* Quick Mode Toggle for Testing Elderly / Caregiver / Visitor views easily */}
            <div className="hidden lg:flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs">
              <span className="text-slate-500 font-bold px-2">โหมดผู้รับชม:</span>
              <button
                onClick={() => setCurrentRole('elderly')}
                className={`py-1.5 px-3 rounded-xl transition-all font-bold flex items-center gap-1 cursor-pointer ${
                  currentRole === 'elderly' 
                    ? 'bg-amber-400 text-slate-950 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>มุมมองอาม่า (ผู้สูงอายุ)</span>
              </button>
              <button
                onClick={() => setCurrentRole('caregiver')}
                className={`py-1.5 px-3 rounded-xl transition-all font-bold flex items-center gap-1 cursor-pointer ${
                  currentRole === 'caregiver'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>มุมมองผู้ดูแล (Vichai)</span>
              </button>
              <button
                onClick={() => setCurrentRole('visitor')}
                className={`py-1.5 px-3 rounded-xl transition-all font-bold flex items-center gap-1 cursor-pointer ${
                  currentRole === 'visitor'
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>สาธิตรวมใจ (Full Access)</span>
              </button>
            </div>

            {/* Power logs info / Logout */}
            <div className="flex items-center gap-3">
              {isLogged ? (
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-800 leading-none">{profile.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5 uppercase">
                      บทบาท: {currentRole === 'elderly' ? 'อาม่า' : currentRole === 'caregiver' ? 'ผู้ดูแล' : 'ผู้เชี่ยวชาญร่วมวง'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1 px-2.5 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 rounded-xl text-xs font-bold font-mono transition-colors cursor-pointer border border-rose-100"
                  >
                    ออกระบบ
                  </button>
                </div>
              ) : (
                <span className="text-xs text-slate-400 font-bold font-mono">LOCKOUT STATE</span>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Main Container Layout: Left is app navigation & Pages, Right is IoT Hardware mockup panel */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Dynamic Concept showcase is always toggleable at the high header */}
        <StageOverview />

        {/* Outer wrapper: Grid separating App screen from physical simulator box */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          
          {/* Main Content App Screen Area (Col-span 3) */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* 1 To 7 Thai specification Tabs Panel navigation */}
            {isLogged && (
              <div className="bg-white rounded-2xl p-2 shadow-xs border border-slate-100 overflow-x-auto flex items-center gap-1 scrollbar-none">
                
                {/* PAGE 1: Login Tab */}
                <button
                  type="button"
                  id="tab-page-1"
                  onClick={() => setIsLogged(false)}
                  className="py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1 text-slate-500 hover:bg-slate-50 hover:text-slate-900 border-none bg-transparent cursor-pointer flex-shrink-0"
                >
                  <span className="w-5 h-5 bg-slate-100 text-slate-700 rounded-lg flex items-center justify-center font-bold font-mono text-[10px]">1</span>
                  <span>หน้า 1: เข้าสู่ระบบ</span>
                </button>

                <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />

                {/* PAGE 2: Home */}
                <button
                  type="button"
                  id="tab-page-2"
                  onClick={() => setActiveTab('home')}
                  className={`py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all text-left border-none cursor-pointer flex-shrink-0 ${
                    activeTab === 'home' 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold font-mono text-[10px] ${
                    activeTab === 'home' ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>2</span>
                  <span>หน้า 2: หน้าหลัก (Home)</span>
                </button>

                <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />

                {/* PAGE 3: Manage Meds */}
                <button
                  type="button"
                  id="tab-page-3"
                  onClick={() => setActiveTab('manage')}
                  className={`py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all text-left border-none cursor-pointer flex-shrink-0 ${
                    activeTab === 'manage' 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold font-mono text-[10px] ${
                    activeTab === 'manage' ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>3</span>
                  <span>หน้า 3: จัดการยา</span>
                </button>

                <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />

                {/* PAGE 4: Notifications (Rings) */}
                <button
                  type="button"
                  id="tab-page-4"
                  onClick={() => setActiveTab('notifications')}
                  className={`py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all text-left border-none cursor-pointer flex-shrink-0 relative ${
                    activeTab === 'notifications' 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold font-mono text-[10px] ${
                    activeTab === 'notifications' ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>4</span>
                  <span>หน้า 4: แจ้งเตือน</span>
                  
                  {activeNotificationMeds.length > 0 && (
                    <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                </button>

                <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />

                {/* PAGE 5: Reports */}
                <button
                  type="button"
                  id="tab-page-5"
                  onClick={() => setActiveTab('reports')}
                  className={`py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all text-left border-none cursor-pointer flex-shrink-0 ${
                    activeTab === 'reports' 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15' 
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold font-mono text-[10px] ${
                    activeTab === 'reports' ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>5</span>
                  <span>หน้า 5: รายงานผล</span>
                </button>

                <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />

                {/* PAGE 6: Caregiver monitor */}
                <button
                  type="button"
                  id="tab-page-6"
                  onClick={() => setActiveTab('caregiver')}
                  className={`py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all text-left border-none cursor-pointer flex-shrink-0 relative ${
                    activeTab === 'caregiver'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold font-mono text-[10px] ${
                    activeTab === 'caregiver' ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>6</span>
                  <span>หน้า 6: ผู้ดูแล (Caregiver)</span>

                  {hasUnreadAlert && (
                    <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-red-600" />
                  )}
                </button>

                <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />

                {/* PAGE 7: Patient Profile */}
                <button
                  type="button"
                  id="tab-page-7"
                  onClick={() => setActiveTab('profile')}
                  className={`py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all text-left border-none cursor-pointer flex-shrink-0 ${
                    activeTab === 'profile'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold font-mono text-[10px] ${
                    activeTab === 'profile' ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>7</span>
                  <span>หน้า 7: โปรไฟล์</span>
                </button>

              </div>
            )}

            {/* Screen Router Container */}
            <div className="transition-all duration-300">
              {!isLogged ? (
                <LoginScreen 
                  profile={profile} 
                  onLogin={handleLogin} 
                />
              ) : (
                <>
                  {activeTab === 'home' && (
                    <HomeScreen 
                      medications={medications}
                      logs={logs}
                      profile={profile}
                      onTakeMedication={handleTakeMedication}
                      onTriggerDispenseAnimation={triggerDispensationProgress}
                    />
                  )}

                  {activeTab === 'manage' && (
                    <ManageMedication
                      medications={medications}
                      onAddMedication={handleAddMedication}
                      onDeleteMedication={handleDeleteMedication}
                      onEditMedication={handleEditMedication}
                    />
                  )}

                  {activeTab === 'notifications' && (
                    <NotificationScreen
                      activeNotificationMeds={activeNotificationMeds}
                      profile={profile}
                      onConfirmTakeAll={handleMedsTakenFromDispenser}
                      onSnoozeAll={() => {
                        alert("💤 ความปลอดภัย: ทำการเลื่อนสลัดกล่องยาตู้ออกไปอีก 10 นาที (Snoozed successfully)");
                        setActiveNotificationMeds([]);
                        setActiveTab('home');
                      }}
                    />
                  )}

                  {activeTab === 'reports' && (
                    <ReportScreen 
                      logs={logs} 
                      medications={medications} 
                    />
                  )}

                  {activeTab === 'caregiver' && (
                    <CaregiverScreen
                      hardware={hardware}
                      profile={profile}
                      medications={medications}
                      logs={logs}
                      onTriggerSimulatedCall={() => setShowCallModal(true)}
                      onSendVoiceMessage={(msg) => {
                        setVoiceMessagesSent(prev => [msg, ...prev]);
                        alert(`🎙 คลื่นเสียงส่งสัญญาณสำเร็จ: หน้าตู้ยาขานลำโพงวิทยาลัย " ${msg} "`);
                      }}
                    />
                  )}

                  {activeTab === 'profile' && (
                    <ProfileScreen
                      profile={profile}
                      onUpdateProfile={(updated) => {
                        setProfile(updated);
                        // Sync with caregiver elements
                        setHardware(prev => ({
                          ...prev,
                          deviceId: updated.deviceConnectedId
                        }));
                      }}
                    />
                  )}
                </>
              )}
            </div>

          </div>

          {/* Right Side: Interactive IoT Hardware Simulator (Col-span 1) */}
          <div className="xl:col-span-1 space-y-6">
            
            {/* IoT Device Visual Simulator Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-5 border-4 border-indigo-700 shadow-xl relative overflow-hidden">
              
              <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-32 h-32 bg-indigo-500/10 rounded-full" />

              <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-xs uppercase text-slate-300 font-bold tracking-wider">
                    แบบจำลองตู้ยา (IoT Hardware)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-indigo-400 font-black">
                  MC-9082-AUT
                </span>
              </div>

              {/* Physical LCD mock screen showing what grandma sees */}
              <div className="bg-emerald-950/90 border border-emerald-500/30 rounded-xl p-3.5 font-mono text-emerald-400 shadow-inner relative">
                <div className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                <span className="text-[9px] text-emerald-500 block uppercase font-bold text-center border-b border-emerald-500/20 pb-1 mb-1.5">
                  LCD Control Panel v1.0
                </span>
                
                {activeNotificationMeds.length > 0 ? (
                  <div className="text-center py-1">
                    <p className="text-xs font-black animate-pulse text-amber-300">⚠️ ALARM RINGS!</p>
                    <p className="text-[10px] text-emerald-300 mt-1">ถึงเวลาทานยาเช้า</p>
                    <p className="text-[11.5px] font-bold text-white uppercase bg-emerald-800/50 mt-1 px-1 py-0.5 rounded">
                      👉 ดึงรับแก้วยาเลย!
                    </p>
                  </div>
                ) : (
                  <div className="text-xs space-y-1">
                    <p className="text-[11px] text-emerald-300 font-semibold text-center">⏳ เครื่องทำงานตามตาราง</p>
                    <p className="text-[9px] text-emerald-500">รอบถัดไป: <span className="text-white font-bold font-mono">08:00น. (พรุ่งนี้)</span></p>
                    <p className="text-[9px] text-emerald-500">สถานะแบต: <span className="text-white font-mono">94%</span></p>
                  </div>
                )}
              </div>

              {/* Physical cylindrical container mockup visual */}
              <div className="my-5 p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <p className="text-[10px] text-slate-500 font-bold uppercase text-center tracking-wider">ช่องสล็อตจ่ายยาแยกขวด</p>
                <div className="grid grid-cols-4 gap-2">
                  
                  {medications.slice(0, 4).map((med, idx) => {
                    const characters = ['A', 'B', 'C', 'D'];
                    const count = med.remainingCount;
                    const cPercent = Math.min(100, Math.round((count / med.maxStorage) * 100));

                    return (
                      <div key={med.id} className="text-center">
                        <div className="h-14 bg-slate-900 border border-slate-800 rounded-lg relative overflow-hidden flex flex-col justify-end p-1">
                          <div 
                            className={`w-full rounded-b-md transition-all duration-300 ${
                              count < 5 ? 'bg-rose-500/80 animate-pulse' : 'bg-indigo-600/80'
                            }`}
                            style={{ height: `${cPercent}%` }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center font-mono text-sm font-black text-white/50 z-10">
                            {characters[idx]}
                          </span>
                        </div>
                        <span className="block text-[9px] font-mono font-bold text-slate-400 mt-1">
                          {med.name.substring(0, 4)}..
                        </span>
                        <span className={`block text-[10px] font-mono font-bold ${count < 5 ? 'text-rose-400': 'text-slate-300'}`}>
                          ({count})
                        </span>
                      </div>
                    );
                  })}
                  
                </div>
              </div>

              {/* Physical Dispenser Mug Out slot trigger */}
              <div className="border border-dashed border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center text-center bg-slate-950/40">
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider">ถาดดึงรับยาอเนกประสงค์</span>
                <div className="w-14 h-14 bg-slate-900 border-2 border-slate-800 hover:border-indigo-500 rounded-full flex items-center justify-center mt-2 group cursor-pointer transition-all">
                  <Tablet className="w-6 h-6 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </div>
                <span className="text-[10px] text-indigo-400 font-semibold mt-1.5 flex items-center gap-1">
                  <span>ช่องจ่ายปิดสนิท</span>
                </span>
              </div>

              {/* Interactive simulated scenarios console (EXISTS JUST FOR DEMO EVALUATING ALL STATES) */}
              <div className="border-t border-slate-800 mt-5 pt-4 space-y-2.5">
                <span className="text-[10.5px] text-amber-400 font-bold uppercase tracking-wide block">
                  🛠 แดชบอร์ดผู้ทดสอบระบบ (Simulator Settings)
                </span>
                
                <p className="text-[10px] text-slate-400 leading-snug">
                  อิมูเลเตอร์จำลองเหตุการณ์เพื่อตรวจสอบเงื่อนไขการทำงานของโปรแกรม 7 หน้า:
                </p>

                <div className="space-y-1.5">
                  <button
                    onClick={handleSimulateAlarmTrigger}
                    className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 text-center font-bold py-2 rounded-xl text-[10.5px] flex items-center justify-center gap-1 cursor-pointer transition-all hover:scale-[1.02]"
                  >
                    <Bell className="w-3.5 h-3.5 animate-bounce" />
                    <span>1. สุ่มเตือน: ถึงเวลากินยา (Page 4)</span>
                  </button>

                  <button
                    onClick={handleSimulateMissedPills}
                    className="w-full bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 hover:text-white border border-rose-500/20 text-center py-2 rounded-xl text-[10.5px] flex items-center justify-center gap-1 cursor-pointer transition-all"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>2. สุ่มเรื่องลืมกิน: แจ้งผู้ดูแล (Page 6)</span>
                  </button>

                  <button
                    onClick={handleRefillAllMeds}
                    className="w-full bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 hover:text-white border border-emerald-500/20 text-center py-2 rounded-xl text-[10.5px] flex items-center justify-center gap-1 cursor-pointer transition-all"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>3. จำลองเติมยาลงช่องเก็บ (Page 3)</span>
                  </button>
                </div>

                {voiceMessagesSent.length > 0 && (
                  <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-[10px] text-indigo-300 mt-2">
                    <span className="font-bold block uppercase tracking-wider text-slate-500">ลำโพงตู้ยาขานข้ามสายด่วน:</span>
                    <span className="italic block font-medium">🗣 &quot;{voiceMessagesSent[0]}&quot;</span>
                  </div>
                )}

              </div>

            </div>

            {/* Simulated Patient Info Overview Badge */}
            <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-sm text-center">
              <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block mb-1">
                คุณสมบัติช่วยเหลือด่วน
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                สายด่วนกู้ชีพอุปโภค (EMS 24hr)
              </p>
              <a 
                href="tel:1669"
                className="text-rose-600 font-extrabold text-lg block font-mono hover:underline mt-0.5"
              >
                1669 / 191
              </a>
            </div>

          </div>

        </div>

      </main>

      {/* DISPENSE ANIMATION LIGHTBOX MODAL */}
      {showDispenseModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border-2 border-indigo-500/40 text-white rounded-3xl p-6 max-w-sm w-full text-center relative overflow-hidden shadow-2xl">
            
            {/* Close button */}
            <button 
              onClick={() => setShowDispenseModal(false)}
              className="absolute top-4 right-4 p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full cursor-pointer text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="bg-indigo-500/10 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/20 uppercase tracking-widest inline-block mb-4">
              IoT Cylinders Triggering
            </span>

            {/* Rotating Dispenser gear visual with animation */}
            <div className="relative w-28 h-28 mx-auto mb-5 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full" />
              <div className="absolute inset-0 border-t-4 border-r-4 border-amber-400 rounded-full animate-spin" />
              <Tablet className="w-12 h-12 text-amber-300 animate-pulse" />
            </div>

            <h3 className="text-xl font-bold">ตู้นิยมกำลังจ่ายยาป้อนของรอบนี้</h3>
            <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
              สลัดเปิดซีลแบ่งปริมาณยาออกจากช่องแอกแกนหลักแล้ว กรุณาดึงถาดเพื่อรับประทานยาพร้อมน้ำสะอาด
            </p>

            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-left my-4 text-xs">
              <span className="block font-bold text-slate-500 mb-1">ยาที่เทใส่ถาดรอบนี้:</span>
              <ul className="list-disc pl-4 space-y-1 text-slate-300">
                {dispensingMeds.map((m, idx) => (
                  <li key={idx} className="font-semibold text-white">
                    {m.name} ({m.dosage})
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleMedsTakenFromDispenser}
              id="dispense-complete-done"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold py-3 rounded-xl text-xs transition duration-300 uppercase tracking-wider cursor-pointer"
            >
              ดึงถาดรับยาแล้ว (Confirm Extraction)
            </button>

          </div>
        </div>
      )}

      {/* EMERGENCY VIDEO CALL LIGHTBOX MODAL */}
      {showCallModal && (
        <div className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl aspect-video rounded-3xl overflow-hidden border-4 border-indigo-500 shadow-2xl flex flex-col justify-between p-6 bg-slate-850">
            
            {/* Visual Call Background simulated as real video feed avatar */}
            <div className="absolute inset-0 pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1544120190-2751b3271578?w=800&auto=format&fit=crop&q=80"
                alt="Patient Video Feed"
                className="w-full h-full object-cover opacity-60 filter grayscale-xs"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950" />
            </div>

            {/* UI Header element for Call */}
            <div className="flex justify-between items-center z-10 text-white">
              <div className="flex items-center gap-2 bg-indigo-600/80 px-4 py-2 rounded-2xl backdrop-blur-md border border-indigo-400/30 text-xs">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="font-bold">Live แฮงเอาท์วิดีโอ (ตู้ยาอัตโนมัติ)</span>
              </div>
              <span className="text-xs text-slate-300 font-mono">เวลาสนทนา: 00:24</span>
            </div>

            {/* Mini PIP webcam preview of Caregiver */}
            <div className="absolute top-20 right-6 w-28 h-36 rounded-2xl overflow-hidden border-2 border-white/20 shadow-md bg-slate-900 hidden sm:block z-10">
              <div className="relative w-full h-full">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  alt="Caregiver Webcam preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 leading-none left-1 bg-black/60 px-1 py-0.5 rounded text-[8px] text-white font-semibold font-mono">You (Vichai)</span>
              </div>
            </div>

            {/* UI Footer action bar */}
            <div className="z-10 text-center text-white mt-auto">
              <h4 className="font-extrabold text-xl font-display">{profile.name} (อาม่า)</h4>
              <p className="text-xs text-slate-300">กำลังฟังคุณผ่านระบบไมค์โครโฟนและลำโพงตู้ยา...</p>

              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => setShowCallModal(false)}
                  className="bg-red-600 hover:bg-red-700 active:scale-95 transition-all p-3 px-6 rounded-full text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <X className="w-4 h-4 fill-white" />
                  <span>วางสายสนทนา (End Call)</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
