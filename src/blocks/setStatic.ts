import BlockType from 'scratch-vm/src/extension-support/block-type'
import ArgumentType from 'scratch-vm/src/extension-support/argument-type'

import { BlockInfo } from './index'
import { translations } from '../translations'

const SetStaticBlock = {
  info(): BlockInfo {
    return {
      opcode: 'setStatic',
      blockType: BlockType.COMMAND,
      text: translations.label('set static'),
      arguments: {
        STATIC: {
          type: ArgumentType.STRING,
          menu: 'static',
        },
      },
    }
  },

  menus(): object {
    return {
      static: {
        items: [
          {
            value: 'static',
            text: translations.label('static'),
          },
          {
            value: 'dynamic',
            text: translations.label('dynamic'),
          },
        ],
        acceptReporters: true,
      },
    }
  },

  setStatic(args: any, util): void {
    const isStatic = args.STATIC === 'static'

    const body = this.targets.getBody(util.target)
    body.isStatic = isStatic
  },
}

export default SetStaticBlock
