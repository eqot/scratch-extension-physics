import BlockType from 'scratch-vm/src/extension-support/block-type'
import ArgumentType from 'scratch-vm/src/extension-support/argument-type'
import Cast from 'scratch-vm/src/util/cast'

import { BlockInfo } from './index'
import { translations } from '../translations'

const SetRestitutionBlock = {
  info(): BlockInfo {
    return {
      opcode: 'setRestitution',
      blockType: BlockType.COMMAND,
      text: translations.label('set restitution'),
      arguments: {
        RESTITUTION: {
          type: ArgumentType.NUMBER,
          defaultValue: 1,
        },
      },
    }
  },

  setRestitution(args: any, util): void {
    const restitution = Cast.toNumber(args.RESTITUTION)

    const body = this.targets.getBody(util.target)
    body.restitution = restitution
  },
}

export default SetRestitutionBlock
