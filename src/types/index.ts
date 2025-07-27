export interface User {
  id: string
  email: string
  displayName?: string
}

export interface VehicleType {
  id: string
  name: string
  description: string
  features: string[]
  basePrice: number
  pricePerKm: number
  capacity: number
  wheelchairAccessible: boolean
  stretcherCompatible: boolean
  imageUrl?: string
}

export interface BookingRequest {
  id: string
  userId: string
  vehicleTypeId: string
  purpose: string
  distance: number
  duration: number
  wheelchairNeeded: boolean
  stretcherNeeded: boolean
  assistanceLevel: 'light' | 'moderate' | 'heavy'
  pickupLocation: string
  destination: string
  preferredDate: string
  preferredTime: string
  estimatedCost: number
  status: 'draft' | 'submitted' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface QuestionStep {
  id: string
  title: string
  description: string
  type: 'single' | 'multiple' | 'text' | 'number' | 'date' | 'time'
  options?: { value: string; label: string }[]
  required: boolean
  condition?: { [key: string]: string }
}

export interface UserAnswers {
  [questionId: string]: string | string[] | number
}