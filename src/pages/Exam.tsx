import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useQuestions } from '@/hooks/useQuestions';

const Exam = () => {
  const [searchParams] = useSearchParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const course = searchParams.get('course');
  const difficulty = searchParams.get('difficulty');
  const duration = parseInt(searchParams.get('duration') || '20', 10) * 60;
  const topics = searchParams.get('topics');
  const random = searchParams.get('random') === 'true';
  const topicList = topics ? topics.split(',') : [];

  const { questions: fetchedQuestions } = useQuestions({
    courseId: course || undefined,
    difficulty: difficulty as any || undefined,
    tags: topicList,
  });

  const questions = useMemo(() => {
    if (!fetchedQuestions || fetchedQuestions.length === 0) return [];
    return fetchedQuestions;
  }, [fetchedQuestions]);

  useEffect(() => {
    if (!timeLeft) setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerRef.current as NodeJS.Timeout);
  }, [timeLeft]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    alert('Exam submitted!');
    clearInterval(timerRef.current as NodeJS.Timeout);
  };

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold text-center mb-4">📝 Exam</h1>

      <div className="text-lg font-semibold text-center text-primary mb-4">
        ⏳ Time Left: {formatTime(timeLeft)}
      </div>

      {questions.length > 0 ? (
        <div className="border rounded-lg p-6 bg-white shadow-md">
          <h2 className="text-xl font-semibold text-gray-900">
            Q {currentQuestionIndex + 1} / {questions.length}
          </h2>
          <p className="text-gray-700 mt-2 whitespace-pre-wrap">
            {questions[currentQuestionIndex].content}
          </p>

          <div className="flex justify-between mt-6">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No questions found for the selected criteria.
        </div>
      )}

      <div className="mt-6 text-center">
        <Button onClick={handleSubmit} disabled={questions.length === 0} variant="default">
          ✅ Submit Exam
        </Button>
      </div>
    </div>
  );
};

export default Exam;
