import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Question, Course } from '@/types';
import { Pencil, Trash2 } from 'lucide-react';
import QuestionAddDialog from '@/components/questions/QuestionAddDialog';
import QuestionEditDialog from '@/components/questions/QuestionEditDialog';

interface QuestionManagementProps {
  questions: Question[];
  courses: Course[];
  onDeleteQuestion: (id: string) => Promise<void>;
}

export const QuestionManagement = ({
  questions,
  courses,
  onDeleteQuestion,
}: QuestionManagementProps) => {
  const [showAddQuestionDialog, setShowAddQuestionDialog] = useState(false);
  const [showEditQuestionDialog, setShowEditQuestionDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  return (
    <div className="space-y-4">
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
                    onClick={() => {
                      setSelectedQuestion(question);
                      setShowEditQuestionDialog(true);
                    }}
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

      {showAddQuestionDialog && (
        <QuestionAddDialog
          open={showAddQuestionDialog}
          onOpenChange={setShowAddQuestionDialog}
          onQuestionAdded={() => {
            setShowAddQuestionDialog(false);
          }}
        />
      )}

      {selectedQuestion && showEditQuestionDialog && (
        <QuestionEditDialog
          open={showEditQuestionDialog}
          onOpenChange={(open) => {
            setShowEditQuestionDialog(open);
            if (!open) setSelectedQuestion(null);
          }}
          question={selectedQuestion}
          onQuestionUpdated={() => {
            setShowEditQuestionDialog(false);
            setSelectedQuestion(null);
          }}
        />
      )}
    </div>
  );
};
