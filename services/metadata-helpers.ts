import { generalSettings } from "../src/config";

export function cleanLayerName(_str: string) {
  const nameWithoutExtension = _str.slice(0, -4);
  const nameWithoutWeight = nameWithoutExtension
    .split(generalSettings.rarityDelimiter)
    .shift();
  return nameWithoutWeight;
}

export function getRarityWeight(_str: string) {
  const nameWithoutExtension = _str.slice(0, -4);
  let nameWithoutWeight = Number(
    nameWithoutExtension.split(generalSettings.rarityDelimiter).pop()
  );
  if (isNaN(nameWithoutWeight)) {
    nameWithoutWeight = 1;
  }
  return nameWithoutWeight;
}
