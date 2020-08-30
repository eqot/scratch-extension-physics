import Runtime from 'scratch-vm/src/engine/runtime'
import ArgumentType from 'scratch-vm/src/extension-support/argument-type'
import BlockType from 'scratch-vm/src/extension-support/block-type'
import Cast from 'scratch-vm/src/util/cast'
import RenderedTarget from 'scratch-vm/src/sprites/rendered-target'

import { Physics } from './physics'

class PhysicsExtension {
  private runtime: Runtime

  private physics: Physics
  private body: Body

  constructor(runtime: Runtime) {
    this.runtime = runtime

    this.physics = new Physics()
  }

  getInfo() {
    return {
      id: 'physics',
      name: 'Physics',
      menuIconURI: require('../assets/images/menuIcon.png'),
      blockIconURI: require('../assets/images/blockIcon.png'),
      color1: '#a0a0a0',
      color2: '#808080',
      color3: '#606060',

      blocks: [
        {
          opcode: 'activate',
          blockType: BlockType.COMMAND,
          text: 'activate',
        },
        {
          opcode: 'tick',
          blockType: BlockType.COMMAND,
          text: 'tick',
        },
      ],
    }
  }

  activate(args: any, util) {
    const { target } = util
    const { renderer } = this.runtime
    // console.log(target)

    const drawable = renderer._allDrawables[target.drawableID]
    // console.log(drawable)

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

    const body = this.physics.createBody(positionX, -positionY, vertices, direction)

    this.body = body
  }

  tick(args: any, util) {
    const { target } = util
    // const { renderer } = this.runtime

    const { x, y } = this.body.position
    const direction = (this.body.angle * 180) / Math.PI + 90

    target.setXY(x, -y)
    target.setDirection(direction)
  }
}

export default PhysicsExtension
