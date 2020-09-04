import Runtime from 'scratch-vm/src/engine/runtime'
import Cast from 'scratch-vm/src/util/cast'

import { Targets } from './targets'
import { Physics } from './physics'
import { Scratch } from './scratch'
import { translations } from './translations'
import { Utils } from './utils'

import { Blocks } from './blocks'

class PhysicsExtension {
  private runtime: Runtime
  private blocks

  private targets: Targets

  constructor(runtime: Runtime, locale?: string) {
    this.runtime = runtime
    this.runtime.on(Runtime.PROJECT_STOP_ALL, () => {
      this.stop()
    })

    translations.initialize(this.runtime, locale)

    this.blocks = Blocks()
    for (const funcName in this.blocks.funcs) {
      this[funcName] = this.blocks.funcs[funcName].bind(this)
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
