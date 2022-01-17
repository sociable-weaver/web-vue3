export interface Book {
  title: string;
  description: string;
  chapters: Chapter[];
  bookPath: string;
  workPath: string;
  chapterPath: string;
}

export interface Chapter {
  title: string;
  description: string;
  path: string;
  error: string | null;
}
