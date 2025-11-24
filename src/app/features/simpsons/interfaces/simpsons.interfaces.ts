export interface SimpsonsResponse {
  count: number;
  next: string | null;
  prev: string | null;
  pages: number;
  results: SimpsonsCharacter[];
}




export interface SimpsonsCharacter {
  id: number;
  age: number | null;
  birthdate: string | null;
  gender: string;
  name: string;
  occupation: string;
  portrait_path: string;
  phrases: string[];
  status: string;
}



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