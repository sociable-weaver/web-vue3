export interface Chapter {
  entries: Entry[];
  chapterPath: string;
  bookPath: string;
  workPath: string;
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
  onSave: () => OnSaveOutcome;
}

export enum OnSaveOutcome {
  Changed,
  NotChanged,
  KeepEditing,
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
