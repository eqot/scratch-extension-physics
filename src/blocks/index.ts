const BLOCKS = ['activate', 'start', 'stop']

const blocks = BLOCKS.map(block => require(`./${block}.ts`).default).reduce(
  (acc, block) => {
    const { info, menus, ...funcs } = block

    return {
      info: acc.info.concat(info),
      menus: acc.menus.concat(menus),
      funcs: Object.assign(acc.funcs, funcs),
    }
  },
  { info: [], menus: [], funcs: {} }
)

const Blocks = () => ({
  info: () => blocks.info.map(info => info()),
  menus: () =>
    blocks.menus.reduce((acc, menus) => {
      return menus ? Object.assign(acc, menus()) : acc
    }, {}),
  funcs: blocks.funcs,
})

export { Blocks }
