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

    this.physics = new Physics()
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
          text: 'このスプライトで有効にする',
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
    }
  }

  activate(args: any, util): void {
    const { target } = util
    const { renderer } = this.runtime
    // console.log(target)

    const drawable = renderer._allDrawables[target.drawableID]

    if (drawable.needsConvexHullPoints()) {
      const points = renderer._getConvexHullPointsForDrawable(target.drawableID)
      drawable.setConvexHullPoints(points)
    }

    const [positionX, positionY] = drawable._position
    const direction = drawable._direction
    const [offsetX, offsetY] = drawable.skin.rotationCenter
    const [scaleX, scaleY] = drawable.scale.map(value => value / 100)

    const vertices = drawable._convexHullPoints.map(([x, y]) => [
      (x - offsetX) * scaleX,
      (y - offsetY) * scaleY,
    ])

    const body = this.physics.addBody(positionX, -positionY, vertices, direction)

    this.bodies.set(drawable.id, { body, target })
  }

  start(): void {
    this.physics.start(() => this.updateRenderTarget())
  }

  stop(): void {
    this.physics.stop()
  }

  private updateRenderTarget(): void {
    for (const [id, { body, target }] of this.bodies.entries()) {
      const { x, y } = body.position
      const direction = Scratch.directionTo(body.angle)

      target.setXY(x, -y)
      target.setDirection(direction)
    }
  }
}

export default PhysicsExtension
