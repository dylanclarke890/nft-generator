import { debugLogs } from "../src/config";

export function log(_str: string) {
  if (debugLogs) console.log(_str);
}
