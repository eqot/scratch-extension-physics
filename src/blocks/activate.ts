import ArgumentType from 'scratch-vm/src/extension-support/argument-type'
import BlockType from 'scratch-vm/src/extension-support/block-type'

import { BlockInfo } from './index'
import { translations } from '../translations'

const ActivateBlock = {
  info(): BlockInfo {
    return {
      opcode: 'activate',
      blockType: BlockType.COMMAND,
      text: translations.label('activate'),
      arguments: {
        TARGET: {
          type: ArgumentType.STRING,
          menu: 'activationTarget',
        },
      },
    }
  },

  menus(): object {
    return {
      activationTarget: {
        items: [
          {
            value: 'allSprites',
            text: translations.label('all sprites'),
          },
          {
            value: 'thisSprite',
            text: translations.label('this sprite'),
          },
        ],
        acceptReporters: true,
      },
    }
  },

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
  },
}

export default ActivateBlock
