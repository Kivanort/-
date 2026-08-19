"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useApp } from '@/context/AppContext';
import type { AgeRange, TechLevel, Profession, Hobby, TourDuration, CommunicationStyle } from '@/types';

const TOTAL_STEPS = 7;

const Q2_OPTIONS: { id: AgeRange; key: string }[] = [
  { id: '18-25', key: 'quiz.q2_opt1' },
  { id: '25-35', key: 'quiz.q2_opt2' },
  { id: '35-45', key: 'quiz.q2_opt3' },
  { id: '45plus', key: 'quiz.q2_opt4' },
];

const Q3_OPTIONS: { id: TechLevel; key: string }[] = [
  { id: 'none', key: 'quiz.q3_opt1' },
  { id: 'medium', key: 'quiz.q3_opt2' },
  { id: 'advanced', key: 'quiz.q3_opt3' },
];

const Q4_OPTIONS: { id: Profession; key: string }[] = [
  { id: 'it', key: 'quiz.q4_opt1' },
  { id: 'design-media', key: 'quiz.q4_opt2' },
  { id: 'education-science', key: 'quiz.q4_opt3' },
  { id: 'business', key: 'quiz.q4_opt4' },
  { id: 'student', key: 'quiz.q4_opt5' },
  { id: 'other', key: 'quiz.q4_opt6' },
];

const Q5_OPTIONS: { id: Hobby; key: string }[] = [
  { id: 'videogames', key: 'quiz.q5_opt1' },
  { id: 'programming-robotics', key: 'quiz.q5_opt2' },
  { id: 'photography', key: 'quiz.q5_opt3' },
  { id: 'music', key: 'quiz.q5_opt4' },
  { id: 'painting', key: 'quiz.q5_opt5' },
  { id: 'travel', key: 'quiz.q5_opt6' },
  { id: 'reading-history', key: 'quiz.q5_opt7' },
  { id: 'none', key: 'quiz.q5_opt8' },
];

const Q6_OPTIONS: { id: TourDuration; key: string }[] = [
  { id: '30', key: 'quiz.q6_opt1' },
  { id: '60', key: 'quiz.q6_opt2' },
  { id: '90', key: 'quiz.q6_opt3' },
];

const Q7_OPTIONS: { id: CommunicationStyle; key: string }[] = [
  { id: 'formal', key: 'quiz.q7_opt1' },
  { id: 'informal', key: 'quiz.q7_opt2' },
];

export default function QuizPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { updateProfile } = useApp();

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState<AgeRange | ''>('');
  const [techLevel, setTechLevel] = useState<TechLevel | ''>('');
  const [profession, setProfession] = useState<Profession | ''>('');
  const [hobbies, setHobbies] = useState<Hobby[]>([]);
  const [tourTime, setTourTime] = useState<TourDuration | ''>('');
  const [style, setStyle] = useState<CommunicationStyle | ''>('');

  const canNext = (): boolean => {
    switch (step) {
      case 0: return name.trim().length > 0;
      case 1: return age !== '';
      case 2: return techLevel !== '';
      case 3: return profession !== '';
      case 4: return hobbies.length > 0;
      case 5: return tourTime !== '';
      case 6: return style !== '';
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleHobbyToggle = useCallback((hobby: Hobby) => {
    setHobbies(prev => {
      if (prev.includes(hobby)) return prev.filter(h => h !== hobby);
      return [...prev, hobby];
    });
  }, []);

  const handleSubmit = () => {
    updateProfile({
      name: name.trim(),
      age: age as AgeRange,
      techLevel: techLevel as TechLevel,
      profession: profession as Profession,
      hobbies: hobbies,
      tourTime: tourTime as TourDuration,
      style: style as CommunicationStyle,
    });
    router.push('/routes');
  };

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">{t('quiz.title')}</h1>
      <p className="text-gray-500 mb-6">{step + 1} / {TOTAL_STEPS}</p>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Step 0: Name - always mounted, visibility via CSS */}
        <div className={step === 0 ? '' : 'hidden'}>
          <label className="block font-medium mb-2">{t('quiz.question1')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder={t('quiz.question1')}
          />
        </div>

        {/* Step 1: Age */}
        <div className={step === 1 ? '' : 'hidden'}>
          <label className="block font-medium mb-3">{t('quiz.question2')}</label>
          <div className="space-y-2">
            {Q2_OPTIONS.map(opt => (
              <label key={opt.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50">
                <input
                  type="radio"
                  name="age"
                  checked={age === opt.id}
                  onChange={() => setAge(opt.id)}
                  className="w-4 h-4"
                />
                <span>{t(opt.key)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Step 2: Tech level */}
        <div className={step === 2 ? '' : 'hidden'}>
          <label className="block font-medium mb-3">{t('quiz.question3')}</label>
          <div className="space-y-2">
            {Q3_OPTIONS.map(opt => (
              <label key={opt.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50">
                <input
                  type="radio"
                  name="techLevel"
                  checked={techLevel === opt.id}
                  onChange={() => setTechLevel(opt.id)}
                  className="w-4 h-4"
                />
                <span>{t(opt.key)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Step 3: Profession */}
        <div className={step === 3 ? '' : 'hidden'}>
          <label className="block font-medium mb-3">{t('quiz.question4')}</label>
          <div className="space-y-2">
            {Q4_OPTIONS.map(opt => (
              <label key={opt.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50">
                <input
                  type="radio"
                  name="profession"
                  checked={profession === opt.id}
                  onChange={() => setProfession(opt.id)}
                  className="w-4 h-4"
                />
                <span>{t(opt.key)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Step 4: Hobbies - checkboxes, multi-select */}
        <div className={step === 4 ? '' : 'hidden'}>
          <label className="block font-medium mb-3">{t('quiz.question5')}</label>
          <div className="space-y-2">
            {Q5_OPTIONS.map(opt => (
              <label key={opt.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={hobbies.includes(opt.id)}
                  onChange={() => handleHobbyToggle(opt.id)}
                  className="w-4 h-4"
                />
                <span>{t(opt.key)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Step 5: Tour time */}
        <div className={step === 5 ? '' : 'hidden'}>
          <label className="block font-medium mb-3">{t('quiz.question6')}</label>
          <div className="space-y-2">
            {Q6_OPTIONS.map(opt => (
              <label key={opt.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50">
                <input
                  type="radio"
                  name="tourTime"
                  checked={tourTime === opt.id}
                  onChange={() => setTourTime(opt.id)}
                  className="w-4 h-4"
                />
                <span>{t(opt.key)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Step 6: Communication style */}
        <div className={step === 6 ? '' : 'hidden'}>
          <label className="block font-medium mb-3">{t('quiz.question7')}</label>
          <div className="space-y-2">
            {Q7_OPTIONS.map(opt => (
              <label key={opt.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50">
                <input
                  type="radio"
                  name="style"
                  checked={style === opt.id}
                  onChange={() => setStyle(opt.id)}
                  className="w-4 h-4"
                />
                <span>{t(opt.key)}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0}
            className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            {t('quiz.back')}
          </button>

          {step < TOTAL_STEPS - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canNext()}
              className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700"
            >
              {t('quiz.next')}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canNext()}
              className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-700"
            >
              {t('quiz.submit')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
