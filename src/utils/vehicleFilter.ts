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

export function calculateEstimatedCost(
  vehicle: VehicleType,
  distance: number,
  answers: UserAnswers
): number {
  const distanceNum = parseInt(distance.toString())
  
  // 要介護認定とケアプランに基づく料金計算
  if (answers.care_certification === 'yes' && answers.care_plan === 'yes') {
    // 介護保険適用（介助タクシー）
    const basePrice = vehicle.basePrice * 0.1 // 1割負担
    const distanceCost = vehicle.pricePerKm * distanceNum * 0.1
    return Math.round(basePrice + distanceCost)
  } else {
    // 福祉タクシー（自費）
    const basePrice = vehicle.basePrice
    const distanceCost = vehicle.pricePerKm * distanceNum
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