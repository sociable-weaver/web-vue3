import { Marked } from "@ts-stack/markdown";

export interface HasError {
  error: string | null;
}

export interface Book extends HasError {
  title: string;
  description: string;
  chapters: Chapter[];
  bookPath: string;
  workPath: string;
  chapterIndex: number;
  entryId: string;
  opened: boolean;
}

export interface Chapter extends HasError {
  chapterPath: string;
  entries: Entry[];
}

/* The application is only expecting the following, and it will fail if we provide more.
    That's why we are stripping down properties that are not needed by the application. */
export interface SaveEntry {
  type: string;
  id: string;
  name: string;
  workingDirectory: string;
  parameters: string[];
  variables: string[];
  environmentVariables: string[];
  ignoreErrors: boolean;
  dryRun: boolean;
  sensitive: boolean;
  expectedExitValue: number;
  commandTimeout: number;
}

export interface Entry extends HasError {
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
  showEditControls: boolean;
  edit: boolean;
  failed: boolean;
  output: string;
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

export interface IndexAndLength {
  index: number;
  length: number;
}

export function getPart(name: string, parameters: string[]): string[] {
  const indexAndLength = findPart(name, parameters);
  if (indexAndLength.index != -1) {
    const contentIndex = indexAndLength.index + 1;
    return parameters.slice(contentIndex, contentIndex + indexAndLength.length);
  }

  return [];
}

export function setPart(name: string, value: string[], parameters: string[]): void {
  const indexAndLength = findPart(name, parameters);
  if (indexAndLength.index == -1) {
    parameters.push(`${name}:${value.length}`, ...value);
  } else {
    const part = [`${name}:${value.length}`, ...value];
    parameters.splice(indexAndLength.index, indexAndLength.length + 1, ...part);
  }
}

function findPart(name: string, parameters: string[]): IndexAndLength {
  let i = 0;

  while (i < parameters.length) {
    const header = parameters[i];
    const parts = header.split(":");
    const length = parseInt(parts[1]);
    if (name === parts[0]) {
      return { index: i, length };
    }

    i += length + 1;
  }

  return { index: -1, length: -1 };
}

export function setValue(entry: Entry, update: VariableInitialised): void {
  if (entry.variables !== undefined && entry.variables.indexOf(update.name) > -1) {
    if (entry.values === undefined) {
      entry.values = {};
    }
    entry.values[update.name] = update.value;
  }
}

export function emptyBook(): Book {
  return {
    title: "",
    description: "",
    chapters: [] as Chapter[],
    bookPath: "",
    workPath: "",
    chapterIndex: -1,
    entryId: "",
    error: "",
    opened: false,
  };
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

export function arrayContainsValues(parameters: string[] | undefined): boolean {
  return parameters != undefined && Array.isArray(parameters) && parameters.length > 0;
}

export function getDefaultIfNotArrayOrEmpty(
  parameters: string[] | undefined,
  defaultValue: () => string[] = () => []
): string[] {
  if (!Array.isArray(parameters) || parameters.length == 0) {
    return defaultValue();
  }

  return parameters;
}

export function join(parameters: string[] | undefined, defaultValue: () => string = () => ""): string {
  if (!Array.isArray(parameters) || parameters.length == 0) {
    return defaultValue();
  }

  return parameters.join("\n");
}

export function getElement(parameters: string[] | undefined, index = 0, defaultValue: () => string = () => ""): string {
  if (!Array.isArray(parameters) || parameters.length <= index) {
    return defaultValue();
  }

  return parameters[index];
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
    ignoreErrors: entry.ignoreErrors,
    dryRun: entry.dryRun,
    sensitive: entry.sensitive,
    expectedExitValue: entry.expectedExitValue,
    commandTimeout: entry.commandTimeout,
  } as SaveEntry;
}

export function hasChanged(entry: Entry, edit: SaveEntry): boolean {
  return (
    entry.workingDirectory !== edit.workingDirectory ||
    join(entry.parameters) !== join(edit.parameters) ||
    join(entry.variables) !== join(edit.variables) ||
    join(entry.environmentVariables) !== join(edit.environmentVariables) ||
    entry.ignoreErrors !== edit.ignoreErrors ||
    entry.dryRun !== edit.dryRun ||
    entry.expectedExitValue !== edit.expectedExitValue ||
    entry.commandTimeout !== edit.commandTimeout
  );
}

export function title(chapter: Chapter): string {
  const entry = chapter.entries.find((e) => e.type === "chapter");
  if (entry === undefined) {
    return "Missing chapter entry";
  }

  return join(getPart("Title", entry.parameters));
}

export function description(chapter: Chapter): string {
  const entry = chapter.entries.find((e) => e.type === "chapter");
  if (entry === undefined) {
    return "Missing chapter entry";
  }

  return Marked.parse(join(getPart("Description", entry.parameters)));
}
