export interface Book {
  title: string;
  description: string;
  path: string;
  chapters: Chapter[];
}

export interface Chapter {
  title: string;
  description: string;
  path: string;
}
