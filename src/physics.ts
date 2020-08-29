import { Engine, Render, World, Bodies, Bounds } from 'matter-js'
import decomp from 'poly-decomp'

window.decomp = decomp

export class Physics {
  private engine: Engine

  constructor() {
    const canvas = document.createElement('canvas')
    canvas.width = 480
    canvas.height = 360
    canvas.style.zIndex = '100'
    canvas.style.position = 'absolute'
    canvas.style.bottom = '0'
    document.body.prepend(canvas)

    this.engine = new Engine.create()

    const bounds = Bounds.create([
      { x: -240, y: -180 },
      { x: 240, y: -180 },
      { x: 240, y: 180 },
      { x: -240, y: 180 },
    ])

    const render = Render.create({
      canvas,
      engine: this.engine,
      width: 480,
      height: 360,
      bounds,
      options: {
        hasBounds: true,
      },
    })

    const ground = Bodies.rectangle(0, 185, 1000, 10, { isStatic: true })

    World.add(this.engine.world, ground)

    Engine.run(this.engine)

    Render.run(render)
  }

  createBody(x: number, y: number, vertices, angle: number): Body {
    const body = Bodies.fromVertices(x, y, vertices, { angle: ((angle - 90) * Math.PI) / 180 })
    // console.log(body)
    if (!body) {
      return
    }

    World.add(this.engine.world, body)

    return body
  }
}
