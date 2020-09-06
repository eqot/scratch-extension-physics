export type BlockInfo = {
  opcode: string
  blockType: string
  branchCount?: number
  terminal?: boolean
  blockAllThreads?: boolean
  text: string
  arguments?: object
  func?: string
  filter?: string[]
}

const Separator = '---'

const Blocks = (blocksOrder: string[]) => {
  const blocks = blocksOrder.map(block => {
    if (isSeparator(block)) {
      return block
    }

    const { info, menus, ...functions } = require(`./${block}.ts`).default
    return { info, menus, functions }
  })

  return {
    info: () => blocks.map(block => (isSeparator(block) ? block : block.info())),
    menus: () => blocks.reduce((acc, { menus }) => (menus ? Object.assign(acc, menus()) : acc), {}),
    functions: blocks.reduce((acc, { functions }) => Object.assign(acc, functions), {}),
  }
}

function isSeparator(block) {
  return block === Separator
}

export { Blocks }
