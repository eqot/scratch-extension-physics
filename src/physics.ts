import { Engine, Render, Runner, World, Bodies, Body, Bounds, Events } from 'matter-js'
import decomp from 'poly-decomp'

// Set poly-decomp to global variable for matter.js
window.decomp = decomp

enum State {
  STOP,
  RUNNING,
}

type Options = {
  isVisible?: boolean
}

export class Physics {
  private static Boundary = {
    LENGTH: 1000,
    THICKNESS: 100,
  }

  private state: State = State.STOP

  private engine: Engine
  private runner: Runner
  private render: Render

  private listener?: () => void

  private isVisible = false

  constructor(canvas: HTMLCanvasElement, options?: Options) {
    this.initialize(canvas)

    this.isVisible = options && options.isVisible
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

  public setGravity(gravityX: number, gravityY: number): void {
    this.engine.world.gravity.x = gravityX
    this.engine.world.gravity.y = gravityY
  }

  createBody(x: number, y: number, vertices, angle: number): Body {
    // Remove duplicate points to create body as expected
    decomp.removeDuplicatePoints(vertices, 0.01)

    // Convert array into object for matter.js
    const xyVertices = vertices.map(([x, y]) => ({ x, y }))

    return Bodies.fromVertices(x, y, xyVertices, { angle })
  }

  addBody(body: Body): void {
    World.add(this.engine.world, body)
  }

  removeBody(body: Body): void {
    World.remove(this.engine.world, body)
  }

  setBodyProperties(body: Body, x: number, y: number, angle: number): void {
    Body.setPosition(body, { x, y })
    Body.setAngle(body, angle)
  }

  start(listener: () => void): void {
    if (this.state === State.RUNNING) {
      return
    }
    this.state = State.RUNNING

    this.listener = listener

    Runner.start(this.runner, this.engine)

    if (this.isVisible) {
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

    if (this.isVisible) {
      Render.stop(this.render)
    }

    if (this.listener) {
      Events.off(this.engine, 'afterTick', this.listener)

      this.listener = null
    }
  }
}
