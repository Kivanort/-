import type {
  UserProfile,
  TourState,
  Route,
  Exhibit,
  Reward,
  TourDuration,
  Profession,
  Hobby,
} from "@/types";

/** Базовый текст экспоната + адаптация под профессию и первое хобби */
export function getExhibitText(exhibit: Exhibit, profile: UserProfile): string {
  const base = profile.style === "formal" ? exhibit.formal : exhibit.informal;
  const parts = [base];

  if (profile.profession && exhibit.byProfession[profile.profession as Profession]) {
    parts.push(`\n\n💡 ${exhibit.byProfession[profile.profession as Profession]}`);
  }

  const hobby = profile.hobbies[0] as Hobby | undefined;
  if (hobby && exhibit.byHobby[hobby]) {
    parts.push(`\n\n🎯 ${exhibit.byHobby[hobby]}`);
  }

  return parts.join("");
}

/** Секунды на экспонат из ответа об времени экскурсии */
export function getExhibitDurationSec(tourTime: TourDuration | ""): number {
  switch (tourTime) {
    case "15-20":
      return 45;
    case "30-40":
      return 75;
    case "60plus":
      return 120;
    default:
      return 60;
  }
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function calcQuizScore(
  answers: Record<string, string>,
  questions: { id: string; options: { id: string; correct: boolean }[] }[]
): number {
  if (!questions.length) return 0;
  let correct = 0;
  questions.forEach((q) => {
    const opt = q.options.find((o) => o.id === answers[q.id]);
    if (opt?.correct) correct++;
  });
  return Math.round((correct / questions.length) * 100);
}

export function isProfileComplete(profile: UserProfile): boolean {
  return !!(
    profile.name.trim() &&
    profile.age &&
    profile.profession &&
    profile.hobbies.length > 0 &&
    profile.tourTime &&
    profile.style
  );
}

export type { Route, Exhibit, Reward, TourState, UserProfile };
