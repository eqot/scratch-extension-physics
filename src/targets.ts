import Runtime from 'scratch-vm/src/engine/runtime'
import RenderedTarget from 'scratch-vm/src/sprites/rendered-target'

import { Physics } from './physics'
import { Scratch } from './scratch'

export class Targets {
  private runtime: Runtime

  private physics: Physics
  private bodies = new Map<string, Body>()
  private draggingTarget?: RenderedTarget

  constructor(runtime, physics) {
    this.runtime = runtime
    this.physics = physics
  }

  activateAll(): void {
    for (const target of this.runtime.targets) {
      this.activate(target)
    }
  }

  activate(target: RenderedTarget): void {
    const body = this.createBody(target)
    if (!body) {
      return
    }

    this.add(target.id, body)
  }

  private createBody(target: RenderedTarget): Body {
    if (target.isStage || this.bodies.has(target.id)) {
      return
    }

    const drawable = this.runtime.renderer._allDrawables[target.drawableID]
    if (!drawable || !drawable.getVisible()) {
      return
    }

    if (drawable.needsConvexHullPoints()) {
      const points = this.runtime.renderer._getConvexHullPointsForDrawable(target.drawableID)
      drawable.setConvexHullPoints(points)
    }

    const [positionX, positionY] = drawable._position
    const direction = Scratch.directionFrom(drawable._direction)
    const [offsetX, offsetY] = drawable.skin.rotationCenter
    const [scaleX, scaleY] = drawable.scale.map(value => value / 100)

    const vertices = drawable._convexHullPoints.map(([x, y]) => [
      (x - offsetX) * scaleX,
      (y - offsetY) * scaleY,
    ])

    return this.physics.createBody(positionX, -positionY, vertices, direction)
  }

  private add(targetId: string, body: Body): void {
    this.physics.addBody(body)

    this.bodies.set(targetId, body)
  }

  private remove(targetId: string): void {
    const body = this.bodies.get(targetId)
    this.physics.removeBody(body)

    this.bodies.delete(targetId)
  }

  start(): void {
    this.physics.start(() => this.update())
  }

  stop(): void {
    this.physics.stop()
  }

  private update(): void {
    for (const [targetId, body] of this.bodies.entries()) {
      const target = this.runtime.getTargetById(targetId)
      if (target) {
        if (target.dragging) {
          this.draggingTarget = target
        } else {
          if (this.draggingTarget && this.draggingTarget.id === target.id) {
            this.updateBodyFromRenderedTarget(body, target)

            this.draggingTarget = null
          } else {
            this.updateRenderedTargetFromBody(target, body)
          }
        }
      } else {
        this.remove(targetId)
      }
    }
  }

  private updateBodyFromRenderedTarget(body: Body, target: RenderedTarget): void {
    const { x, y } = target
    const direction = Scratch.directionFrom(target.direction)

    this.physics.setBodyProperties(body, x, -y, direction)
  }

  private updateRenderedTargetFromBody(target: RenderedTarget, body: Body): void {
    const { x, y } = body.position
    const direction = Scratch.directionTo(body.angle)

    target.setXY(x, -y)
    target.setDirection(direction)
  }

  getBody(target: RenderedTarget): Body | undefined {
    return this.bodies.get(target.id)
  }
}
