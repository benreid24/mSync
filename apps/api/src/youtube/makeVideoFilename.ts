import { existsSync } from "fs";
import { join } from "path";

export const makeVideoFilename = (path: string, name: string, ext: string) => {
  let counter = 1;
  const makeName = () =>
    `${join(path, name)}${counter > 1 ? ` (${counter})` : ""}.${ext}`;
  while (existsSync(makeName())) {
    counter++;
  }
  return makeName();
};
