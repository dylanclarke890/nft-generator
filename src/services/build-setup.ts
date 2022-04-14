import { existsSync, mkdirSync, rmdirSync, rmSync } from "fs";
import { generalSettings, gif } from "../constants/config";

const buildDir = generalSettings.buildDirectory;
const gifDir = `${buildDir}/gifs`;
const jsonDir = `${buildDir}/json`;
const imageDir = `${buildDir}/images`;
const pixelImageDir = `${buildDir}/pixel-images`;
const recursive = true;

export function generateBuildSetup() {
  if (existsSync(buildDir)) rmSync(buildDir, { recursive });
  mkdirSync(buildDir);
  if (gif.export) mkdirSync(gifDir);
  mkdirSync(imageDir);
  mkdirSync(jsonDir);
}

export function generateMetaDataBuildSetup() {
  if (existsSync(jsonDir)) rmdirSync(jsonDir, { recursive });
  mkdirSync(jsonDir);
}

export function pixelateBuildSetup() {
  if (existsSync(pixelImageDir)) rmdirSync(pixelImageDir, { recursive });
  mkdirSync(pixelImageDir);
}
