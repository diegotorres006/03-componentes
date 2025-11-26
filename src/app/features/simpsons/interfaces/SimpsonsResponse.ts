import { SimpsonsCharacter } from "./SimpsonsCharacter";

export interface SimpsonsResponse {
  count: number;
  next: string | null;
  prev: string | null;
  pages: number;
  results: SimpsonsCharacter[];
}