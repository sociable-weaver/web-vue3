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
  values: { [name: string]: string };
  ignoreErrors: boolean;
  pushChanges: boolean;
  dryRun: boolean;
  visible: boolean;
  sensitive: boolean;
  expectedExitValue: number;
  commandTimeout: number;
}

export interface VariableUpdated {
  name: string;
  value: string;
  previousValue: string;
}

export function updateValue(entry: Entry, update: VariableUpdated): void {
  if (entry.variables !== undefined && entry.variables.indexOf(update.name) > -1) {
    entry.values[update.name] = update.value;
  }
}
