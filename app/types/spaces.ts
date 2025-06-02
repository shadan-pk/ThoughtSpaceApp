export type Thought = {
  id: number;
  text: string;
  x: number;
  y: number;
};

export type Space = {
  id: string;
  name: string;
  thoughts: Thought[];
  createdAt: Date;
  updatedAt: Date;
  isSaved: boolean;
};

export type SpaceMetadata = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  thoughtCount: number;
};