import BlockType from 'scratch-vm/src/extension-support/block-type'
import ArgumentType from 'scratch-vm/src/extension-support/argument-type'
import Cast from 'scratch-vm/src/util/cast'

import { BlockInfo } from './index'
import { translations } from '../translations'

const SetRestitutionBlock = {
  info(): BlockInfo {
    return {
      opcode: 'setGravity',
      blockType: BlockType.COMMAND,
      text: translations.label('set gravity'),
      arguments: {
        GRAVITY_X: {
          type: ArgumentType.NUMBER,
          defaultValue: 0,
        },
        GRAVITY_Y: {
          type: ArgumentType.NUMBER,
          defaultValue: 1,
        },
      },
    }
  },

  setGravity(args: any, util): void {
    const gravityX = Cast.toNumber(args.GRAVITY_X)
    const gravityY = Cast.toNumber(args.GRAVITY_Y)

    this.physics.setGravity(gravityX, gravityY)
  },
}

export default SetRestitutionBlock
