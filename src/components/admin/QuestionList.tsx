import { Question, Course } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pencil, Trash2 } from 'lucide-react';

interface QuestionListProps {
  questions: Question[];
  courses: Course[];
  onEditQuestion: (question: Question) => void;
  onDeleteQuestion: (id: string) => void;
}

const QuestionList = ({ questions, courses, onEditQuestion, onDeleteQuestion }: QuestionListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Questions List</CardTitle>
        <CardDescription>Manage existing questions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{question.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {courses.find((c) => c.id === question.course)?.name} •{' '}
                  {question.difficulty}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEditQuestion(question)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteQuestion(question.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionList;