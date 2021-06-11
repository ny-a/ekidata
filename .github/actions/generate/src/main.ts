import * as core from '@actions/core'
import * as fs from 'fs'
import {
  Prefecture,
  RailwayLine,
  RailwayStation,
  RailwayStationJoin
} from './classes'
import {getJoins, getLines, getPrefs, getStations} from './csvReader'
import {create as createXml} from 'xmlbuilder2'

async function generatePref(
  prefs: Prefecture[],
  stations: RailwayStation[],
  lines: RailwayLine[]
): Promise<void> {
  const outputDir = './public/api/p'

  fs.mkdirSync(outputDir, {recursive: true})

  for (const pref of prefs) {
    const pref_cd = pref.pref_cd

    const matchingStations = stations.filter(
      station => station.pref_cd === pref_cd
    )
    const lineCodes = new Set(matchingStations.map(station => station.line_cd))
    const matchingLines = lines
      .filter(line => lineCodes.has(line.line_cd) && line.e_status === 0)
      .sort(RailwayLine.sort)

    const linesInPref = matchingLines.map(line => {
      const line_cd = line.line_cd
      const line_name = line.line_name
      return {line_cd, line_name}
    })

    const json = {line: linesInPref}

    const xmlObject = {
      ekidata: {
        '@version': 'ekidata.jp pref api 1.0',
        pref: {
          code: pref_cd,
          name: pref.pref_name
        },
        line: linesInPref
      }
    }

    const xml = createXml(xmlObject).dec({encoding: 'UTF-8'})

    fs.writeFileSync(`${outputDir}/${pref_cd}.json`, JSON.stringify(json))
    fs.writeFileSync(
      `${outputDir}/${pref_cd}.xml`,
      xml.end({prettyPrint: true})
    )

    core.debug(`Prefecture ${pref_cd} generated.`)
  }
}

async function generateLine(
  lines: RailwayLine[],
  stations: RailwayStation[]
): Promise<void> {
  const outputDir = './public/api/l'

  fs.mkdirSync(outputDir, {recursive: true})

  const activeLines = lines
    .filter(line => line.e_status === 0)
    .sort(RailwayLine.sort)

  for (const line of activeLines) {
    const line_cd = line.line_cd

    const matchingStations = stations
      .filter(station => station.e_status === 0 && station.line_cd === line_cd)
      .sort(RailwayStation.sort)

    const station_l = matchingStations.map(station => {
      const station_cd = station.station_cd
      const station_g_cd = station.station_g_cd
      const station_name = station.station_name
      const lon = station.lon
      const lat = station.lat
      return {station_cd, station_g_cd, station_name, lon, lat}
    })

    const json = {
      line_cd,
      line_name: line.line_name,
      line_lon: line.lon,
      line_lat: line.lat,
      line_zoom: line.zoom,
      station_l
    }

    const xmlObject = {
      ekidata: {
        '@version': 'ekidata.jp line api 1.0',
        line: {
          line_cd,
          line_name: line.line_name,
          line_lon: line.lon,
          line_lat: line.lat,
          line_zoom: line.zoom
        },
        station: station_l
      }
    }

    const xml = createXml(xmlObject).dec({encoding: 'UTF-8'})

    fs.writeFileSync(`${outputDir}/${line_cd}.json`, JSON.stringify(json))
    fs.writeFileSync(
      `${outputDir}/${line_cd}.xml`,
      xml.end({prettyPrint: true})
    )

    core.debug(`RailwayLine ${line_cd} generated.`)
  }
}

async function generateStation(
  stations: RailwayStation[],
  lines: RailwayLine[]
): Promise<void> {
  const outputDir = './public/api/s'

  fs.mkdirSync(outputDir, {recursive: true})

  const activeStations = stations
    .filter(station => station.e_status === 0)
    .sort(RailwayStation.sortByStationCd)

  for (const station of activeStations) {
    const station_cd = station.station_cd
    const line_cd = station.line_cd
    const matchingLine = lines.find(line => line.line_cd === line_cd)

    const stationOutput = {
      pref_cd: station.pref_cd,
      line_cd,
      line_name: matchingLine?.line_name,
      station_cd,
      station_g_cd: station.station_g_cd,
      station_name: station.station_name,
      lon: station.lon,
      lat: station.lat
    }

    const json = {station: [stationOutput]}

    const xmlObject = {
      ekidata: {
        '@version': 'ekidata.jp station api 1.0',
        station: stationOutput
      }
    }

    const xml = createXml(xmlObject).dec({encoding: 'UTF-8'})

    fs.writeFileSync(`${outputDir}/${station_cd}.json`, JSON.stringify(json))
    fs.writeFileSync(
      `${outputDir}/${station_cd}.xml`,
      xml.end({prettyPrint: true})
    )

    core.debug(`RailwayStation ${station_cd} generated.`)
  }
}
async function generateGroup(
  stations: RailwayStation[],
  lines: RailwayLine[]
): Promise<void> {
  const outputDir = './public/api/g'

  fs.mkdirSync(outputDir, {recursive: true})

  const activeStations = stations
    .filter(station => station.e_status === 0)
    .sort(RailwayStation.sortByStationCd)

  for (const thisStation of activeStations) {
    const station_cd = thisStation.station_cd
    const line_cd = thisStation.line_cd
    const thisStationLine = lines.find(line => line.line_cd === line_cd)

    const stationOutput = {
      line_cd,
      line_name: thisStationLine?.line_name,
      station_cd,
      station_g_cd: thisStation.station_g_cd,
      station_name: thisStation.station_name,
      lon: thisStation.lon,
      lat: thisStation.lat
    }

    const groupedStations = stations
      .filter(
        station =>
          station.e_status === 0 &&
          station.station_g_cd === thisStation.station_g_cd
      )
      .sort(RailwayStation.sort)

    const station_g = groupedStations.map(station => {
      const groupedStationLine = lines.find(line => line.line_cd === station.line_cd)
      return {
        pref_cd: station.pref_cd,
        line_cd: station.line_cd,
        line_name: groupedStationLine?.line_name,
        station_cd: station.station_cd,
        station_name: station.station_name
      }
    })

    const json = {station_g}

    const xmlObject = {
      ekidata: {
        '@version': 'ekidata.jp station api 1.0',
        station: stationOutput,
        station_g
      }
    }

    const xml = createXml(xmlObject).dec({encoding: 'UTF-8'})

    fs.writeFileSync(`${outputDir}/${station_cd}.json`, JSON.stringify(json))
    fs.writeFileSync(
      `${outputDir}/${station_cd}.xml`,
      xml.end({prettyPrint: true})
    )

    core.debug(`RailwayStation group ${station_cd} generated.`)
  }
}
async function generateConnectedStation(
  lines: RailwayLine[],
  joins: RailwayStationJoin[],
  stations: RailwayStation[]
): Promise<void> {
  const outputDir = './public/api/n'

  fs.mkdirSync(outputDir, {recursive: true})

  const activeLines = lines
    .filter(line => line.e_status === 0)
    .sort(RailwayLine.sort)

  for (const line of activeLines) {
    const line_cd = line.line_cd

    const matchingJoins = joins.filter(join => join.line_cd === line_cd)

    const station_join = matchingJoins.map(join => {
      const station1 = stations.find(
        station => station.station_cd === join.station_cd1
      )
      const station2 = stations.find(
        station => station.station_cd === join.station_cd2
      )

      return {
        station_cd1: join.station_cd1,
        station_cd2: join.station_cd2,
        station_name1: station1?.station_name,
        lat1: station1?.lat,
        lon1: station1?.lon,
        station_name2: station2?.station_name,
        lat2: station2?.lat,
        lon2: station2?.lon
      }
    })

    const json = {station_join}

    const xmlObject = {
      ekidata: {
        '@version': 'ekidata.jp station_join api 1.0',
        station_join
      }
    }

    const xml = createXml(xmlObject).dec({encoding: 'UTF-8'})

    fs.writeFileSync(`${outputDir}/${line_cd}.json`, JSON.stringify(json))
    fs.writeFileSync(
      `${outputDir}/${line_cd}.xml`,
      xml.end({prettyPrint: true})
    )

    core.debug(`RailwayStationJoin ${line_cd} generated.`)
  }
}

async function main(includeShinkansen = false): Promise<void> {
  const prefs = await getPrefs()
  const stations = await getStations(includeShinkansen)
  const lines = await getLines(includeShinkansen)
  const joins = await getJoins()

  await generatePref(prefs, stations, lines)
  await generateLine(lines, stations)
  await generateStation(stations, lines)
  await generateGroup(stations, lines)
  await generateConnectedStation(lines, joins, stations)
}

main()
