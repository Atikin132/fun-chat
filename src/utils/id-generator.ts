const ID_START_INDEX = 2;
const ID_LENGTH = 10;
const ID_RADIX = 36;

export function generateId(): string {
  return Math.random()
    .toString(ID_RADIX)
    .slice(ID_START_INDEX, ID_START_INDEX + ID_LENGTH);
}
