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
  duration: number
): number {
  const distanceCost = vehicle.basePrice + (vehicle.pricePerKm * distance)
  const timeCost = duration * 500 // 時間料金
  return distanceCost + timeCost
}

export function getRequiredDocuments(answers: UserAnswers): string[] {
  const documents = [
    '身分証明書',
    '介護保険証'
  ]
  
  if (answers.purpose === 'hospital') {
    documents.push('診察券', '保険証')
  }
  
  if (answers.mobility === 'wheelchair') {
    documents.push('車椅子の仕様書（必要に応じて）')
  }
  
  if (answers.mobility === 'stretcher') {
    documents.push('医師の診断書', '搬送依頼書')
  }
  
  if (answers.assistance === 'heavy') {
    documents.push('介護度認定書')
  }
  
  return documents
}