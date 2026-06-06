/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  AlertTriangle, 
  Lightbulb, 
  Cpu, 
  Smartphone, 
  Layers, 
  Users, 
  CheckCircle, 
  Bell, 
  Calendar, 
  TrendingUp, 
  Heart, 
  ClipboardList 
} from 'lucide-react';

export default function StageOverview() {
  return (
    <div id="stage-overview-section" className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 md:p-8 shadow-xl mb-8 border border-indigo-500/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-indigo-500/20 pb-6 mb-6 gap-4">
        <div>
          <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            แนวคิดและการแก้ปัญหา (Design Concept Deck)
          </span>
          <h1 className="text-2xl md:text-3xl font-bold mt-2 bg-gradient-to-r from-white via-indigo-200 to-indigo-100 bg-clip-text text-transparent">
            MedCare: ระบบเครื่องป้อนยาอัตโนมัติอัจฉริยะธิการ
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            บูรณาการฮาร์ดแวร์ตู้อินเตอร์เน็ตของสรรพสิ่ง (IoT) และแอปพลิเคชันเพื่อดูแลผู้สูงวัยอย่างใกล้ชิด
          </p>
        </div>
        <div className="flex items-center gap-2 text-indigo-300 bg-indigo-950/50 px-4 py-2 rounded-xl border border-indigo-500/10 text-sm font-mono">
          <Cpu className="w-4 h-4 animate-pulse" />
          <span>IoT Firmware v2.1-Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Stage 1: Pain Point & Insight */}
        <div className="bg-slate-950/40 border border-red-500/10 rounded-xl p-5 md:p-6 hover:border-red-500/20 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-red-400 uppercase tracking-wider">Stage 1</h2>
              <h3 className="text-lg font-bold text-white">Pain Point &amp; Insights (ปัญหาหลักและข้อมูลเชิงลึก)</h3>
            </div>
          </div>

          <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
            <div className="bg-red-500/5 border-l-2 border-red-500 p-3 rounded-r-lg">
              <h4 className="font-semibold text-red-200 mb-1">ปัญหาที่พบ (The Problem):</h4>
              <p className="text-slate-300">
                ผู้สูงอายุจำนวนมากต้องรับประทานยาหลายชนิดในแต่ละวัน ทำให้เกิด
                <span className="text-red-300 font-semibold">การลืมกินยา กินยาผิดเวลา หรือกินยาผิดขนาด</span> 
                ส่งผลให้การรักษาไม่มีประสิทธิภาพและอาจเกิดอันตรายต่อสุขภาพร้ายแรง นอกจากนี้
                <span className="text-red-300 font-semibold">ผู้ดูแลไม่สามารถติดตามการรับประทานยา</span>ของผู้สูงอายุได้ตลอดเวลา 24 ชั่วโมง
              </p>
            </div>

            <div className="space-y-3 mt-4">
              <h4 className="font-semibold text-indigo-300 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-indigo-400" /> ข้อมูลเชิงลึกจากผู้ใช้งาน (Insights):
              </h4>
              <ul className="list-none space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                  <span>
                    <strong className="text-white">โรคเรื้อรังส่งผลให้ยาล้น (Polypharmacy):</strong> อาม่าและอากงเฉลี่ยมีโรคประจำตัว 2-3 โรค ทำให้ต้องรับประทานยา 5-10 เม็ดต่อวันในเวลาที่ซับซ้อนมาก (ก่อน/หลังอาหาร ทันทีก่อนนอน หรือวันเว้นวัน)
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                  <span>
                    <strong className="text-white">ความสามารถในการรับรู้ลดลง:</strong> การมองเห็นตัวอักษรบนซองยาขนาดเล็กนั้นยากลำบาก และผู้สูงอายุมีแนวโน้มกังวลว่ากินยาไปแล้วหรือยัง ทำให้กินซ้ำหรือละเลยไปเลย
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                  <span>
                    <strong className="text-white">ความวิตกกังวลของผู้ดูแล (Caregiver Guilt):</strong> ลูกหลานที่ออกไปทำงานต้องคอยโทรศัพท์จี้ถาม เกิดความขัดแย้งสะสม และมีขีดจำกัดในการคุมสถิติสุขภาพระยะยาว
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stage 2: Idea & Web Solution */}
        <div className="bg-slate-950/40 border border-teal-500/10 rounded-xl p-5 md:p-6 hover:border-teal-500/20 transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-teal-400 uppercase tracking-wider">Stage 2</h2>
              <h3 className="text-lg font-bold text-white">Idea &amp; Solution (แนวคิดและการทำงานหน้าเว็บ)</h3>
            </div>
          </div>

          <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
            <div className="bg-teal-500/5 border-l-2 border-teal-400 p-3 rounded-r-lg">
              <h4 className="font-semibold text-teal-200 mb-1">ผลลัพธ์ของระบบ (The Solution):</h4>
              <p className="text-slate-300">
                พัฒนาระบบ <strong className="text-white">MedCare เครื่องป้อนยาอัตโนมัติ</strong> ร่วมกับ Web App คลาวด์ ที่สามารถตั้งเวลารับประทานยา จ่ายยาแบบอัจฉริยะตามปริมาณที่แพทย์ระบุ แจ้งเตือนส่งสัญญาณไฟ/เสียง และยิงรายงานผลไปยังสมาร์ทโฟนของผู้ดูแลโดยตรงแบบเรลไทม์
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2 text-teal-300 font-semibold mb-1">
                  <Cpu className="w-4 h-4" />
                  <span>เครื่องจ่ายยาอัตโนมัติ</span>
                </div>
                <p className="text-xs text-slate-400">
                  จ่ายยาตรงเวลา แบ่งตามประเภท แยกเช้ากลางวันเย็น อัตโนมัติป้องกันหยิบผิดช่อง
                </p>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2 text-indigo-300 font-semibold mb-1">
                  <Smartphone className="w-4 h-4" />
                  <span>โมบาย คลาวด์เว็บแอป</span>
                </div>
                <p className="text-xs text-slate-400">
                  แจ้งเตือนผู้ดูแล บันทึกสถิติ ประสานพิกัดเครื่อง และติดต่อหาปู่ย่าตายายได้ทันที
                </p>
              </div>
            </div>

            <div className="mt-4 pt-2">
              <h4 className="font-semibold text-slate-200 mb-2 text-xs uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> โครงสร้างเว็บบอร์ดต้นแบบ 7 หน้า (Specification)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-indigo-400" />
                  <span><strong>หน้า 1 :</strong> เข้าสู่ระบบ &amp; คัดกรองบทบาท</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-indigo-400" />
                  <span><strong>หน้า 2 :</strong> หน้าหลักแสดงรายการยาประจำวัน</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-indigo-400" />
                  <span><strong>หน้า 3 :</strong> ส่วนจัดการยา &amp; กำหนดปริมาณ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-indigo-400" />
                  <span><strong>หน้า 4 :</strong> โมดอลแจ้งเตือน &amp; บัญชาการจ่าย</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-indigo-400" />
                  <span><strong>หน้า 5 :</strong> รายงานผลการรับทานยาเชิงเปรียบเทียบ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3 h-3 text-indigo-400" />
                  <span><strong>หน้า 6 :</strong> หน้าผู้ดูแลตรวจสัญญาณ Telemetry</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <CheckCircle className="w-3 h-3 text-indigo-400" />
                  <span><strong>หน้า 7 :</strong> โปรไฟล์ผู้สูงอายุ/ผู้ดูแล &amp; รายละเอียดติดต่อฉุกเฉิน</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Simulator Quick Tips */}
      <div className="mt-6 pt-4 border-t border-indigo-500/10 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
        <span className="flex items-center gap-1.5">
          <Heart className="w-4 h-4 text-red-400" />
          <span>ออกแบบ UI ด้วยสีโทนอุ่น และฟอนต์ขนาดใหญ่พิเศษ เพื่อความสะดวกของผู้สูงอายุ</span>
        </span>
        <span className="text-indigo-300 font-semibold bg-indigo-500/10 px-2 py-1 rounded">
          💡 คำแนะนำ: ด้านล่างนี้คือ โปรแกรมต้นแบบ คุณสามารถคลิกทดลองใช้งาน สลับบทบาท และทดสอบการแจ้งเตือนได้ทันที!
        </span>
      </div>
    </div>
  );
}
