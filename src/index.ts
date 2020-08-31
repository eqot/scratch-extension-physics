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

  private bodies = new Map()

  constructor(runtime: Runtime) {
    this.runtime = runtime

    const canvas = this.getCanvas(Scratch.Canvas.WIDTH, Scratch.Canvas.HEIGHT)

    this.physics = new Physics(canvas)
  }

  private getCanvas(width: number, height: number): HTMLCanvasElement {
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
    if (target.isStage || this.bodies.has(target.drawableID)) {
      return
    }

    const { renderer } = this.runtime
    // console.log(target)

    const drawable = renderer._allDrawables[target.drawableID]

    if (drawable.needsConvexHullPoints()) {
      const points = renderer._getConvexHullPointsForDrawable(target.drawableID)
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

    const body = this.physics.addBody(positionX, -positionY, vertices, direction)

    this.bodies.set(target.drawableID, { body, target })
  }

  start(): void {
    this.physics.start(() => this.updateRenderedTarget())
  }

  stop(): void {
    this.physics.stop()
  }

  private updateRenderedTarget(): void {
    for (const [id, { body, target }] of this.bodies.entries()) {
      const t = this.runtime.getTargetById(target.id)
      if (!t) {
        this.physics.removeBody(body)
        continue
      }

      const { x, y } = body.position
      const direction = Scratch.directionTo(body.angle)

      target.setXY(x, -y)
      target.setDirection(direction)
    }
  }
}

export default PhysicsExtension
