/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { Shield, Key, ArrowRight, UserCheck, Heart, Users } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (role: UserRole, user: UserProfile) => void;
  profile: UserProfile;
}

export default function LoginScreen({ onLogin, profile }: LoginScreenProps) {
  const [role, setRole] = useState<UserRole>('elderly');
  const [phoneNumber, setPhoneNumber] = useState('081-234-5678');
  const [pinCode, setPinCode] = useState('1234');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      setError('กรุณากรอกเบอร์โทรศัพท์');
      return;
    }
    if (pinCode !== profile.pinCode) {
      setError('รหัสผ่าน PIN 4 หลักไม่ถูกต้อง (ใช้รหัสคำสั่งพิมพ์ 1234)');
      return;
    }
    setError('');
    onLogin(role, profile);
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    onLogin(demoRole, profile);
  };

  return (
    <div id="login-screen-card" className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 mt-6 transition duration-300 transform hover:shadow-2xl">
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 p-8 text-white relative">
        <div className="absolute right-4 bottom-4 opacity-10">
          <Heart className="w-32 h-32" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 bg-white/10 rounded-lg">
            <Heart className="w-5 h-5 text-indigo-200 fill-indigo-200" />
          </span>
          <span className="font-mono text-xs text-indigo-200 uppercase tracking-widest font-semibold">MedCare Platform</span>
        </div>
        <h2 className="text-2xl font-bold">เข้าสู่ระบบ / สมัครสมาชิก</h2>
        <p className="text-xs text-indigo-100/80 mt-1">
          กรุณาเลือกบทบาทผู้ใช้งานเพื่อเริ่มต้นดูแลสุขภาพอย่างปลอดภัย
        </p>
      </div>

      <div className="p-8">
        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-1 bg-slate-100 rounded-2xl">
          <button
            type="button"
            id="role-tab-elderly"
            onClick={() => setRole('elderly')}
            className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-xl transition-all ${
              role === 'elderly'
                ? 'bg-white text-indigo-600 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-5 h-5 mb-1" />
            <span className="text-xs">ผู้สูงอายุ / ผู้รับยา</span>
          </button>
          <button
            type="button"
            id="role-tab-caregiver"
            onClick={() => setRole('caregiver')}
            className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-xl transition-all ${
              role === 'caregiver'
                ? 'bg-white text-indigo-600 shadow-sm font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-5 h-5 mb-1" />
            <span className="text-xs">ผู้ดูแล (Caregiver)</span>
          </button>
        </div>

        {error && (
          <div id="login-error-alert" className="p-3 mb-4 text-xs font-semibold text-red-700 bg-red-50 rounded-xl border border-red-100">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              เบอร์โทรศัพท์มือถือที่ผูกกับตู้ยา
            </label>
            <input
              type="text"
              id="login-phone-input"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
              placeholder="เช่น 081-234-5678"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                รหัสผ่านตู้นิรภัย (PIN 4 หลัก)
              </label>
              <span className="text-[10px] text-indigo-500 font-semibold font-mono bg-indigo-50 px-1.5 py-0.5 rounded">
                Demo Code: 1234
              </span>
            </div>
            <div className="relative">
              <input
                type="password"
                id="login-pin-input"
                maxLength={4}
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono tracking-widest text-center text-lg"
                placeholder="○ ○ ○ ○"
              />
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            id="login-submit-button"
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 text-sm flex items-center justify-center gap-2 mt-6 cursor-pointer"
          >
            <span>ลงชื่อเข้าสู่ระบบ</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-slate-400 font-mono">OR QUICK ENTRY</span>
          </div>
        </div>

        {/* Quick entry links to test the dual functionality immediately */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleQuickDemo('elderly')}
            id="quick-login-elderly"
            className="border border-indigo-100 hover:bg-indigo-50/50 text-indigo-600 rounded-xl py-2.5 px-2 text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>เข้าบทบาท อาม่า (สมศรี)</span>
          </button>
          <button
            onClick={() => handleQuickDemo('caregiver')}
            id="quick-login-caregiver"
            className="border border-indigo-100 hover:bg-slate-50 text-indigo-800 rounded-xl py-2.5 px-2 text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>เข้าบทบาท ผู้ดูแล (วิชัย)</span>
          </button>
        </div>

        <p className="text-[11px] text-center text-slate-400 mt-6">
          มีปัญหาเกี่ยวกับการติดตั้งตู้ยาอัตโนมัติ? โทรสายด่วนฝ่ายชำนาญทางพิเศษ 24 ชม. 02-123-4567
        </p>
      </div>
    </div>
  );
}
