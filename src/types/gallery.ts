export type Gallery = {
  id: string;
  name: string;
  password?: string | null;
  businesses?: {
    name: string;
  };
};