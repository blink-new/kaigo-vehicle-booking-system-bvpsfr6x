import { Car, Heart } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Car className="w-8 h-8 text-primary" />
                <Heart className="w-4 h-4 text-accent absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  介護車両予約支援システム
                </h1>
                <p className="text-sm text-muted-foreground">
                  安心・安全な移動をサポート
                </p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span>09：00-17：00</span>
            </div>
            <div className="text-primary font-medium">
              📞 073-456-6227
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}