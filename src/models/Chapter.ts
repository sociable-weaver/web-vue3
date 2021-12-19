export interface Chapter {
  entries: Entry[];
  chapterPath: string;
  bookPath: string;
  workPath: string;
}

/* The application is only expecting the following and it will fail if we provide more.
    That's why we are stripping down properties that are not needed by the application. */
export interface SaveEntry {
  type: string;
  id: string;
  name: string;
  workingDirectory: string;
  parameters: string[];
  variables: string[];
  environmentVariables: string[];
  values: { [name: string]: string };
  ignoreErrors: boolean;
  pushChanges: boolean;
  dryRun: boolean;
  sensitive: boolean;
  expectedExitValue: number;
  commandTimeout: number;
}

export interface Entry {
  type: string;
  id: string;
  name: string;
  workingDirectory: string;
  parameters: string[];
  variables: string[];
  environmentVariables: string[];
  values: { [name: string]: string };
  ignoreErrors: boolean;
  pushChanges: boolean;
  dryRun: boolean;
  sensitive: boolean;
  expectedExitValue: number;
  commandTimeout: number;
  edit: boolean;
  failed: boolean;
  output: string;
  error: string;
  onSave: () => OnSaveResult;
}

export enum OnSaveOutcome {
  Changed,
  NotChanged,
  KeepEditing,
}

export interface OnSaveResult {
  outcome: OnSaveOutcome;
  entry: SaveEntry | null;
}

export interface VariableInitialised {
  name: string;
  value: string;
}

export interface VariableUpdated extends VariableInitialised {
  previousValue: string;
}

export function setValue(entry: Entry, update: VariableInitialised): void {
  if (entry.variables !== undefined && entry.variables.indexOf(update.name) > -1) {
    if (entry.values === undefined) {
      entry.values = {};
    }
    entry.values[update.name] = update.value;
  }
}

export function doAllVariablesHaveValues(entry: Entry): boolean {
  if (entry.variables === undefined || entry.variables.length == 0) {
    return true;
  }

  if (entry.values === undefined) {
    return false;
  }

  const missingVariables = entry.variables
    .map((variable) => entry.values[variable])
    .filter((value) => value === undefined || value.length == 0).length;

  return missingVariables === 0;
}

export function interpolate(variables: string[], values: { [name: string]: string }, text: string): string {
  if (variables === undefined || values === undefined) {
    return text;
  }

  let interpolated = text;

  variables.forEach((variable) => {
    const value = values[variable];
    if (value !== undefined) {
      interpolated = interpolated.replaceAll(`\${${variable}}`, value);
    }
  });

  return interpolated;
}

export function createSaveEntry(entry: Entry): SaveEntry {
  return {
    type: entry.type,
    id: entry.id,
    name: entry.name,
    workingDirectory: entry.workingDirectory,
    parameters: Object.assign([], entry.parameters),
    variables: Object.assign([], entry.variables),
    environmentVariables: Object.assign([], entry.environmentVariables),
    values: Object.assign({}, entry.values),
    ignoreErrors: entry.ignoreErrors,
    pushChanges: entry.pushChanges,
    dryRun: entry.dryRun,
    sensitive: entry.sensitive,
    expectedExitValue: entry.expectedExitValue,
    commandTimeout: entry.commandTimeout,
  } as SaveEntry;
}
