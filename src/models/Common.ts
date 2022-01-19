/* TODO: move to a common place */
export function asString(param: undefined | string | string[]): string {
  if (param === undefined || param === "undefined") {
    return "";
  }

  /* TODO: need to handle the string[] */
  return param as string;
}

/* TODO: move to a common place */
export function isNonBlank(param: undefined | string | string[]): boolean {
  return param !== undefined && (typeof param === "string" ? param.trim().length > 0 : param.length > 0);
}
