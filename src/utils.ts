import queryString from 'query-string'

export class Utils {
  static isDebug(): boolean {
    return queryString.parse(location.search).debug === 'true'
  }
}
