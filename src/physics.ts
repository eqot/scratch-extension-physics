import { Engine, Render, Runner, World, Bodies, Body, Bounds, Events } from 'matter-js'
import decomp from 'poly-decomp'

// Set poly-decomp to global variable for matter.js
window.decomp = decomp

const debugEnabled = true

enum State {
  STOP,
  RUNNING,
}

export class Physics {
  private static Boundary = {
    LENGTH: 1000,
    THICKNESS: 10,
  }

  private state: State = State.STOP

  private engine: Engine
  private runner: Runner
  private render: Render

  private listener?: () => void

  constructor(canvas: HTMLCanvasElement) {
    this.initialize(canvas)
  }

  private initialize(canvas: HTMLCanvasElement) {
    this.engine = Engine.create()
    this.runner = Runner.create()

    const xMax = canvas.width / 2
    const yMax = canvas.height / 2

    const bounds = Bounds.create([
      { x: -xMax, y: -yMax },
      { x: xMax, y: yMax },
    ])

    this.render = Render.create({
      engine: this.engine,
      canvas,
      bounds,
      options: {
        width: canvas.width,
        height: canvas.height,
        hasBounds: true,
      },
    })

    // Add boundaries
    const bottom = this.createBoundary(0, yMax, Physics.Boundary.LENGTH, Physics.Boundary.THICKNESS)
    const left = this.createBoundary(-xMax, 0, Physics.Boundary.THICKNESS, Physics.Boundary.LENGTH)
    const right = this.createBoundary(xMax, 0, Physics.Boundary.THICKNESS, Physics.Boundary.LENGTH)
    World.add(this.engine.world, [bottom, left, right])
  }

  private createBoundary(x: number, y: number, width: number, height: number): Body {
    const modifiedX = x + (Math.sign(x) * width) / 2
    const modifiedY = y + (Math.sign(y) * height) / 2

    return Bodies.rectangle(modifiedX, modifiedY, width, height, { isStatic: true })
  }

  addBody(x: number, y: number, vertices, angle: number): Body {
    // Remove duplicate points to create body as expected
    decomp.removeDuplicatePoints(vertices, 0.01)

    // Convert array into object for matter.js
    const xyVertices = vertices.map(([x, y]) => ({ x, y }))

    const body = Bodies.fromVertices(x, y, xyVertices, { angle })
    if (!body) {
      return
    }

    World.add(this.engine.world, body)

    return body
  }

  removeBody(body: Body): void {
    World.remove(this.engine.world, body)
  }

  start(listener: () => void): void {
    if (this.state === State.RUNNING) {
      return
    }
    this.state = State.RUNNING

    this.listener = listener

    Runner.run(this.engine)
    if (debugEnabled) {
      Render.run(this.render)
    }

    if (this.listener) {
      Events.on(this.engine, 'afterTick', this.listener)
    }
  }

  stop(): void {
    if (this.state === State.STOP) {
      return
    }
    this.state = State.STOP

    Runner.stop(this.runner)
    if (debugEnabled) {
      Render.stop(this.render)
    }

    if (this.listener) {
      Events.off(this.engine, 'afterTick', this.listener)

      this.listener = null
    }
  }
}
