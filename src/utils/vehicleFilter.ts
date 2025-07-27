import { VehicleType, UserAnswers } from '../types'
import { vehicleTypes } from '../data/vehicles'

// 車両の適合度を計算するスコアリングシステム
interface VehicleScore {
  vehicle: VehicleType
  score: number
  reasons: string[]
}

export function filterVehiclesByAnswers(answers: UserAnswers): VehicleType[] {
  // エリアチェック - 和歌山市以外は利用不可
  if (answers.area === 'other') {
    return []
  }
  
  // 各車両にスコアを付けて評価
  const scoredVehicles: VehicleScore[] = vehicleTypes.map(vehicle => {
    const score = calculateVehicleScore(vehicle, answers)
    return {
      vehicle,
      score: score.totalScore,
      reasons: score.reasons
    }
  }).filter(item => item.score > 0) // スコア0以下は除外
  
  // スコア順にソートして上位2-3台を選択
  const sortedVehicles = scoredVehicles.sort((a, b) => b.score - a.score)
  
  // 最大3台まで、かつスコアが50以上のもののみ返す
  const topVehicles = sortedVehicles
    .filter(item => item.score >= 50)
    .slice(0, 3)
    .map(item => item.vehicle)
  
  // 最低1台は返すようにする（条件に合うものがある場合）
  if (topVehicles.length === 0 && sortedVehicles.length > 0) {
    return [sortedVehicles[0].vehicle]
  }
  
  return topVehicles
}

// 車両の適合度スコアを計算
function calculateVehicleScore(vehicle: VehicleType, answers: UserAnswers): {
  totalScore: number
  reasons: string[]
} {
  let score = 100 // 基本スコア
  const reasons: string[] = []
  
  // 必須条件チェック（満たさない場合は0点）
  if (answers.mobility === 'wheelchair' && !vehicle.wheelchairAccessible) {
    return { totalScore: 0, reasons: ['車椅子対応が必要ですが、この車両は対応していません'] }
  }
  
  if (answers.mobility === 'stretcher' && !vehicle.stretcherCompatible) {
    return { totalScore: 0, reasons: ['ストレッチャー対応が必要ですが、この車両は対応していません'] }
  }
  
  // 移動手段による適合度
  if (answers.mobility === 'walking') {
    if (vehicle.id === 'regular-sedan' || vehicle.id === 'toyota-sienta' || vehicle.id === 'japan-taxi') {
      score += 30
      reasons.push('歩行可能な方に最適な車両です')
    } else {
      score -= 20
      reasons.push('歩行可能な方には少し大きめの車両です')
    }
  }
  
  if (answers.mobility === 'walking_aid') {
    if (vehicle.id === 'japan-taxi' || vehicle.id === 'toyota-sienta') {
      score += 25
      reasons.push('歩行補助具をお使いの方に適した低床設計です')
    } else if (vehicle.id === 'regular-sedan') {
      score += 10
      reasons.push('乗り降りに少し介助が必要な場合があります')
    }
  }
  
  if (answers.mobility === 'wheelchair') {
    if (vehicle.wheelchairAccessible) {
      score += 40
      reasons.push('車椅子のまま乗車可能です')
      
      if (vehicle.id === 'wheelchair-light-vehicle') {
        score += 20
        reasons.push('コンパクトで取り回しが良い車椅子専用車両です')
      } else if (vehicle.id === 'wheelchair-van') {
        score += 15
        reasons.push('広々とした車椅子対応車両です')
      }
    }
  }
  
  if (answers.mobility === 'stretcher') {
    if (vehicle.stretcherCompatible) {
      score += 50
      reasons.push('ストレッチャーでの搬送に対応しています')
    }
  }
  
  // 同行者数による適合度
  const totalPassengers = 1 + (parseInt(answers.companions) || 0)
  if (vehicle.capacity >= totalPassengers) {
    if (vehicle.capacity === totalPassengers || vehicle.capacity === totalPassengers + 1) {
      score += 20
      reasons.push('乗車人数にちょうど良いサイズです')
    } else if (vehicle.capacity > totalPassengers + 2) {
      score -= 10
      reasons.push('乗車人数に対して少し大きめの車両です')
    }
  } else {
    score -= 50
    reasons.push('乗車人数が車両定員を超えています')
  }
  
  // 利用目的による適合度
  if (answers.purpose === 'hospital') {
    if (vehicle.id === 'stretcher-ambulance') {
      score += 15
      reasons.push('医療機関への通院に適した設備を備えています')
    } else if (vehicle.id === 'japan-taxi') {
      score += 10
      reasons.push('バリアフリー対応で通院に適しています')
    }
  }
  
  if (answers.purpose === 'shopping' || answers.purpose === 'leisure') {
    if (vehicle.id === 'minivan' || vehicle.id === 'toyota-sienta') {
      score += 10
      reasons.push('荷物スペースが広く、お出かけに適しています')
    }
  }
  
  // 料金による適合度（安い方が高スコア）
  const estimatedCost = calculateEstimatedCost(vehicle, answers)
  if (estimatedCost < 2000) {
    score += 15
    reasons.push('料金が比較的リーズナブルです')
  } else if (estimatedCost > 5000) {
    score -= 10
    reasons.push('料金が高めになります')
  }
  
  // 要介護度による適合度
  if (answers.care_level) {
    const careLevel = parseInt(answers.care_level)
    if (careLevel >= 3) {
      if (vehicle.wheelchairAccessible || vehicle.stretcherCompatible) {
        score += 20
        reasons.push('要介護度が高い方に適した車両です')
      }
    } else if (careLevel <= 2) {
      if (vehicle.id === 'regular-sedan' || vehicle.id === 'japan-taxi') {
        score += 15
        reasons.push('要介護度に適した車両です')
      }
    }
  }
  
  return { totalScore: Math.max(0, score), reasons }
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

// 絞り込み精度向上のための追加情報提案
export function getSuggestionForBetterFiltering(answers: UserAnswers): {
  missingInfo: string[]
  suggestions: string[]
} {
  const missingInfo: string[] = []
  const suggestions: string[] = []
  
  // 身体状況の詳細
  if (!answers.mobility || answers.mobility === 'walking') {
    missingInfo.push('具体的な身体状況')
    suggestions.push('歩行距離（何メートル歩けるか）')
    suggestions.push('階段の昇降は可能か')
    suggestions.push('立ち座りに介助が必要か')
  }
  
  // 医療機器の使用
  if (answers.purpose === 'hospital') {
    missingInfo.push('医療機器の使用状況')
    suggestions.push('酸素ボンベの使用有無')
    suggestions.push('点滴などの医療機器の有無')
    suggestions.push('感染症対策の必要性')
  }
  
  // 時間帯・頻度
  missingInfo.push('利用時間帯・頻度')
  suggestions.push('利用予定時間帯（朝・昼・夕方・夜間）')
  suggestions.push('利用頻度（週何回程度）')
  suggestions.push('緊急時の利用可能性')
  
  // 予算
  if (!answers.budget) {
    missingInfo.push('予算の目安')
    suggestions.push('1回あたりの予算上限')
    suggestions.push('月額予算の目安')
  }
  
  // 介助者の詳細
  if (answers.companions && parseInt(answers.companions) > 0) {
    missingInfo.push('介助者の詳細')
    suggestions.push('介助者の介護経験の有無')
    suggestions.push('介助者の年齢・体力')
    suggestions.push('車椅子操作の可否')
  }
  
  // 特別な配慮
  missingInfo.push('特別な配慮事項')
  suggestions.push('認知症の有無・程度')
  suggestions.push('コミュニケーション方法（聴覚・視覚障害）')
  suggestions.push('アレルギーや持病')
  suggestions.push('車酔いしやすいか')
  
  return { missingInfo, suggestions }
}