import BlockType from 'scratch-vm/src/extension-support/block-type'
import ArgumentType from 'scratch-vm/src/extension-support/argument-type'
import Cast from 'scratch-vm/src/util/cast'

import { BlockInfo } from './index'
import { translations } from '../translations'

const SetConstraintBlock = {
  info(): BlockInfo {
    return {
      opcode: 'setConstraint',
      blockType: BlockType.COMMAND,
      text: translations.label('set constraint'),
      arguments: {
        X: {
          type: ArgumentType.NUMBER,
          defaultValue: 0,
        },
        Y: {
          type: ArgumentType.NUMBER,
          defaultValue: 0,
        },
        STIFFNESS: {
          type: ArgumentType.NUMBER,
          defaultValue: 0.02,
        },
        LENGTH: {
          type: ArgumentType.NUMBER,
          defaultValue: 50,
        },
      },
    }
  },

  setConstraint(args: any, util): void {
    const x = Cast.toNumber(args.X)
    const y = Cast.toNumber(args.Y)
    const stiffness = Cast.toNumber(args.STIFFNESS)
    const length = Cast.toNumber(args.LENGTH)

    const body = this.targets.getBody(util.target)

    this.physics.setConstraint(body, x, -y, stiffness, length)
  },
}

export default SetConstraintBlock
