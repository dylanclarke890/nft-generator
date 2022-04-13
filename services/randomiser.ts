export function shuffle(array: any[]) {
  let currentIndex = array.length,
    randomIndex: number;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

export function getRandomElement(
  layer: any,
  totalWeight: number,
  randNum: string[]
) {
  // number between 0 - totalWeight
  let random = Math.floor(Math.random() * totalWeight);
  for (var i = 0; i < layer.elements.length; i++) {
    const currElement = layer.elements[i];
    // subtract the current weight from the random weight until we reach a sub zero value.
    random -= currElement.weight;
    if (random < 0) {
      return randNum.push(
        `${currElement.id}:${currElement.filename}${
          layer.bypassDNA ? "?bypassDNA=true" : ""
        }`
      );
    }
  }
}
