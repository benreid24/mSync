import { existsSync } from "fs";
import { join } from "path";

const sanitize = (name: string) => {
  return name.replace(/[\/\?<>\\:\*\|":]/g, "").trim();
};

export const makeVideoFilename = (path: string, name: string, ext: string) => {
  let counter = 1;
  const makeName = () => {
    const base = sanitize(`${name}${counter > 1 ? ` (${counter})` : ""}.${ext}`);
    return join(path, base);
  };
  while (existsSync(makeName())) {
    counter++;
  }
  return makeName();
};
