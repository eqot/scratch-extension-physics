import Runtime from 'scratch-vm/src/engine/runtime'
import ArgumentType from 'scratch-vm/src/extension-support/argument-type'
import BlockType from 'scratch-vm/src/extension-support/block-type'
import Cast from 'scratch-vm/src/util/cast'

import { Targets } from './targets'
import { Physics } from './physics'
import { Scratch } from './scratch'
import { Utils } from './utils'

class PhysicsExtension {
  private runtime: Runtime

  private targets: Targets

  constructor(runtime: Runtime) {
    this.runtime = runtime
    this.runtime.on(Runtime.PROJECT_STOP_ALL, () => {
      this.stop()
    })

    const canvas = Utils.getCanvasForPhysics(Scratch.Canvas.WIDTH, Scratch.Canvas.HEIGHT)
    const physics = new Physics(canvas, { isVisible: Utils.isDebug() })

    this.targets = new Targets(this.runtime, physics)
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
      case 'allSprites':
        this.targets.activateAll()
        break

      case 'thisSprite':
        this.targets.activate(util.target)
        break

      default:
        break
    }
  }

  start(): void {
    this.targets.start()
  }

  stop(): void {
    this.targets.stop()
  }
}

export default PhysicsExtension
