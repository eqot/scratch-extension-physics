import Runtime from 'scratch-vm/src/engine/runtime'

import { Blocks } from './blocks'
import { Targets } from './targets'
import { Physics } from './physics'
import { Scratch } from './scratch'
import { Utils } from './utils'
import { translations } from './translations'

class PhysicsExtension {
  private static BLOCKS_ORDER = ['activate', 'start', 'stop']

  private runtime: Runtime
  private blocks

  private targets: Targets

  constructor(runtime: Runtime, locale?: string) {
    this.runtime = runtime
    this.runtime.on(Runtime.PROJECT_STOP_ALL, () => {
      this.stop()
    })

    translations.initialize(this.runtime, locale)

    this.blocks = Blocks(PhysicsExtension.BLOCKS_ORDER)
    for (const functionName in this.blocks.functions) {
      this[functionName] = this.blocks.functions[functionName].bind(this)
    }

    const canvas = Utils.getCanvasForPhysics(Scratch.Canvas.WIDTH, Scratch.Canvas.HEIGHT)
    const physics = new Physics(canvas, { isVisible: Utils.isDebug() })

    this.targets = new Targets(this.runtime, physics)
  }

  getInfo() {
    return {
      id: 'physics',
      name: translations.label('Physics'),
      menuIconURI: require('../assets/images/menuIcon.svg'),
      blockIconURI: require('../assets/images/blockIcon.svg'),
      color1: '#a0a0a0',
      color2: '#808080',
      color3: '#606060',

      blocks: this.blocks.info(),
      menus: this.blocks.menus(),
    }
  }
}

export default PhysicsExtension
