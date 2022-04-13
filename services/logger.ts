import { generalSettings } from "../src/config";

export function log(_str: string) {
  if (generalSettings.generateDebugLogs) console.log(_str);
}
