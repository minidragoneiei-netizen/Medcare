/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Medication, MedicationLog } from '../types';
import { TrendingUp, Clock, AlertTriangle, CheckCircle, BarChart3, Filter, ShieldAlert, Calendar } from 'lucide-react';

interface ReportScreenProps {
  logs: MedicationLog[];
  medications: Medication[];
}

export default function ReportScreen({ logs, medications }: ReportScreenProps) {
  const [filter, setFilter] = useState<'all' | 'taken' | 'missed'>('all');

  // Calculate stats
  const totalRecords = logs.length;
  const takenRecords = logs.filter(l => l.status === 'taken').length;
  const missedRecords = logs.filter(l => l.status === 'missed').length;
  const snoozedRecords = logs.filter(l => l.status === 'snoozed').length;
  const remainingRecords = logs.filter(l => l.status === 'pending').length;

  const resolvedLogs = logs.filter(l => l.status !== 'pending');
  const adherenceRate = resolvedLogs.length > 0 
    ? Math.round((logs.filter(l => l.status === 'taken').length / resolvedLogs.length) * 100) 
    : 100;

  // Group logs by date to generate graph data
  // Simulated stats for June 2 to June 6
  const graphData = [
    { date: "2 มิ.ย.", percent: 75, Label: "ลืมทานเช้า" },
    { date: "3 มิ.ย.", percent: 100, Label: "ครบถ้วน" },
    { date: "4 มิ.ย.", percent: 80, Label: "ทานแทนตัวเย็น" },
    { date: "5 มิ.ย.", percent: 100, Label: "ครบถ้วน" },
    { date: "6 มิ.ย. (วันนี้)", percent: adherenceRate, Label: `${takenRecords}/${resolvedLogs.filter(l => l.date === "2026-06-06").length} สำเร็จ` }
  ];

  // Filter logs list
  const filteredLogs = [...logs].filter(log => {
    if (filter === 'taken') return log.status === 'taken';
    if (filter === 'missed') return log.status === 'missed' || log.status === 'snoozed';
    return true; // show all
  }).sort((a, b) => {
    // Sort by date desc, then by time desc
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return b.scheduledTime.localeCompare(a.scheduledTime);
  });

  return (
    <div className="space-y-6">
      
      {/* Percentage Adherence Header Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Big compliance multiplier card */}
        <div className="bg-gradient-to-br from-indigo-700 to-indigo-900 text-white rounded-2xl p-6 shadow-md flex items-center justify-between col-span-1 md:col-span-2 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 pointer-events-none">
            <TrendingUp className="w-40 h-40" />
          </div>
          <div className="z-10">
            <span className="bg-white/10 text-indigo-200 border border-white/10 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              อัตราการประเมินการรักษา
            </span>
            <h3 className="text-3xl font-black mt-2 font-mono">{adherenceRate}% Compliance</h3>
            <p className="text-xs text-indigo-200/90 mt-1 max-w-xs leading-relaxed">
              อัตราการทานยาตามเวลาเทียบเท่าความแม่นยำของอุปกรณ์ป้อนยา สิ้นสุดเวลาประเมินรอบปัจจุบัน
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm shadow-inner text-center z-10 flex flex-col justify-center min-w-[80px]">
            <span className="text-3xl font-black font-mono text-emerald-300">{takenRecords}</span>
            <span className="text-[10px] text-indigo-200 font-semibold uppercase">ทานแล้ว</span>
          </div>
        </div>

        {/* Total pill count tracker */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block">สถิติสะสมสัปดาห์นี้</span>
            <span className="text-3xl font-mono font-black text-slate-800 mt-2 block">{totalRecords} <span className="text-xs text-slate-400 font-bold">เม็ด</span></span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            บันทึกปริมาณยาทั้งหมดที่กำหนดสลัดเม็ดและลึกกล่องปริมณฑล
          </p>
        </div>

        {/* Missed Alarm tracker */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <span className="text-rose-500 text-xs font-bold uppercase tracking-wider block flex items-center gap-1">
              <ShieldAlert className="w-4 h-4" /> สัญญาณลืมกินยาค้าง
            </span>
            <span className="text-3xl font-mono font-black text-rose-600 mt-2 block">
              {missedRecords} <span className="text-xs text-slate-400 font-bold">ครั้ง</span>
            </span>
          </div>
          <p className="text-[11px] text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded inline-block mt-2">
            ⚠️ ได้รับการตรวจสอบและจดบันทึกประวัติลืมแล้ว
          </p>
        </div>

      </div>

      {/* Interactive Adherence Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="font-bold text-slate-900">แนวโน้มผลสำเร็จรายสัปดาห์สูงสุด (Adherence Trend)</h3>
            <p className="text-xs text-slate-400 mt-0.5">เปอร์เซ็นต์สะสมการรับยาในเวลาที่กำหนดโดยเครื่องป้อนยา MedCare</p>
          </div>
        </div>

        {/* Custom Gorgeous SVG Chart */}
        <div className="h-64 w-full relative">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {/* Grid Lines */}
            <div className="border-b border-dashed border-slate-100 w-full h-0" />
            <div className="border-b border-dashed border-slate-100 col-span-3 w-full h-0" />
            <div className="border-b border-dashed border-slate-100 w-full h-0" />
            <div className="border-b border-dashed border-slate-100 w-full h-0" />
          </div>

          <div className="absolute inset-0 flex items-end justify-around pt-6 pb-2">
            {graphData.map((d, index) => {
              const barHeight = `${d.percent}%`;
              return (
                <div key={index} className="flex flex-col items-center group relative w-12 sm:w-16">
                  {/* Tooltip */}
                  <div className="absolute -top-10 bg-slate-900 text-white text-[10px] font-bold py-1 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-md z-10 flex flex-col items-center pointer-events-none">
                    <span className="text-amber-300 font-mono font-black">{d.percent}%</span>
                    <span className="text-[8px] whitespace-nowrap text-slate-300">{d.Label}</span>
                  </div>

                  {/* Graph Bar with exact gradient */}
                  <div className="w-full bg-slate-50 rounded-xl overflow-hidden h-44 flex items-end relative border border-slate-100">
                    <div 
                      className={`w-full rounded-t-xl transition-all duration-1000 ease-out bg-gradient-to-t ${
                        d.percent === 100 
                          ? 'from-emerald-400 to-emerald-500 shadow-md shadow-emerald-500/10' 
                          : d.percent >= 80 
                          ? 'from-indigo-500 to-indigo-600' 
                          : 'from-rose-400 to-rose-500 shadow-md shadow-rose-500/10'
                      }`}
                      style={{ height: barHeight }}
                    />
                  </div>

                  <span className="text-slate-500 text-xs font-semibold mt-2 block font-mono text-center">
                    {d.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* History log review container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        
        {/* Toggle Filtering and Heading */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <h3 className="font-bold text-slate-800">ประวัติบันทึกการจ่ายยาสุดสัปดาห์ (Medication Logs)</h3>
          </div>
          
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              ทั้งหมด ({totalRecords})
            </button>
            <button
              onClick={() => setFilter('taken')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filter === 'taken' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-emerald-700'
              }`}
            >
              ทานครบแล้ว ({takenRecords})
            </button>
            <button
              onClick={() => setFilter('missed')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                filter === 'missed' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500 hover:text-rose-700'
              }`}
            >
              ลืม/เลื่อนทาน ({missedRecords + snoozedRecords})
            </button>
          </div>
        </div>

        {/* Output list table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500 divide-y divide-slate-100">
            <thead className="text-xs text-slate-400 bg-slate-50/50 uppercase font-bold">
              <tr>
                <th scope="col" className="px-6 py-3">วันที่/เวลาเป้าหมาย</th>
                <th scope="col" className="px-6 py-3">ยาเช็คชีส</th>
                <th scope="col" className="px-6 py-3">ขนาดสั่งทาน</th>
                <th scope="col" className="px-6 py-3">เวลาป้อนจริง</th>
                <th scope="col" className="px-6 py-3 text-right">สถานะจ่าย</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLogs.map(log => {
                const isTaken = log.status === 'taken';
                const isMissed = log.status === 'missed';
                const isSnoozed = log.status === 'snoozed';
                const isPending = log.status === 'pending';

                return (
                  <tr key={log.id} id={`log-row-${log.id}`} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-mono text-xs">
                      {log.date} @ {log.scheduledTime}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {log.medicationName}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-500 text-xs">
                      {log.dosage}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-600">
                      {log.takenTime ? `${log.takenTime} น.` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {isTaken && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          ทานสำเร็จ
                        </span>
                      )}
                      {isMissed && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                          ลืมรับประทาน
                        </span>
                      )}
                      {isSnoozed && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          เลื่อนเวลาจ่าย
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                          รอกล่องหมุนจ่าย
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-slate-400 font-medium">
              ไม่พบประวัติป้อนยาที่สอดคล้องกับตัวกรองที่เลือก
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
