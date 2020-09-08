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

type Block = {
  info: any
  menus: any
  functions: any
}

const Separator = '---'

const Blocks = (blocksOrder: string[]) => {
  const blocks = blocksOrder.map(block => {
    if (isSeparator(block)) {
      return block
    }

    const { info, menus, ...functions } = require(`./${block}.ts`).default
    return { info, menus, functions }
  }) as Block[]

  const info = () => blocks.map(block => (isSeparator(block) ? block : block.info()))
  const menus = () =>
    blocks.reduce((acc, { menus }) => (menus ? Object.assign(acc, menus()) : acc), {})
  const functions = blocks.reduce((acc, { functions }) => Object.assign(acc, functions), {})

  return {
    info,
    menus,
    functions,

    inject(object: any): void {
      for (const functionName in functions) {
        object[functionName] = functions[functionName].bind(object)
      }
    },
  }
}

function isSeparator(block) {
  return block === Separator
}

export { Blocks }
