import BlockType from 'scratch-vm/src/extension-support/block-type'
import ArgumentType from 'scratch-vm/src/extension-support/argument-type'
import Cast from 'scratch-vm/src/util/cast'

import { BlockInfo } from './index'
import { translations } from '../translations'

const SetSpritePropertyBlock = {
  info(): BlockInfo {
    return {
      opcode: 'setSpriteProperty',
      blockType: BlockType.COMMAND,
      text: translations.label('set sprite property'),
      arguments: {
        PROPERTY: {
          type: ArgumentType.STRING,
          menu: 'property',
        },
        VALUE: {
          type: ArgumentType.NUMBER,
          defaultValue: 0,
        },
      },
    }
  },

  menus(): object {
    return {
      property: {
        items: [
          {
            value: 'restitution',
            text: translations.label('restitution'),
          },
          {
            value: 'density',
            text: translations.label('density'),
          },
          {
            value: 'mass',
            text: translations.label('mass'),
          },
        ],
        acceptReporters: true,
      },
    }
  },

  setSpriteProperty(args: any, util): void {
    const value = Cast.toNumber(args.VALUE)

    const body = this.targets.getBody(util.target)

    switch (args.PROPERTY) {
      case 'restitution':
        body.restitution = value
        break

      case 'density':
        body.density = value
        break

      case 'mass':
        body.mass = value
        body.inverseMass = 1 / value
        break

      default:
        break
    }
  },
}

export default SetSpritePropertyBlock
