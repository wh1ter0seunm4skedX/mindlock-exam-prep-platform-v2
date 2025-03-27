import { useState } from 'react';
import { Question, Course } from '@/types';
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

interface QuestionFormProps {
  courses: Course[];
  onAddQuestion: () => void;
}

const QuestionForm = ({ courses, onAddQuestion }: QuestionFormProps) => {
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    title: '',
    content: '',
    difficulty: 'medium',
    course: '',
    tags: [],
    questionTypes: [],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Question</CardTitle>
        <CardDescription>Create a new question for the platform</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={newQuestion.title}
            onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Input
            id="content"
            value={newQuestion.content}
            onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            value={newQuestion.difficulty}
            onValueChange={(value) => setNewQuestion({ ...newQuestion, difficulty: value as Question['difficulty'] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="course">Course</Label>
          <Select
            value={newQuestion.course}
            onValueChange={(value) => setNewQuestion({ ...newQuestion, course: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={onAddQuestion}>Add Question</Button>
      </CardContent>
    </Card>
  );
};

export default QuestionForm;