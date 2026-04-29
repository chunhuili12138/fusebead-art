export interface ColorInfo {
  name: string
  hex: string
  label: string
}

export interface ColorFamily {
  id: string
  name: string
  colors: ColorInfo[]
}

/** 36 pattern-encodable colors (1-9, a-z, A).
 *  Keep IDs 1-20 matching old palette so all existing patterns work. */
const PATTERN_PALETTE: ColorInfo[] = [
  // 1-5
  { name: '樱桃红',   hex: '#E53935', label: 'Cherry' },
  { name: '橘子橙',   hex: '#FB8C00', label: 'Tangerine' },
  { name: '柠檬黄',   hex: '#FDD835', label: 'Lemon' },
  { name: '苹果绿',   hex: '#43A047', label: 'Apple' },
  { name: '天空蓝',   hex: '#1E88E5', label: 'SkyBlue' },
  // 6-9
  { name: '葡萄紫',   hex: '#8E24AA', label: 'Grape' },
  { name: '蜜桃粉',   hex: '#F48FB1', label: 'Peach' },
  { name: '巧克力棕', hex: '#6D4C41', label: 'Chocolate' },
  { name: '曜石黑',   hex: '#212121', label: 'Black' },
  // 10-14 (a-e)
  { name: '珍珠白',   hex: '#FAFAFA', label: 'White' },
  { name: '青草绿',   hex: '#66BB6A', label: 'Grass' },
  { name: '湖水蓝',   hex: '#26C6DA', label: 'Cyan' },
  { name: '暗红色',   hex: '#C62828', label: 'Crimson' },
  { name: '奶油黄',   hex: '#FFF176', label: 'Cream' },
  // 15-20 (f-k)
  { name: '石板灰',   hex: '#78909C', label: 'Gray' },
  { name: '嫩芽绿',   hex: '#AED581', label: 'Lime' },
  { name: '暖肤色',   hex: '#FFCC80', label: 'Skin' },
  { name: '淡紫色',   hex: '#CE93D8', label: 'Lavender' },
  { name: '深褐色',   hex: '#4E342E', label: 'DarkBrown' },
  { name: '银灰色',   hex: '#B0BEC5', label: 'Silver' },
  // 21-26 (l-q)
  { name: '西瓜红',   hex: '#FF5252', label: 'Watermelon' },
  { name: '正红色',   hex: '#FF0000', label: 'PureRed' },
  { name: '亮橙色',   hex: '#FF9800', label: 'BrightOrange' },
  { name: '金黄色',   hex: '#FFC107', label: 'Gold' },
  { name: '深绿色',   hex: '#2E7D32', label: 'DarkGreen' },
  { name: '薄荷绿',   hex: '#69F0AE', label: 'Mint' },
  // 27-31 (r-v)
  { name: '深蓝色',   hex: '#1565C0', label: 'DeepBlue' },
  { name: '浅蓝色',   hex: '#64B5F6', label: 'LightBlue' },
  { name: '深紫色',   hex: '#4A148C', label: 'DeepPurple' },
  { name: '薰衣草',   hex: '#BA68C8', label: 'LavenderP' },
  { name: '浅粉色',   hex: '#F8BBD0', label: 'LightPink' },
  // 32-36 (w-A)
  { name: '浅棕色',   hex: '#8D6E63', label: 'LightBrown' },
  { name: '深灰色',   hex: '#424242', label: 'DarkGray' },
  { name: '纯白色',   hex: '#FFFFFF', label: 'PureWhite' },
  { name: '纯黑色',   hex: '#000000', label: 'PureBlack' },
  { name: '酒红色',   hex: '#B71C1C', label: 'Wine' },
]

// ---------- Family extras (displayed in BeadBox, beyond the 36) ----------

const redsX: ColorInfo[] = [
  { name: '番茄红', hex: '#EF5350', label: 'Tomato' },
  { name: '玫瑰红', hex: '#D50000', label: 'Rose' },
  { name: '深玫红', hex: '#880E4F', label: 'DeepRose' },
  { name: '珊瑚红', hex: '#FF6E40', label: 'Coral' },
  { name: '朱砂红', hex: '#E64A19', label: 'Vermilion' },
  { name: '浅红色', hex: '#FF8A80', label: 'LightRed' },
  { name: '胭脂红', hex: '#AD1457', label: 'Carmine' },
  { name: '砖红色', hex: '#BF360C', label: 'Brick' },
  { name: '铁锈红', hex: '#A52714', label: 'Rust' },
  { name: '宝石红', hex: '#C51162', label: 'Ruby' },
  { name: '石榴红', hex: '#D32F2F', label: 'Garnet' },
  { name: '绯红色', hex: '#F44336', label: 'Scarlet' },
  { name: '粉红',   hex: '#FF80AB', label: 'PinkRed' },
]

const orangesX: ColorInfo[] = [
  { name: '深橙色', hex: '#E65100', label: 'DeepOrange' },
  { name: '蜜橘色', hex: '#FFAB40', label: 'HoneyOrange' },
  { name: '琥珀色', hex: '#FF8F00', label: 'Amber' },
  { name: '南瓜橙', hex: '#FF6D00', label: 'Pumpkin' },
  { name: '金橙色', hex: '#F57C00', label: 'GoldOrange' },
  { name: '浅杏色', hex: '#FFCC80', label: 'LightApricot' },
  { name: '胡萝卜', hex: '#EF6C00', label: 'Carrot' },
  { name: '红橙色', hex: '#FF5722', label: 'RedOrange' },
  { name: '秋橙色', hex: '#FF7043', label: 'Autumn' },
  { name: '三文鱼', hex: '#FF8A65', label: 'Salmon' },
  { name: '柿子橙', hex: '#E65100', label: 'Persimmon' },
  { name: '杏橙色', hex: '#FFB74D', label: 'Apricot' },
]

const yellowsX: ColorInfo[] = [
  { name: '淡黄色', hex: '#FFF9C4', label: 'PaleYellow' },
  { name: '香蕉黄', hex: '#FFEE58', label: 'Banana' },
  { name: '向日葵', hex: '#FFD600', label: 'Sunflower' },
  { name: '土黄色', hex: '#F9A825', label: 'Mustard' },
  { name: '香槟色', hex: '#FFF8E1', label: 'Champagne' },
  { name: '鹅黄色', hex: '#FFF59D', label: 'GooseYellow' },
  { name: '琥珀黄', hex: '#FFB300', label: 'AmberYellow' },
  { name: '蜜黄色', hex: '#FFCA28', label: 'Honey' },
  { name: '沙黄色', hex: '#FFE082', label: 'Sand' },
  { name: '玉米黄', hex: '#FFE57F', label: 'Corn' },
  { name: '亮黄色', hex: '#FFEB3B', label: 'BrightYellow' },
]

const greensX: ColorInfo[] = [
  { name: '橄榄绿', hex: '#827717', label: 'Olive' },
  { name: '苔藓绿', hex: '#558B2F', label: 'Moss' },
  { name: '浅绿色', hex: '#A5D6A7', label: 'LightGreen' },
  { name: '黄绿色', hex: '#9CCC65', label: 'YellowGreen' },
  { name: '孔雀绿', hex: '#00897B', label: 'Peacock' },
  { name: '军绿色', hex: '#33691E', label: 'Army' },
  { name: '翡翠绿', hex: '#00E676', label: 'Emerald' },
  { name: '柳绿色', hex: '#8BC34A', label: 'Willow' },
  { name: '松石绿', hex: '#26A69A', label: 'Turquoise' },
  { name: '菠菜绿', hex: '#388E3C', label: 'Spinach' },
  { name: '常春藤', hex: '#4CAF50', label: 'Ivy' },
  { name: '嫩草绿', hex: '#C5E1A5', label: 'TenderGrass' },
  { name: '荧光绿', hex: '#76FF03', label: 'Neon' },
  { name: '森林绿', hex: '#1B5E20', label: 'Forest' },
]

const cyansX: ColorInfo[] = [
  { name: '天青色', hex: '#00BCD4', label: 'SkyCyan' },
  { name: '浅青色', hex: '#80DEEA', label: 'LightCyan' },
  { name: '蓝绿色', hex: '#0097A7', label: 'Teal' },
  { name: '深海绿', hex: '#00695C', label: 'DeepTeal' },
  { name: '薄荷蓝', hex: '#4DD0E1', label: 'MintBlue' },
  { name: '冰蓝色', hex: '#B2EBF2', label: 'Ice' },
  { name: '海蓝色', hex: '#0277BD', label: 'Ocean' },
  { name: '绿松石', hex: '#00B8D4', label: 'TurquoiseC' },
  { name: '水绿色', hex: '#00ACC1', label: 'Aqua' },
  { name: '鸭绿色', hex: '#00838F', label: 'DuckGreen' },
  { name: '翠绿色', hex: '#18FFFF', label: 'Jade' },
]

const bluesX: ColorInfo[] = [
  { name: '蔚蓝色', hex: '#42A5F5', label: 'Azure' },
  { name: '午夜蓝', hex: '#1A237E', label: 'Midnight' },
  { name: '湖蓝色', hex: '#29B6F6', label: 'LakeBlue' },
  { name: '钴蓝色', hex: '#1565C0', label: 'Cobalt' },
  { name: '天蓝灰', hex: '#BBDEFB', label: 'BlueGray' },
  { name: '靛蓝色', hex: '#283593', label: 'Indigo' },
  { name: '琉璃蓝', hex: '#1A237E', label: 'GlassBlue' },
  { name: '冰河蓝', hex: '#CFD8DC', label: 'Glacier' },
  { name: '亮蓝色', hex: '#2196F3', label: 'BrightBlue' },
  { name: '静蓝色', hex: '#B3E5FC', label: 'CalmBlue' },
  { name: '宝蓝色', hex: '#0D47A1', label: 'Royal' },
  { name: '牛仔蓝', hex: '#1976D2', label: 'Denim' },
  { name: '婴儿蓝', hex: '#90CAF9', label: 'BabyBlue' },
  { name: '海军蓝', hex: '#0D47A1', label: 'Navy' },
]

const purplesX: ColorInfo[] = [
  { name: '紫罗兰', hex: '#9C27B0', label: 'Violet' },
  { name: '浅紫色', hex: '#E1BEE7', label: 'LightPurple' },
  { name: '茄子紫', hex: '#311B92', label: 'Eggplant' },
  { name: '兰花紫', hex: '#AB47BC', label: 'Orchid' },
  { name: '丁香紫', hex: '#7B1FA2', label: 'Lilac' },
  { name: '紫红色', hex: '#AD1457', label: 'Magenta' },
  { name: '皇家紫', hex: '#4A148C', label: 'RoyalPurple' },
  { name: '雾紫色', hex: '#F3E5F5', label: 'MistyPurple' },
  { name: '深梅紫', hex: '#512DA8', label: 'DarkPlum' },
  { name: '梅子紫', hex: '#6A1B9A', label: 'Plum' },
]

const pinksX: ColorInfo[] = [
  { name: '亮粉色', hex: '#E91E63', label: 'HotPink' },
  { name: '樱花粉', hex: '#FFCCD5', label: 'Sakura' },
  { name: '玫瑰粉', hex: '#EC407A', label: 'RosePink' },
  { name: '泡泡糖', hex: '#F06292', label: 'Bubblegum' },
  { name: '洋红色', hex: '#D81B60', label: 'MagentaF' },
  { name: '牡丹粉', hex: '#FF80AB', label: 'Peony' },
  { name: '肉粉色', hex: '#FFCDD2', label: 'FleshPink' },
  { name: '桃红色', hex: '#FF5252', label: 'PeachRed' },
  { name: '胭粉',   hex: '#AD1457', label: 'CarmineP' },
  { name: '粉紫色', hex: '#C2185B', label: 'PinkPurple' },
  { name: '芭蕾粉', hex: '#FFC1E3', label: 'Ballet' },
  { name: '珊瑚粉', hex: '#FF8A80', label: 'CoralPink' },
]

const brownsX: ColorInfo[] = [
  { name: '咖啡色', hex: '#5D4037', label: 'Coffee' },
  { name: '卡其色', hex: '#A1887F', label: 'Khaki' },
  { name: '栗棕色', hex: '#3E2723', label: 'Chestnut' },
  { name: '小麦色', hex: '#BCAAA4', label: 'Wheat' },
  { name: '驼色',   hex: '#AF7D5F', label: 'Camel' },
  { name: '沙棕色', hex: '#D7CCC8', label: 'SandBrown' },
  { name: '红棕色', hex: '#8B3A3A', label: 'RedBrown' },
  { name: '檀木色', hex: '#7B5B3A', label: 'Teak' },
  { name: '亚麻色', hex: '#D2B48C', label: 'Linen' },
  { name: '焦糖色', hex: '#8D5524', label: 'Caramel' },
  { name: '蜜糖色', hex: '#BC8F4F', label: 'HoneyBrown' },
  { name: '冷肤色', hex: '#FFAB91', label: 'CoolSkin' },
]

const graysX: ColorInfo[] = [
  { name: '浅灰色', hex: '#BDBDBD', label: 'LightGray' },
  { name: '象牙白', hex: '#FFFFF0', label: 'Ivory' },
  { name: '雪白色', hex: '#F5F5F5', label: 'Snow' },
  { name: '烟灰色', hex: '#757575', label: 'Smoke' },
  { name: '炭灰色', hex: '#37474F', label: 'Charcoal' },
  { name: '米白色', hex: '#FFF8E7', label: 'OffWhite' },
  { name: '灰褐色', hex: '#8D6E63', label: 'Taupe' },
  { name: '中灰色', hex: '#9E9E9E', label: 'MidGray' },
  { name: '白金灰', hex: '#CFD8DC', label: 'Platinum' },
  { name: '雾灰色', hex: '#ECEFF1', label: 'MistGray' },
  { name: '铁灰色', hex: '#607D8B', label: 'Iron' },
]

// ---------- Assemble families ----------

export const COLOR_FAMILIES: ColorFamily[] = [
  { id: 'red',    name: '红色系', colors: [...PATTERN_PALETTE.filter(c => ['樱桃红','暗红色','西瓜红','正红色','酒红色'].includes(c.name)), ...redsX] },
  { id: 'orange', name: '橙色系', colors: [...PATTERN_PALETTE.filter(c => ['橘子橙','亮橙色'].includes(c.name)), ...orangesX] },
  { id: 'yellow', name: '黄色系', colors: [...PATTERN_PALETTE.filter(c => ['柠檬黄','奶油黄','金黄色'].includes(c.name)), ...yellowsX] },
  { id: 'green',  name: '绿色系', colors: [...PATTERN_PALETTE.filter(c => ['苹果绿','青草绿','嫩芽绿','深绿色','薄荷绿'].includes(c.name)), ...greensX] },
  { id: 'cyan',   name: '青色系', colors: cyansX },
  { id: 'blue',   name: '蓝色系', colors: [...PATTERN_PALETTE.filter(c => ['天空蓝','湖水蓝','深蓝色','浅蓝色'].includes(c.name)), ...bluesX] },
  { id: 'purple', name: '紫色系', colors: [...PATTERN_PALETTE.filter(c => ['葡萄紫','淡紫色','深紫色','薰衣草'].includes(c.name)), ...purplesX] },
  { id: 'pink',   name: '粉色系', colors: [...PATTERN_PALETTE.filter(c => ['蜜桃粉','浅粉色'].includes(c.name)), ...pinksX] },
  { id: 'brown',  name: '棕色系', colors: [...PATTERN_PALETTE.filter(c => ['巧克力棕','暖肤色','深褐色','浅棕色'].includes(c.name)), ...brownsX] },
  { id: 'gray',   name: '灰白黑', colors: [...PATTERN_PALETTE.filter(c => ['曜石黑','珍珠白','石板灰','银灰色','深灰色','纯白色','纯黑色'].includes(c.name)), ...graysX] },
]

// ---------- Global ID mapping ----------

let _gid = 1
export const DEFAULT_COLORS: Record<number, ColorInfo> = {}
export const COLOR_LIST: (ColorInfo & { id: number; familyId: string })[] = []

// Pattern palette (IDs 1-36)
for (const c of PATTERN_PALETTE) {
  DEFAULT_COLORS[_gid] = c
  COLOR_LIST.push({ id: _gid, familyId: '', ...c })
  _gid++
}

// Extended colors by family — find family by matching
const _famMap: Record<string, string> = {}
for (const f of COLOR_FAMILIES) { for (const c of f.colors) { _famMap[c.hex] = f.id } }

const _allX: ColorInfo[][] = [redsX, orangesX, yellowsX, greensX, cyansX, bluesX, purplesX, pinksX, brownsX, graysX]
for (const arr of _allX) {
  for (const c of arr) {
    DEFAULT_COLORS[_gid] = c
    COLOR_LIST.push({ id: _gid, familyId: _famMap[c.hex] || '', ...c })
    _gid++
  }
}

// Rebuild familyId for pattern palette entries too
for (const c of COLOR_LIST) {
  if (!c.familyId) c.familyId = _famMap[c.hex] || ''
}

export const TOTAL_COLORS = _gid - 1

export function validateColor(hex: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex)
}

export function getColorById(id: number): ColorInfo | undefined {
  return DEFAULT_COLORS[id]
}
