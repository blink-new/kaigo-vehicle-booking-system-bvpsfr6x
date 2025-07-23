import { VehicleType } from '../types'

export const vehicleTypes: VehicleType[] = [
  {
    id: 'regular-sedan',
    name: '一般車乗り込み（セダン）',
    description: '歩行可能な方向けの標準的なセダン車両',
    features: [
      '4人乗り',
      '快適なシート',
      'エアコン完備',
      '安全運転サポート',
      '荷物トランク完備'
    ],
    basePrice: 1200,
    pricePerKm: 180,
    capacity: 4,
    wheelchairAccessible: false,
    stretcherCompatible: false,
    imageUrl: '/regular-passenger-vehicles.png'
  },
  {
    id: 'toyota-sienta',
    name: '一般車乗り込み（トヨタシエンタ）',
    description: '歩行可能な方向けのコンパクトミニバン',
    features: [
      '7人乗り',
      'スライドドア',
      '低床設計で乗り降りしやすい',
      'エアコン完備',
      '安全運転サポート',
      '車椅子の方も乗り移り可能'
    ],
    basePrice: 1400,
    pricePerKm: 200,
    capacity: 7,
    wheelchairAccessible: false,
    stretcherCompatible: false,
    imageUrl: '/regular-passenger-vehicles.png'
  },
  {
    id: 'japan-taxi',
    name: '一般車乗り込み（JapanTAXI）',
    description: 'バリアフリー対応のユニバーサルデザインタクシー',
    features: [
      '4人乗り',
      '車椅子の方も乗り移り可能',
      'スロープ付き（手動車椅子対応）',
      '低床設計',
      'エアコン完備',
      '安全運転サポート',
      'ユニバーサルデザイン'
    ],
    basePrice: 1600,
    pricePerKm: 220,
    capacity: 4,
    wheelchairAccessible: false,
    stretcherCompatible: false,
    imageUrl: '/regular-passenger-vehicles.png'
  },
  {
    id: 'wheelchair-light-vehicle',
    name: '軽自動車（車椅子対応）',
    description: '車椅子のまま乗車可能なコンパクトな軽自動車',
    features: [
      '車椅子1台対応',
      'リアスロープ付き',
      '車椅子固定装置完備',
      '介助者1名同乗可能',
      '低床設計',
      '燃費良好',
      'コンパクトで運転しやすい'
    ],
    basePrice: 2000,
    pricePerKm: 250,
    capacity: 3,
    wheelchairAccessible: true,
    stretcherCompatible: false,
    imageUrl: '/wheelchair-light-vehicle.png'
  },
  {
    id: 'wheelchair-van',
    name: '車椅子対応車両（大型）',
    description: '車椅子のまま乗車可能な大型専用車両',
    features: [
      '車椅子2台まで対応',
      'スロープ付き',
      '車椅子固定装置',
      '介助者同乗可能',
      '低床設計',
      '広々とした車内空間'
    ],
    basePrice: 2500,
    pricePerKm: 300,
    capacity: 6,
    wheelchairAccessible: true,
    stretcherCompatible: false
  },
  {
    id: 'stretcher-ambulance',
    name: 'ストレッチャー車両（大型）',
    description: '寝たきりの方向けの大型ストレッチャー対応車両',
    features: [
      'ストレッチャー1台完備',
      '電動昇降機能付き',
      '医療機器対応電源',
      '付き添い者2名まで同乗可能',
      '感染症対策済み',
      '酸素ボンベ対応',
      '車内照明・空調完備'
    ],
    basePrice: 4500,
    pricePerKm: 550,
    capacity: 4,
    wheelchairAccessible: false,
    stretcherCompatible: true,
    imageUrl: '/stretcher-vehicle.png'
  },
  {
    id: 'minivan',
    name: '大型車両（ミニバン）',
    description: '複数名での移動に適した大型車両',
    features: [
      '7-8人乗り',
      '車椅子1台対応可能',
      '荷物スペース大',
      'バリアフリー設計',
      '介助者複数名同乗可能'
    ],
    basePrice: 2000,
    pricePerKm: 250,
    capacity: 8,
    wheelchairAccessible: true,
    stretcherCompatible: false
  }
]