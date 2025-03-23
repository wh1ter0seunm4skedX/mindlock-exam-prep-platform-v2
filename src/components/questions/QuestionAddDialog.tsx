import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Check, Plus, Upload, X } from 'lucide-react';
import { Course, Question } from '@/types';
import { useQuestions } from '@/hooks/useQuestions';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useQueryClient } from '@tanstack/react-query';
import { useFirebaseQuestions } from "@/hooks/useFirebaseQuestions";
import { Label } from "@/components/ui/label";

interface QuestionAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuestionAdded: () => void;
}

const formSchema = z.object({
  title: z.string().min(3).max(100),
  content: z.string().optional(),
  course: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  timeEstimate: z.coerce.number().min(1).max(180),
  tags: z.string().optional(),
  questionSource: z.enum(['content', 'image']).default('content')
}).refine((data) => {
  if (data.questionSource === 'content' && !data.content) return false;
  return true;
}, {
  message: 'Question content is required when "Type Question" is selected.',
  path: ['content']
});

const QuestionAddDialog = ({ open, onOpenChange, onQuestionAdded }: QuestionAddDialogProps) => {
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([]);
  const [availableQuestionTypes, setAvailableQuestionTypes] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { courses, addQuestion } = useFirebaseQuestions();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<Omit<Question, "id" | "createdAt" | "updatedAt">>({
    title: "",
    content: "",
    course: "",
    difficulty: "medium",
    tags: [],
    questionTypes: [],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
      course: '',
      difficulty: 'medium',
      timeEstimate: 20,
      tags: '',
      questionSource: 'content'
    }
  });

  const resetAll = () => {
    form.reset();
    setSelectedQuestionTypes([]);
    setAvailableQuestionTypes([]);
    setPreviewImage(null);
    setImageFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addQuestion(formData);
      onQuestionAdded();
      setFormData({
        title: "",
        content: "",
        course: "",
        difficulty: "medium",
        tags: [],
        questionTypes: [],
      });
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleCourseChange = (courseId: string) => {
    form.setValue('course', courseId);
    const course = courses.find(c => c.id === courseId);
    if (course && course.questionTypes) {
      setAvailableQuestionTypes(course.questionTypes);
      setSelectedQuestionTypes([]);
    } else {
      setAvailableQuestionTypes([]);
    }
  };

  const toggleQuestionType = (type: string) => {
    setSelectedQuestionTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setImageFile(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  useEffect(() => {
    if (!open) resetAll();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select
              value={formData.course}
              onValueChange={(value) => setFormData({ ...formData, course: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
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
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value: "easy" | "medium" | "hard") => setFormData({ ...formData, difficulty: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Question</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionAddDialog;
