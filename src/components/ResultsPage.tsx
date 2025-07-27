import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { ArrowLeft, FileText, Phone, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { VehicleCard } from './VehicleCard'
import { UserAnswers, VehicleType } from '../types'
import { filterVehiclesByAnswers, calculateEstimatedCost, getRequiredDocuments, getServiceType } from '../utils/vehicleFilter'

interface ResultsPageProps {
  answers: UserAnswers
  onBack: () => void
}

export function ResultsPage({ answers, onBack }: ResultsPageProps) {
  const availableVehicles = filterVehiclesByAnswers(answers)
  const requiredDocuments = getRequiredDocuments(answers)
  const serviceType = getServiceType(answers)
  const distance = parseInt(answers.distance as string) || 10

  const handleContact = (vehicle: VehicleType, method: 'phone') => {
    // 電話番号に発信
    window.open('tel:073-456-6227')
  }

  const getPurposeLabel = (purpose: string) => {
    const purposes = {
      hospital: '通院・診察',
      rehabilitation: 'リハビリテーション',
      daycare: 'デイサービス',
      shopping: '買い物・外出',
      other: 'その他'
    }
    return purposes[purpose as keyof typeof purposes] || purpose
  }

  const getMobilityLabel = (mobility: string) => {
    const mobilities = {
      walking: '歩行可能（介助なし）',
      walking_assist: '歩行可能（介助あり）',
      wheelchair: '車椅子を使用',
      stretcher: 'ストレッチャーが必要'
    }
    return mobilities[mobility as keyof typeof mobilities] || mobility
  }

  const getCareLevel = (level: string) => {
    return `要介護${level}`
  }

  const getAreaLabel = (area: string) => {
    const areas = {
      'wakayama-city': '和歌山市内',
      'other': 'その他の地域'
    }
    return areas[area as keyof typeof areas] || area
  }

  // サービス種別に応じたアラート表示
  const renderServiceAlert = () => {
    if (serviceType.type === 'consultation_needed') {
      return (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="w-5 h-5" />
              ケアマネージャーへの相談が必要です
            </CardTitle>
          </CardHeader>
          <CardContent className="text-orange-700">
            <p className="mb-3">{serviceType.description}</p>
            <div className="space-y-2">
              <p className="font-medium">次のステップ：</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>担当ケアマネージャーさんに「通院乗降介助」の追加をご相談ください</li>
                <li>ケアプランに追加されると介護保険が適用されます（1割負担）</li>
                <li>お急ぎの場合は下記の福祉タクシーをご利用いただけます（全額自己負担）</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )
    }
    return null
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          質問に戻る
        </Button>
        <h1 className="text-2xl font-bold">検索結果</h1>
      </div>

      {/* サービス種別アラート */}
      {renderServiceAlert()}

      {/* サービス種別表示 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            ご利用可能なサービス
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">{serviceType.title}</h3>
              <p className="text-sm text-muted-foreground">{serviceType.description}</p>
            </div>
            <Badge variant={serviceType.type === 'kaijo_taxi' ? 'default' : 'secondary'}>
              {serviceType.coverage}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 利用条件サマリー */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            ご利用条件
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">要介護認定</span>
              <span className="text-sm font-medium">
                {answers.care_certification === 'yes' 
                  ? `${getCareLevel(answers.care_level as string)}` 
                  : '未認定'}
              </span>
            </div>
            {answers.care_certification === 'yes' && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">通院乗降介助</span>
                <span className="text-sm font-medium">
                  {answers.care_plan === 'yes' ? 'ケアプランに含む' : 
                   answers.care_plan === 'no' ? 'ケアプランに含まない' : 'わからない'}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">利用目的</span>
              <span className="text-sm font-medium">{getPurposeLabel(answers.purpose as string)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">利用日時</span>
              <span className="text-sm font-medium">{answers.date} {answers.time}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">身体状況</span>
              <span className="text-sm font-medium">{getMobilityLabel(answers.mobility as string)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">移動距離</span>
              <span className="text-sm font-medium">約{distance}km</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">対応エリア</span>
              <span className="text-sm font-medium">{getAreaLabel(answers.area as string)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">出発地</span>
              <span className="text-sm font-medium">{answers.pickup}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">目的地</span>
              <span className="text-sm font-medium">{answers.destination}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 利用可能車両 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">利用可能な車両</h2>
        {availableVehicles.length > 0 ? (
          <div className="grid gap-4">
            {availableVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                estimatedCost={calculateEstimatedCost(vehicle, distance, answers)}
                onContact={handleContact}
                serviceType={serviceType.type}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                {answers.area === 'other' 
                  ? '申し訳ございません。当サービスは和歌山市内のみ対応しております。'
                  : '申し訳ございません。ご指定の条件に合う車両が見つかりませんでした。'
                }
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                お電話でご相談ください: 073-456-6227
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 必要書類 */}
      {availableVehicles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>必要書類・条件</CardTitle>
            <CardDescription>
              ご利用時に必要となる書類や条件をご確認ください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {requiredDocuments.map((doc, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span className="text-sm">{doc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* お問い合わせ情報 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            お問い合わせ・ご予約
          </CardTitle>
          <CardDescription>
            ご予約・ご相談はお電話にて承っております
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <div className="text-3xl font-bold text-primary">073-456-6227</div>
            <div className="text-sm text-muted-foreground">
              <p>受付時間: 平日 9:00-17:00</p>
              <p>対応エリア: 和歌山市内のみ</p>
              <p>※事前予約制です</p>
            </div>
            <Button 
              onClick={() => window.open('tel:073-456-6227')}
              className="w-full max-w-xs mx-auto flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              今すぐ電話する
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}