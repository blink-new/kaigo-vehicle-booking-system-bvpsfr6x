import { VehicleType, UserAnswers } from '../types'
import { vehicleTypes } from '../data/vehicles'

export function filterVehiclesByAnswers(answers: UserAnswers): VehicleType[] {
  // エリアチェック - 和歌山市以外は利用不可
  if (answers.area === 'other') {
    return []
  }
  
  return vehicleTypes.filter(vehicle => {
    // 車椅子が必要な場合
    if (answers.mobility === 'wheelchair' && !vehicle.wheelchairAccessible) {
      return false
    }
    
    // ストレッチャーが必要な場合
    if (answers.mobility === 'stretcher' && !vehicle.stretcherCompatible) {
      return false
    }
    
    return true
  })
}

// 和歌山市内の主要地点間の距離データ（km）
const DISTANCE_MAP: { [key: string]: number } = {
  '和歌山駅': 0,
  '和歌山市駅': 2,
  '和歌山城': 1,
  '和歌山県立医科大学附属病院': 3,
  '日本赤十字社和歌山医療センター': 5,
  '和歌山労災病院': 8,
  '和歌山市民病院': 4,
  '紀の川市': 15,
  '岩出市': 12,
  '海南市': 10,
  '橋本市': 25,
  '有田市': 20
}

// 地名から距離を推定する関数
function estimateDistance(pickup: string, destination: string): number {
  // 簡易的な距離推定ロジック
  const pickupDistance = findClosestLocation(pickup)
  const destinationDistance = findClosestLocation(destination)
  
  // 基本距離 + 地点間の差
  const estimatedDistance = Math.abs(pickupDistance - destinationDistance) + 2
  
  // 最小2km、最大50kmで制限
  return Math.max(2, Math.min(50, estimatedDistance))
}

// 最も近い地点を見つける関数
function findClosestLocation(location: string): number {
  const locationLower = location.toLowerCase()
  
  // 完全一致を探す
  for (const [key, distance] of Object.entries(DISTANCE_MAP)) {
    if (locationLower.includes(key.toLowerCase())) {
      return distance
    }
  }
  
  // 部分一致を探す
  if (locationLower.includes('病院') || locationLower.includes('医療')) {
    return 5 // 平均的な病院までの距離
  }
  if (locationLower.includes('駅')) {
    return 3 // 平均的な駅までの距離
  }
  if (locationLower.includes('市役所') || locationLower.includes('役場')) {
    return 4
  }
  
  // デフォルト距離
  return 5
}

export function calculateEstimatedCost(
  vehicle: VehicleType,
  answers: UserAnswers
): number {
  // 乗車地・降車地から距離を自動計算
  const distance = answers.pickup && answers.destination 
    ? estimateDistance(answers.pickup, answers.destination)
    : 5 // デフォルト距離
  
  // 要介護認定とケアプランに基づく料金計算
  if (answers.care_certification === 'yes' && answers.care_plan === 'yes') {
    // 介護保険適用（介助タクシー）
    const basePrice = vehicle.basePrice * 0.1 // 1割負担
    const distanceCost = vehicle.pricePerKm * distance * 0.1
    return Math.round(basePrice + distanceCost)
  } else {
    // 福祉タクシー（自費）
    const basePrice = vehicle.basePrice
    const distanceCost = vehicle.pricePerKm * distance
    return Math.round(basePrice + distanceCost)
  }
}

export function getRequiredDocuments(answers: UserAnswers): string[] {
  const documents = ['身分証明書']
  
  if (answers.care_certification === 'yes') {
    documents.push('介護保険証')
    
    if (answers.care_plan === 'yes') {
      documents.push('ケアプラン（通院乗降介助の記載があるもの）')
    }
  }
  
  if (answers.purpose === 'hospital') {
    documents.push('診察券', '健康保険証')
  }
  
  if (answers.mobility === 'wheelchair') {
    documents.push('車椅子の仕様書（必要に応じて）')
  }
  
  if (answers.mobility === 'stretcher') {
    documents.push('医師の診断書', '搬送依頼書')
  }
  
  return documents
}

export function getServiceType(answers: UserAnswers): {
  type: 'kaijo_taxi' | 'fukushi_taxi' | 'consultation_needed'
  title: string
  description: string
  coverage: string
} {
  // 要介護認定を受けていない場合
  if (answers.care_certification === 'no') {
    return {
      type: 'fukushi_taxi',
      title: '福祉タクシー',
      description: '要介護認定を受けていない方向けのサービスです',
      coverage: '全額自己負担'
    }
  }
  
  // 要介護認定を受けている場合
  if (answers.care_certification === 'yes') {
    if (answers.care_plan === 'yes') {
      return {
        type: 'kaijo_taxi',
        title: '介助タクシー（介護保険適用）',
        description: 'ケアプランに通院乗降介助が含まれているため、介護保険が適用されます',
        coverage: '1割負担（介護保険適用）'
      }
    } else if (answers.care_plan === 'no' || answers.care_plan === 'unknown') {
      return {
        type: 'consultation_needed',
        title: 'ケアマネージャーへの相談が必要',
        description: 'ケアプランに通院乗降介助が含まれていない場合は、担当ケアマネージャーさんにご相談ください',
        coverage: 'お急ぎの場合は福祉タクシー（全額自己負担）をご利用いただけます'
      }
    }
  }
  
  return {
    type: 'fukushi_taxi',
    title: '福祉タクシー',
    description: '一般的な福祉タクシーサービスです',
    coverage: '全額自己負担'
  }
}