export class Scratch {
  public static Canvas = {
    WIDTH: 480,
    HEIGHT: 360,
  }

  static directionFrom(direction: number): number {
    return ((direction - 90) * Math.PI) / 180
  }

  static directionTo(direction: number): number {
    return (direction * 180) / Math.PI + 90
  }
}
