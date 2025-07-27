import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Car, Users, Accessibility, Heart, Phone } from 'lucide-react'
import { VehicleType } from '../types'

interface VehicleCardProps {
  vehicle: VehicleType
  estimatedCost: number
  onContact: (vehicle: VehicleType, method: 'phone') => void
  serviceType?: 'kaijo_taxi' | 'fukushi_taxi' | 'consultation_needed'
}

export function VehicleCard({ vehicle, estimatedCost, onContact, serviceType = 'fukushi_taxi' }: VehicleCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(price)
  }

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      {vehicle.imageUrl && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={vehicle.imageUrl}
            alt={vehicle.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Car className="w-5 h-5 text-primary" />
              {vehicle.name}
            </CardTitle>
            <CardDescription>{vehicle.description}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {formatPrice(estimatedCost)}
            </div>
            <div className="text-sm text-muted-foreground">
              {serviceType === 'kaijo_taxi' ? '概算料金（1割負担）' : '概算料金（全額自己負担）'}
            </div>
            {serviceType === 'kaijo_taxi' && (
              <Badge variant="default" className="mt-1 text-xs">
                介護保険適用
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {vehicle.capacity}人乗り
          </Badge>
          {vehicle.wheelchairAccessible && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Accessibility className="w-3 h-3" />
              車椅子対応
            </Badge>
          )}
          {vehicle.stretcherCompatible && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              ストレッチャー対応
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium text-sm">主な特徴</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {vehicle.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="pt-2">
          <Button
            onClick={() => onContact(vehicle, 'phone')}
            className="w-full flex items-center gap-2"
            size="sm"
          >
            <Phone className="w-4 h-4" />
            電話で問い合わせ (073-456-6227)
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}