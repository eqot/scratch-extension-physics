import BlockType from 'scratch-vm/src/extension-support/block-type'

import { BlockInfo } from './index'
import { translations } from '../translations'

const StopBlock = {
  info(): BlockInfo {
    return {
      opcode: 'stop',
      blockType: BlockType.COMMAND,
      text: translations.label('stop'),
    }
  },

  stop(): void {
    this.targets.stop()
  },
}

export default StopBlock
