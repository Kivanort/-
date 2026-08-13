/** Типы данных приложения НавИИгатор */

export type CommunicationStyle = "formal" | "informal";

export type AgeRange = "under18" | "18-25" | "26-35" | "36-50" | "50plus";

export type Profession =
  | "it"
  | "engineering"
  | "humanities"
  | "business"
  | "student"
  | "other";

export type Hobby =
  | "games"
  | "history"
  | "tech"
  | "art"
  | "science"
  | "music"
  | "cinema";

export type TourDuration = "15-20" | "30-40" | "60plus";

export type RouteTheme =
  | "computers"
  | "keyboards-games"
  | "soviet"
  | "modern"
  | "random"
  | "";

export interface UserProfile {
  name: string;
  age: AgeRange | "";
  profession: Profession | "";
  hobbies: Hobby[];
  tourTime: TourDuration | "";
  style: CommunicationStyle;
  theme: RouteTheme;
}

export interface Route {
  id: string;
  title: string;
  description: string;
  category: "history" | "games" | "technology";
  duration: string;
  icon: string;
  exhibitIds: string[];
}

export interface Exhibit {
  id: string;
  title: string;
  formal: string;
  informal: string;
  /** Варианты текста под профессию */
  byProfession: Partial<Record<Profession, string>>;
  /** Варианты текста под хобби */
  byHobby: Partial<Record<Hobby, string>>;
  interactives: { id: string; label: string; content: string }[];
}

export interface PostTourQuestion {
  id: string;
  question: string;
  options: { id: string; text: string; correct: boolean }[];
}

export interface Reward {
  id: string;
  type: "sticker" | "badge" | "avatar";
  title: string;
  emoji: string;
  description: string;
}

export interface TourState {
  routeId: string;
  exhibitIndex: number;
  timerDone: boolean;
}
