import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { QuestionStep, UserAnswers } from '../types'
import { questionSteps } from '../data/questions'

interface QuestionFormProps {
  onComplete: (answers: UserAnswers) => void
}

export function QuestionForm({ onComplete }: QuestionFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<UserAnswers>({})

  // 条件に基づいて表示する質問をフィルタリング
  const filteredQuestions = useMemo(() => {
    return questionSteps.filter(question => {
      if (!question.condition) return true
      
      // 条件をチェック
      for (const [key, value] of Object.entries(question.condition)) {
        if (answers[key] !== value) {
          return false
        }
      }
      return true
    })
  }, [answers])

  const currentQuestion = filteredQuestions[currentStep]
  const progress = ((currentStep + 1) / filteredQuestions.length) * 100

  const handleAnswer = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < filteredQuestions.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      onComplete(answers)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const isAnswered = answers[currentQuestion.id] !== undefined

  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case 'single':
        return (
          <RadioGroup
            value={answers[currentQuestion.id] as string || ''}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {currentQuestion.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label 
                  htmlFor={option.value}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )
      
      case 'text':
        return (
          <Input
            type="text"
            value={answers[currentQuestion.id] as string || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="入力してください"
            className="w-full"
          />
        )
      
      case 'date':
        return (
          <Input
            type="date"
            value={answers[currentQuestion.id] as string || ''}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full"
            min={new Date().toISOString().split('T')[0]}
          />
        )
      
      default:
        return null
    }
  }

  if (!currentQuestion) {
    return null
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>質問 {currentStep + 1} / {filteredQuestions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion.title}</CardTitle>
          <CardDescription>{currentQuestion.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderQuestionInput()}
          
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              前へ
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={currentQuestion.required && !isAnswered}
              className="flex items-center gap-2"
            >
              {currentStep === filteredQuestions.length - 1 ? '結果を見る' : '次へ'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}