import {createReadStream} from 'fs'
import {createInterface, Interface} from 'readline'
import {
  Prefecture,
  RailwayCompany,
  RailwayLine,
  RailwayStation,
  RailwayStationJoin
} from './classes'

const csvDirName = './csvs'

function createReadLineInterface(filename: string): Interface {
  const stream = createReadStream(filename, {
    encoding: 'utf8'
  })

  return createInterface({
    input: stream
  })
}

async function getPrefs(): Promise<Prefecture[]> {
  const readLine = createReadLineInterface(`${csvDirName}/pref.csv`)

  const prefs: Prefecture[] = []
  for await (const rowString of readLine) {
    const row = rowString.split(',')
    const prefecture = Prefecture.createFromRow(row)
    if (prefecture !== undefined) {
      prefs.push(prefecture)
    }
  }

  return prefs
}

async function getLines(includeShinkansen = false): Promise<RailwayLine[]> {
  const readLine = createReadLineInterface(`${csvDirName}/line.csv`)

  const lines: RailwayLine[] = []
  for await (const rowString of readLine) {
    const row = rowString.split(',')
    const line = RailwayLine.createFromRow(row)
    if (
      line !== undefined &&
      (includeShinkansen || (line.line_cd > 10000 && line.line_type !== 1))
    ) {
      lines.push(line)
    }
  }

  return lines
}

async function getStations(
  includeShinkansen = false
): Promise<RailwayStation[]> {
  const readLine = createReadLineInterface(`${csvDirName}/station.csv`)

  const stations: RailwayStation[] = []
  for await (const rowString of readLine) {
    const row = rowString.split(',')
    const station = RailwayStation.createFromRow(row)
    if (
      station !== undefined &&
      (includeShinkansen || station.station_cd > 1000000)
    ) {
      stations.push(station)
    }
  }

  return stations
}

async function getCompanies(): Promise<RailwayCompany[]> {
  const readLine = createReadLineInterface(`${csvDirName}/company.csv`)

  const companies: RailwayCompany[] = []
  for await (const rowString of readLine) {
    const row = rowString.split(',')
    const company = RailwayCompany.createFromRow(row)
    if (company !== undefined) {
      companies.push(company)
    }
  }

  return companies
}

async function getJoins(): Promise<RailwayStationJoin[]> {
  const readLine = createReadLineInterface(`${csvDirName}/join.csv`)

  const joins: RailwayStationJoin[] = []
  for await (const rowString of readLine) {
    const row = rowString.split(',')
    const join = RailwayStationJoin.createFromRow(row)
    if (join !== undefined) {
      joins.push(join)
    }
  }

  return joins
}

export {getCompanies, getJoins, getLines, getPrefs, getStations}
