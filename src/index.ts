import Runtime from 'scratch-vm/src/engine/runtime'
import ArgumentType from 'scratch-vm/src/extension-support/argument-type'
import BlockType from 'scratch-vm/src/extension-support/block-type'
import Cast from 'scratch-vm/src/util/cast'
import RenderedTarget from 'scratch-vm/src/sprites/rendered-target'

import { Physics } from './physics'
import { Scratch } from './scratch'

class PhysicsExtension {
  private runtime: Runtime

  private physics: Physics

  private bodies = new Map<string, Body>()

  private physicsCanvas: HTMLCanvasElement
  private dragCanvas: HTMLCanvasElement

  constructor(runtime: Runtime) {
    this.runtime = runtime

    this.physicsCanvas = this.getCanvasForPhysics(Scratch.Canvas.WIDTH, Scratch.Canvas.HEIGHT)
    this.dragCanvas = document.querySelector('canvas[class^=stage_dragging-sprite]')

    // this.physics = new Physics(this.physicsCanvas, { isVisible: true })
    this.physics = new Physics(this.physicsCanvas)

    this.runtime.on(Runtime.PROJECT_STOP_ALL, () => {
      this.stop()
    })
  }

  private getCanvasForPhysics(width: number, height: number): HTMLCanvasElement {
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

  getInfo() {
    return {
      id: 'physics',
      name: 'Physics',
      menuIconURI: require('../assets/images/menuIcon.svg'),
      blockIconURI: require('../assets/images/blockIcon.svg'),
      color1: '#a0a0a0',
      color2: '#808080',
      color3: '#606060',

      blocks: [
        {
          opcode: 'activate',
          blockType: BlockType.COMMAND,
          text: '[TARGET] で有効にする',
          arguments: {
            TARGET: {
              type: ArgumentType.STRING,
              menu: 'activationTarget',
            },
          },
        },
        {
          opcode: 'start',
          blockType: BlockType.COMMAND,
          text: '開始する',
        },
        {
          opcode: 'stop',
          blockType: BlockType.COMMAND,
          text: '停止する',
        },
      ],

      menus: {
        activationTarget: {
          acceptReporters: true,
          items: [
            {
              value: 'allSprites',
              text: 'すべてのスプライト',
            },
            {
              value: 'thisSprite',
              text: 'このスプライト',
            },
          ],
        },
      },
    }
  }

  activate(args: any, util): void {
    switch (args.TARGET) {
      case 'thisSprite':
        this.activateRenderedTarget(util.target)
        break

      case 'allSprites':
        for (const target of this.runtime.targets) {
          this.activateRenderedTarget(target)
        }
        break

      default:
        break
    }
  }

  private activateRenderedTarget(target: RenderedTarget): void {
    const body = this.createBody(target)
    if (!body) {
      return
    }

    this.addRenderedTarget(target.id, body)
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

  private addRenderedTarget(targetId: string, body: Body): void {
    this.physics.addBody(body)

    this.bodies.set(targetId, body)
  }

  private removeRenderedTarget(targetId: string): void {
    const body = this.bodies.get(targetId)
    this.physics.removeBody(body)

    this.bodies.delete(targetId)
  }

  private updateRenderedTarget(): void {
    for (const [targetId, body] of this.bodies.entries()) {
      const target = this.runtime.getTargetById(targetId)
      if (!target) {
        this.removeRenderedTarget(targetId)

        continue
      }

      if (target.dragging) {
        const position = this.dragCanvas.style.transform
          .match(/[\d\.]+/g)
          .map(value => parseFloat(value))

        const x = position[0] - Scratch.Canvas.WIDTH / 2
        const y = position[1] - Scratch.Canvas.HEIGHT / 2
        const direction = Scratch.directionFrom(target.direction)

        this.physics.setBodyProperties(body, x, y, direction)
      } else {
        if (!target.visible) {
          continue
        }

        const { x, y } = body.position
        const direction = Scratch.directionTo(body.angle)
        target.setXY(x, -y)
        target.setDirection(direction)
      }
    }
  }

  start(): void {
    this.physics.start(() => this.updateRenderedTarget())
  }

  stop(): void {
    this.physics.stop()
  }
}

export default PhysicsExtension
