import { generalSettings } from "../src/config";

export function getLayerName(_str: string) {
  const nameWithoutExtension = _str.slice(0, -4);
  const nameWithoutWeight = nameWithoutExtension
    .split(generalSettings.rarityDelimiter)
    .shift();
  return nameWithoutWeight!;
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

export function cleanDna(_str: string) {
  const withoutOptions = removeQueryStrings(_str);
  var dna = Number(withoutOptions.split(":").shift());
  return dna;
}

export function isDnaUnique(_DnaList = new Set(), _dna = "") {
  const _filteredDNA = filterDNAOptions(_dna);
  return !_DnaList.has(_filteredDNA);
}

/**
 * In some cases a DNA string may contain optional query parameters for options
 * such as bypassing the DNA isUnique check, this function filters out those
 * items without modifying the stored DNA.
 *
 * @param {String} _dna DNA string.
 * @returns new DNA string with filtered items removed.
 */
export function filterDNAOptions(_dna: string) {
  const dnaItems = _dna.split(generalSettings.dnaDelimiter);
  const filteredDNA = dnaItems.filter((element) => {
    const query = /(\?.*$)/;
    const querystring = query.exec(element);
    if (!querystring) {
      return true;
    }
    const options: any = querystring[1].split("&").reduce((r, setting) => {
      const keyPairs = setting.split("=");
      return { ...r, [keyPairs[0]]: keyPairs[1] };
    }, []);

    return options.bypassDNA;
  });

  return filteredDNA.join(generalSettings.dnaDelimiter);
}

/**
 * Cleaning function for DNA strings. When DNA strings include an option, it
 * is added to the filename with a ?setting=value query string. It needs to be
 * removed to properly access the file name before Drawing.
 *
 * @param {String} _dna The entire newDNA string
 * @returns Cleaned DNA string without query string parameters.
 */
function removeQueryStrings(_dna: string) {
  const query = /(\?.*$)/;
  return _dna.replace(query, "");
}
