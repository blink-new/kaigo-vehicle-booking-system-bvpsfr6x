import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { ArrowRight, Clock, Shield, MapPin, Users, Accessibility, Heart, Phone } from 'lucide-react'

interface HomePageProps {
  onStartQuestions: () => void
}

export function HomePage({ onStartQuestions }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* ヒーローセクション */}
      <section className="max-w-4xl mx-auto px-4 py-12 text-center space-y-8">
        <div className="space-y-4">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            簡単3分で完了
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
            質問に答えるだけで<br />
            <span className="text-primary">最適な介護車両</span>を<br />
            見つけられます
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ご利用者様の身体状況や移動条件に合わせて、最適な車両タイプ、料金概算、必要書類を自動で表示。
            そのまま予約のお問い合わせまで完了できます。
          </p>
        </div>
        
        <Button 
          onClick={onStartQuestions}
          size="lg"
          className="text-lg px-8 py-6 h-auto animate-pulse hover:animate-none"
        >
          質問を始める
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </section>

      {/* 特徴セクション */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">3つの安心ポイント</h2>
          <p className="text-muted-foreground">
            介護が必要な方とご家族の移動を全力でサポートします
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>簡単・迅速</CardTitle>
              <CardDescription>
                質問に答えるだけで3分で完了。複雑な手続きは不要です。
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-accent" />
              </div>
              <CardTitle>安心・安全</CardTitle>
              <CardDescription>
                専門スタッフによる安全運転と、医療・介護の知識を持った対応。
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-secondary-foreground" />
              </div>
              <CardTitle>地域密着</CardTitle>
              <CardDescription>
                和歌山市内専門で、地域に根ざしたきめ細やかなサービスを提供。
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* 車両タイプセクション */}
      <section className="max-w-6xl mx-auto px-4 py-16 bg-secondary/30 rounded-3xl mx-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">対応車両タイプ</h2>
          <p className="text-muted-foreground">
            様々な身体状況に対応した車両をご用意しています
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">一般車両</CardTitle>
              <CardDescription className="text-sm">
                歩行可能な方向け
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Accessibility className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">車椅子対応</CardTitle>
              <CardDescription className="text-sm">
                車椅子のまま乗車可能
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle className="text-lg">ストレッチャー</CardTitle>
              <CardDescription className="text-sm">
                寝たきりの方向け
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">大型車両</CardTitle>
              <CardDescription className="text-sm">
                複数名での移動に
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* サービス情報セクション */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Phone className="w-6 h-6" />
              お問い合わせ・ご予約
            </CardTitle>
            <CardDescription>
              ご質問やご予約は、お電話にて承っております
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-4xl font-bold text-primary">073-456-6227</div>
            <div className="text-lg text-muted-foreground">09：00-17：00</div>
            <div className="grid md:grid-cols-2 gap-6 text-sm mt-8">
              <div>
                <div className="font-medium text-base mb-2">対応エリア</div>
                <div className="text-muted-foreground">和歌山市内</div>
              </div>
              <div>
                <div className="font-medium text-base mb-2">サービス内容</div>
                <div className="text-muted-foreground">通院・外出支援</div>
              </div>
            </div>
            <Button 
              onClick={() => window.open('tel:073-456-6227')}
              className="w-full max-w-xs mx-auto flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              今すぐ電話する
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* CTAセクション */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold mb-4">
              今すぐ最適な車両を見つけましょう
            </h2>
            <p className="text-lg mb-8 opacity-90">
              質問は3分程度で完了します。お気軽にお試しください。
            </p>
            <Button 
              onClick={onStartQuestions}
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 h-auto"
            >
              質問を始める
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}