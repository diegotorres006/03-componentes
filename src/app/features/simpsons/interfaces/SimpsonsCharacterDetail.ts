import { SimpsonsCharacter } from "./SimpsonsCharacter";

export interface SimpsonsCharacterDetail extends SimpsonsCharacter {
  description: string;
  first_appearance_ep: {
    id: number;
    name: string;
    airdate: string;
    description: string;
    image_path: string;
  };
}