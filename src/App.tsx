import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { HomePage } from './components/HomePage'
import { QuestionForm } from './components/QuestionForm'
import { ResultsPage } from './components/ResultsPage'
import { UserAnswers } from './types'
import { blink } from './blink/client'

type AppState = 'home' | 'questions' | 'results'

function App() {
  const [currentState, setCurrentState] = useState<AppState>('home')
  const [answers, setAnswers] = useState<UserAnswers>({})
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const handleStartQuestions = () => {
    setCurrentState('questions')
  }

  const handleQuestionsComplete = (userAnswers: UserAnswers) => {
    setAnswers(userAnswers)
    setCurrentState('results')
  }

  const handleBackToQuestions = () => {
    setCurrentState('questions')
  }

  const handleBackToHome = () => {
    setCurrentState('home')
    setAnswers({})
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold">ログインが必要です</h2>
          <p className="text-muted-foreground">
            介護車両予約支援システムをご利用いただくには、ログインが必要です。
          </p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            ログイン
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pb-8">
        {currentState === 'home' && (
          <HomePage onStartQuestions={handleStartQuestions} />
        )}
        
        {currentState === 'questions' && (
          <div className="py-8">
            <QuestionForm onComplete={handleQuestionsComplete} />
          </div>
        )}
        
        {currentState === 'results' && (
          <div className="py-8">
            <ResultsPage 
              answers={answers} 
              onBack={handleBackToQuestions}
            />
          </div>
        )}
      </main>
      
      {/* フッター */}
      <footer className="bg-secondary/30 border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">お問い合わせ</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>📞 0120-123-456</p>
                <p>📧 info@kaigo-vehicle.jp</p>
                <p>🕒 24時間365日対応</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">サービス内容</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• 介護車両の予約・手配</p>
                <p>• 医療機関への送迎</p>
                <p>• デイサービス送迎</p>
                <p>• 緊急搬送対応</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">対応エリア</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• 東京都全域</p>
                <p>• 神奈川県全域</p>
                <p>• 埼玉県全域</p>
                <p>• 千葉県全域</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 介護車両予約支援システム. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App