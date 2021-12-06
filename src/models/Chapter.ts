export interface Chapter {
  entries: Entry[];
  chapterPath: string;
  bookPath: string;
}

export interface Entry {
  type: string;
  id: string;
  name: string;
  workingDirectory: string;
  parameters: string[];
  variables: string[];
  ignoreErrors: boolean;
  pushChanges: boolean;
  dryRun: boolean;
  visible: boolean;
  sensitive: boolean;
  expectedExitValue: number;
  commandTimeout: number;
}
