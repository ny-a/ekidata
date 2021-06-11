class Prefecture {
  pref_cd: number
  pref_name: string

  constructor(row: string[]) {
    this.pref_cd = parseInt(row[0])
    this.pref_name = row[1]
  }

  static createFromRow(row: string[]): Prefecture | undefined {
    if (row[0] === 'pref_cd') {
      return undefined
    } else {
      return new Prefecture(row)
    }
  }
}

class RailwayCompany {
  company_cd: number
  rr_cd: number
  company_name: string
  company_name_k: string
  company_name_h: string
  company_name_r: string
  company_url: string
  company_type: number
  e_status: number
  e_sort: number

  constructor(row: string[]) {
    this.company_cd = parseInt(row[0])
    this.rr_cd = parseInt(row[1])
    this.company_name = row[2]
    this.company_name_k = row[3]
    this.company_name_h = row[4]
    this.company_name_r = row[5]
    this.company_url = row[6]
    this.company_type = parseInt(row[7])
    this.e_status = parseInt(row[8])
    this.e_sort = parseInt(row[9])
  }

  static createFromRow(row: string[]): RailwayCompany | undefined {
    if (row[0] === 'company_cd') {
      return undefined
    } else {
      return new RailwayCompany(row)
    }
  }
}

class RailwayLine {
  line_cd: number
  company_cd: number
  line_name: string
  line_name_k: string
  line_name_h: string
  line_color_c: string
  line_color_t: string
  line_type: number
  lon: number
  lat: number
  zoom: number
  e_status: number
  e_sort: number

  constructor(row: string[]) {
    this.line_cd = parseInt(row[0])
    this.company_cd = parseInt(row[1])
    this.line_name = row[2]
    this.line_name_k = row[3]
    this.line_name_h = row[4]
    this.line_color_c = row[5]
    this.line_color_t = row[6]
    this.line_type = parseInt(row[7])
    this.lon = parseFloat(row[8])
    this.lat = parseFloat(row[9])
    this.zoom = parseInt(row[10])
    this.e_status = parseInt(row[11])
    this.e_sort = parseInt(row[12])
  }

  static createFromRow(row: string[]): RailwayLine | undefined {
    if (row[0] === 'line_cd') {
      return undefined
    } else {
      return new RailwayLine(row)
    }
  }

  static readonly sort = (a: RailwayLine, b: RailwayLine): number => {
    if (a.e_sort === b.e_sort) {
      return a.line_cd - b.line_cd
    } else {
      return a.e_sort - b.e_sort
    }
  }
}

class RailwayStation {
  station_cd: number
  station_g_cd: number
  station_name: string
  station_name_k: string
  station_name_r: string
  line_cd: number
  pref_cd: number
  post: string
  address: string
  lon: number
  lat: number
  open_ymd: string
  close_ymd: string
  e_status: number
  e_sort: number

  constructor(row: string[]) {
    this.station_cd = parseInt(row[0])
    this.station_g_cd = parseInt(row[1])
    this.station_name = row[2]
    this.station_name_k = row[3]
    this.station_name_r = row[4]
    this.line_cd = parseInt(row[5])
    this.pref_cd = parseInt(row[6])
    this.post = row[7]
    this.address = row[8]
    this.lon = parseFloat(row[9])
    this.lat = parseFloat(row[10])
    this.open_ymd = row[11]
    this.close_ymd = row[12]
    this.e_status = parseInt(row[13])
    this.e_sort = parseInt(row[14])
  }

  static createFromRow(row: string[]): RailwayStation | undefined {
    if (row[0] === 'station_cd') {
      return undefined
    } else {
      return new RailwayStation(row)
    }
  }

  static readonly sort = (a: RailwayStation, b: RailwayStation): number => {
    if (a.e_sort === b.e_sort) {
      return a.station_cd - b.station_cd
    } else {
      return a.e_sort - b.e_sort
    }
  }

  static readonly sortByStationCd = (
    a: RailwayStation,
    b: RailwayStation
  ): number => {
    return a.station_cd - b.station_cd
  }
}

class RailwayStationJoin {
  line_cd: number
  station_cd1: number
  station_cd2: number

  constructor(row: string[]) {
    this.line_cd = parseInt(row[0])
    this.station_cd1 = parseInt(row[1])
    this.station_cd2 = parseInt(row[2])
  }

  static createFromRow(row: string[]): RailwayStationJoin | undefined {
    if (row[0] === 'line_cd') {
      return undefined
    } else {
      return new RailwayStationJoin(row)
    }
  }
}

export {
  Prefecture,
  RailwayCompany,
  RailwayLine,
  RailwayStation,
  RailwayStationJoin
}
