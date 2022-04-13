import { generalSettings } from "../src/config";

export function logIfDebug(_str: string) {
  if (generalSettings.generateDebugLogs) console.log(_str);
}
