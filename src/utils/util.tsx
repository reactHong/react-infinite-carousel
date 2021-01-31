//TODO: Check if it is always unique.
export const generateID = (): string => {
  return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}