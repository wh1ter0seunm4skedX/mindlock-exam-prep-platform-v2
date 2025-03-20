
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Save, Send, Book, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useQuestions } from '@/hooks/useQuestions';
import { Question } from '@/types';

const Study = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const [userAnswer, setUserAnswer] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const { allQuestions, updateQuestion, courses } = useQuestions();
  const [question, setQuestion] = useState<Question | null>(null);
  const [startTime] = useState<Date>(new Date());

  // Load the question
  useEffect(() => {
    if (questionId && allQuestions.length > 0) {
      const foundQuestion = allQuestions.find(q => q.id === questionId);
      if (foundQuestion) {
        setQuestion(foundQuestion);
        // Load saved user answer if exists
        if (foundQuestion.userAnswer) {
          setUserAnswer(foundQuestion.userAnswer);
        }
      } else {
        // Question not found
        toast.error('Question not found');
        navigate('/questions');
      }
    }
  }, [questionId, allQuestions, navigate]);

  // Get the course name
  const courseName = question ? 
    courses.find(c => c.id === question.course)?.name || 'Unknown Course' : '';

  const handleSaveAnswer = async () => {
    if (!question) return;
    
    try {
      setSaveStatus('saving');
      // Update the question with the user's answer
      await updateQuestion(question.id, { userAnswer });
      setSaveStatus('saved');
      toast.success('Answer saved successfully');
      
      // After a few seconds, clear the status
      setTimeout(() => {
        setSaveStatus('');
      }, 2000);
    } catch (error) {
      console.error('Error saving answer:', error);
      setSaveStatus('');
      toast.error('Failed to save answer');
    }
  };

  const handleBackToQuestions = () => {
    navigate('/questions');
  };

  if (!question) {
    return (
      <div className="container mx-auto h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-muted"></div>
          <div className="h-4 w-24 rounded bg-muted"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="py-4 px-6 border-b flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={handleBackToQuestions}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{question.timeEstimate || '?'} min</span>
          </Badge>
          <Badge
            variant={
              question.difficulty === 'easy'
                ? 'secondary'
                : question.difficulty === 'medium'
                ? 'default'
                : question.difficulty === 'hard'
                ? 'destructive'
                : 'outline'
            }
          >
            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
          </Badge>
          <Badge variant="outline">{courseName}</Badge>
        </div>
      </div>

      {/* Question content */}
      <div className="flex-grow overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">{question.title}</h1>
          
          {/* Question tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {question.tags.map(tag => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
            {question.questionTypes && question.questionTypes.map(type => (
              <Badge key={type} variant="outline">
                {type}
              </Badge>
            ))}
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-6">
              <p className="whitespace-pre-wrap">{question.content}</p>
              
              {/* Display image if present */}
              {question.imageUrl && (
                <div className="mt-4">
                  <img
                    src={question.imageUrl}
                    alt="Question illustration"
                    className="max-w-full rounded-md"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-3 flex items-center">
              <Book className="mr-2" size={20} />
              Your Answer
            </h2>
            <Textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="min-h-[200px] font-mono"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={handleSaveAnswer}
              className="flex items-center gap-2"
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Answer
                </>
              )}
            </Button>
            <Button onClick={handleBackToQuestions} className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Finish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Study;
