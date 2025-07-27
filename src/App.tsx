import { useState } from 'react'
import { Header } from './components/Header'
import { HomePage } from './components/HomePage'
import { QuestionForm } from './components/QuestionForm'
import { ResultsPage } from './components/ResultsPage'
import { UserAnswers } from './types'

type AppState = 'home' | 'questions' | 'results'

function App() {
  const [currentState, setCurrentState] = useState<AppState>('home')
  const [answers, setAnswers] = useState<UserAnswers>({})

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
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-4">お問い合わせ</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>📞 073-456-6227</p>
                <p>🕒 09：00-17：00</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">サービス内容・対応エリア</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• 通院・外出支援</p>
                <p>• 対応エリア：和歌山市内</p>
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