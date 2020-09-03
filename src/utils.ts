export class Utils {
  static getCanvasForPhysics(width: number, height: number): HTMLCanvasElement {
    const element = document.querySelector('canvas.physics') as HTMLCanvasElement
    if (element) {
      return element
    }

    const canvas = document.createElement('canvas')
    canvas.className = 'physics'
    canvas.width = width
    canvas.height = height
    canvas.style.zIndex = '100'
    canvas.style.position = 'absolute'
    canvas.style.bottom = '0px'
    canvas.style.left = '320px'

    document.body.prepend(canvas)

    return canvas
  }
}
