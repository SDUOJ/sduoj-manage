export const judgeTemplateType = {
  IO: 0,
  SPJ: 1,
  ADVANCED: 2
}

export const judgeTemplateProperity = {
  [judgeTemplateType.IO]: {
    type: 0,
    name: 'IO',
    color: 'blue',
    zipFile: false
  },
  [judgeTemplateType.SPJ]: {
    type: 1,
    name: 'SPJ',
    color: 'gold',
    zipFile: true
  },
  [judgeTemplateType.ADVANCED]: {
    type: 2,
    name: 'Advanced',
    color: 'purple',
    zipFile: true
  }
}
