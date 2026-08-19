/** Типы данных приложения НавИИгатор */

export type CommunicationStyle = "formal" | "informal";

export type AgeRange = "18-25" | "25-35" | "35-45" | "45plus";

export type TechLevel = "none" | "medium" | "advanced";

export type Profession =
  | "it"
  | "design-media"
  | "education-science"
  | "business"
  | "student"
  | "other";

export type Hobby =
  | "videogames"
  | "programming-robotics"
  | "photography"
  | "music"
  | "painting"
  | "travel"
  | "reading-history"
  | "none";

export type TourDuration = "30" | "60" | "90";

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
  techLevel: TechLevel | "";
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
  byProfession: Partial<Record<Profession, string>>;
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
