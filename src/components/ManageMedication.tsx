/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Medication } from '../types';
import { Plus, Trash2, Edit2, Check, AlertTriangle, Pill, Clock, PlusCircle } from 'lucide-react';

interface ManageMedicationProps {
  medications: Medication[];
  onAddMedication: (newMed: Omit<Medication, 'id'>) => void;
  onDeleteMedication: (id: string) => void;
  onEditMedication: (med: Medication) => void;
}

export default function ManageMedication({
  medications,
  onAddMedication,
  onDeleteMedication,
  onEditMedication
}: ManageMedicationProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('1 เม็ด');
  const [mealRelation, setMealRelation] = useState<'before' | 'after' | 'with'>('after');
  const [notes, setNotes] = useState('');
  const [remaining, setRemaining] = useState(15);
  const [maxStorage, setMaxStorage] = useState(30);

  // Time management - standard options to check
  const [checkedTimes, setCheckedTimes] = useState<{ [key: string]: boolean }>({
    "08:00": true,
    "12:00": false,
    "18:00": false,
    "21:00": false
  });
  const [customTime, setCustomTime] = useState('');

  const handleTimeToggle = (time: string) => {
    setCheckedTimes(prev => ({ ...prev, [time]: !prev[time] }));
  };

  const addCustomTime = () => {
    if (/^([01]\d|2[0-3]):[0-5]\d$/.test(customTime)) {
      setCheckedTimes(prev => ({ ...prev, [customTime]: true }));
      setCustomTime('');
    } else {
      alert("กรุณากรอกเวลาให้ถูกต้องในรูปแบบ HH:MM เช่น 15:30");
    }
  };

  const handleResetForm = () => {
    setName('');
    setDosage('1 เม็ด');
    setMealRelation('after');
    setNotes('');
    setRemaining(15);
    setMaxStorage(30);
    setCheckedTimes({
      "08:00": true,
      "12:00": false,
      "18:00": false,
      "21:00": false
    });
    setEditingMedId(null);
    setIsAdding(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('กรุณากรอกชื่อตัวยา');
      return;
    }

    const selectedTimes = Object.keys(checkedTimes).filter(t => checkedTimes[t]).sort();
    if (selectedTimes.length === 0) {
      alert('กรุณาเลือกเวลาในการรับประทานยาอย่างน้อยหนึ่งเวลา');
      return;
    }

    const medData = {
      name: name.trim(),
      dosage,
      times: selectedTimes,
      relationToMeal: mealRelation,
      notes: notes.trim(),
      remainingCount: Number(remaining),
      maxStorage: Number(maxStorage),
      active: true
    };

    if (editingMedId) {
      onEditMedication({
        id: editingMedId,
        ...medData
      });
      setEditingMedId(null);
    } else {
      onAddMedication(medData);
    }

    handleResetForm();
  };

  const handleStartEdit = (med: Medication) => {
    setEditingMedId(med.id);
    setName(med.name);
    setDosage(med.dosage);
    setMealRelation(med.relationToMeal);
    setNotes(med.notes);
    setRemaining(med.remainingCount);
    setMaxStorage(med.maxStorage);

    // Map medication times to checkedtimes
    const updatedChecked: { [key: string]: boolean } = {
      "08:00": false,
      "12:00": false,
      "18:00": false,
      "21:00": false
    };
    med.times.forEach(t => {
      updatedChecked[t] = true;
    });
    setCheckedTimes(updatedChecked);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Toggle Add New Button */}
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900">จัดการยาและตู้จ่ายอัตโนมัติ (Meds Management)</h2>
          <p className="text-xs text-slate-500 mt-1">
            ลงทะเบียบยาสู่ระบบคลาวด์ กำหนดตารางเวลา และตรวจสอบถังพักจ่ายที่บรรจุในหมวกตัก
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            id="btn-add-medication-form-toggle"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/10 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>ลงทะเบียนยาใหม่</span>
          </button>
        )}
      </div>

      {/* Medication Entry / Edit Form */}
      {isAdding && (
        <div id="add-medication-form-panel" className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-50/50 rounded-full translate-x-12 -translate-y-12 pointer-events-none" />
          
          <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
            <Pill className="w-5 h-5 text-indigo-500" />
            <span>{editingMedId ? '✏ แก้ไขข้อมูลรายละเอียดของยา' : '💊 ลงทะเบียนบรรจุยาตัวใหม่ในเครื่องจ่าย'}</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    ชื่อตัวยา (เช่น Paracetamol / ยาเบาหวานเช้า)
                  </label>
                  <input
                    type="text"
                    id="input-med-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="ระบุชื่อยารวมแพทย์สั่ง"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      ขนาดปริมาณต่อครั้ง (Dosage)
                    </label>
                    <select
                      id="input-med-dosage"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="1 เม็ด">1 เม็ด</option>
                      <option value="1.5 เม็ด">1.5 เม็ด</option>
                      <option value="2 เม็ด">2 เม็ด</option>
                      <option value="0.5 เม็ด">0.5 เม็ด</option>
                      <option value="1 แคปซูล">1 แคปซูล</option>
                      <option value="2 แคปซูล">2 แคปซูล</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      ความสัมพันธ์กับอาหาร (Meal)
                    </label>
                    <select
                      id="input-med-meal"
                      value={mealRelation}
                      onChange={(e) => setMealRelation(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      <option value="before">ก่อนอาหาร 30 นาที</option>
                      <option value="after">หลังอาหารทันที</option>
                      <option value="with">พร้อมอาหาร/ระหว่างกิน</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      จำนวนเม็ดที่เหลือในตู้ (คงเหลือ)
                    </label>
                    <input
                      type="number"
                      id="input-med-remaining"
                      min={0}
                      max={maxStorage}
                      value={remaining}
                      onChange={(e) => setRemaining(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      ความจุเต็มช่องจ่ายยา (สูงสุด)
                    </label>
                    <input
                      type="number"
                      id="input-med-max"
                      min={1}
                      value={maxStorage}
                      onChange={(e) => setMaxStorage(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column Fields (Times management) */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    กำหนดเวลาจ่ายยารายวัน (Daily Times)
                  </label>
                  <p className="text-[11px] text-slate-400 mb-2">
                    เลือกเวลาหลักของตู้ หรือป้อนค่าเจาะจงเฉพาะตัว
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(checkedTimes).map(time => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleTimeToggle(time)}
                        className={`py-2 px-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-between transition-all ${
                          checkedTimes[time]
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{time} น.</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          checkedTimes[time] ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                        }`}>
                          {checkedTimes[time] && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Add manual timing entry */}
                  <div className="flex gap-2 mt-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <input
                      type="text"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      placeholder="HH:MM เช่น 15:30"
                      className="flex-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addCustomTime}
                      className="bg-indigo-500 text-white hover:bg-indigo-600 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>เพิ่มเวลา</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                    คำแนะนำฉลากยาพิเศษ (คอยเตือนผู้ดูแลได้เพิ่มเติม)
                  </label>
                  <textarea
                    id="input-med-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="เช่น ควรดื่มน้ำตามมากๆ, ห้ามทานร่วมกับนม"
                  />
                </div>
              </div>

            </div>

            <div className="flex gap-3 justify-end border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={handleResetForm}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                id="btn-sub-medication"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer"
              >
                {editingMedId ? 'บันทึกการแก้ไข' : 'บรรจุลงทะเบียนเข้าเครื่อง'}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Medication Inventory List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {medications.map(med => {
          const refillPercent = Math.min(100, Math.round((med.remainingCount / med.maxStorage) * 100));
          const isLowStock = med.remainingCount < 5;

          return (
            <div 
              key={med.id} 
              id={`med-card-${med.id}`}
              className={`bg-white rounded-2xl shadow-sm border p-5 flex flex-col justify-between transition-all hover:shadow-md ${
                isLowStock ? 'border-rose-200 bg-rose-50/10' : 'border-slate-100'
              }`}
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`p-2 rounded-xl ${isLowStock ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-700'}`}>
                      <Pill className="w-5 h-5" />
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg leading-tight">{med.name}</h4>
                      <p className="text-[11px] text-slate-400 font-semibold font-mono mt-0.5 uppercase">ID: {med.id}</p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleStartEdit(med)}
                      className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-lg hover:bg-indigo-50 border border-slate-100 transition-colors cursor-pointer"
                      title="แก้ไขข้อมูล"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteMedication(med.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 bg-slate-50 rounded-lg hover:bg-rose-50 border border-slate-100 transition-colors cursor-pointer"
                      title="ลบตัวยาออก"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5 mt-4">
                  {/* Dose details */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100/50">
                      <span className="block text-slate-400 text-[10px] uppercase font-bold">ปริมาณยาที่สั่ง:</span>
                      <span className="font-bold text-slate-800">{med.dosage}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100/50">
                      <span className="block text-slate-400 text-[10px] uppercase font-bold">เงื่อนไขการรับทาน:</span>
                      <span className="font-bold text-indigo-700">
                        {med.relationToMeal === 'before' ? 'ก่อนอาหารเช้า/เย็น 30 นาที' : med.relationToMeal === 'after' ? 'หลังอาหารทันที' : 'พร้อมอาหาร'}
                      </span>
                    </div>
                  </div>

                  {/* Scheduled Times */}
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase font-bold mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-indigo-400" /> ตารางเวลาจ่ายของตู้:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {med.times.map(t => (
                        <span key={t} className="bg-indigo-50/70 text-indigo-700 text-xs font-mono font-bold px-2 py-0.5 rounded-md border border-indigo-100">
                          {t} น.
                        </span>
                      ))}
                    </div>
                  </div>

                  {med.notes && (
                    <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50 italic leading-relaxed">
                      💡 คำแนะนำ: {med.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Refill Slider Monitor */}
              <div className="border-t border-slate-100 mt-4 pt-3.5">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-semibold text-slate-500">
                    ความจุช่องเก็บเครื่องสลัด:
                  </span>
                  <span className={`font-mono font-bold ${isLowStock ? 'text-red-600' : 'text-slate-700'}`}>
                    เหลือ {med.remainingCount} จาก {med.maxStorage} เม็ด
                  </span>
                </div>
                
                {/* Visual Progress bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLowStock ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${refillPercent}%` }}
                  />
                </div>

                {isLowStock && (
                  <div className="mt-2 text-[10px] font-bold text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-100 flex items-center gap-1 uppercase tracking-wide">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>แจ้งเตือนจากตู้ยา: ปริมาณยาเหลือน้อย กรุณากดเติมยาผ่านช่องกรอกสปินลิ้งค์!</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
