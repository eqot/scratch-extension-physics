import BlockType from 'scratch-vm/src/extension-support/block-type'

import { BlockInfo } from './index'
import { translations } from '../translations'

const RemoveConstraintBlock = {
  info(): BlockInfo {
    return {
      opcode: 'removeConstraint',
      blockType: BlockType.COMMAND,
      text: translations.label('remove constraint'),
    }
  },

  removeConstraint(args: any, util): void {
    const body = this.targets.getBody(util.target)

    this.physics.removeConstraint(body)
  },
}

export default RemoveConstraintBlock
