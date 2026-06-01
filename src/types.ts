export interface ImageCard {
  src: string;
  index: number;
  modelName: string;
  num: string;
  cardSize: 'large' | 'regular';
}

export interface Model {
  id: string;
  number: string;
  firstName: string;
  lastName: string;
  description: string;
  tags: string[];
  images: ImageCard[];
}
