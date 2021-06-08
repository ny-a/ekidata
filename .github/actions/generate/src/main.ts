import * as core from '@actions/core'
import * as fs from 'fs'
import { createInterface } from "readline";


async function generatePref(): Promise<void> {
  const stream = fs.createReadStream(
    "./pref.csv",
    {
      encoding: "utf8",
    }
  );

  const readLine = createInterface({
    input: stream,
  });

  for await (const line of readLine) {
    core.debug(line)
  }
}

async function main(): Promise<void> {
  await generatePref()
}

main()