import Runtime from 'scratch-vm/src/engine/runtime'

import { Blocks } from './blocks'
import { Targets } from './targets'
import { Physics } from './physics'
import { Scratch } from './scratch'
import { Utils } from './utils'
import { translations } from './translations'

class PhysicsExtension {
  private static BLOCKS_ORDER = ['activate', 'start', 'stop', 'setGravity', '---', 'setRestitution']

  private runtime: Runtime
  private blocks

  private physics: Physics
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

    const canvas = this.getCanvasForPhysics(Scratch.Canvas.WIDTH, Scratch.Canvas.HEIGHT)
    this.physics = new Physics(canvas, { isVisible: Utils.isDebug() })

    this.targets = new Targets(this.runtime, this.physics)
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
