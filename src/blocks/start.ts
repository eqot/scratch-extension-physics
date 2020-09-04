import BlockType from 'scratch-vm/src/extension-support/block-type'

import { translations } from '../translations'

const StartBlock = {
  info: () => ({
    opcode: 'start',
    blockType: BlockType.COMMAND,
    text: translations.label('start'),
  }),

  start(): void {
    this.targets.start()
  },
}

export default StartBlock
