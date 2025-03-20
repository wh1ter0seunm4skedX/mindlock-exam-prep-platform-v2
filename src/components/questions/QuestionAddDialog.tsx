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

interface QuestionAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuestionAdded: (question: Question) => void;
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

  const { courses, addQuestion } = useQuestions();
  const queryClient = useQueryClient();

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const tagsArray = values.tags ? values.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      let imageUrl = null;

      if (imageFile) {
        imageUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });
      }

      const newQuestion = await addQuestion({
        title: values.title,
        content: values.questionSource === 'image' ? '' : values.content ?? '',
        course: values.course,
        difficulty: values.difficulty,
        timeEstimate: values.timeEstimate,
        tags: tagsArray,
        questionTypes: selectedQuestionTypes,
        imageUrl
      });

      onQuestionAdded(newQuestion);
      resetAll();
    } catch (error) {
      console.error('Error adding question:', error);
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
      <DialogContent className="w-full max-w-5xl max-h-[90vh] overflow-hidden p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
          <DialogDescription>Create a new question for your course.</DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[70vh] pr-2 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Question Source */}
              <FormField
                control={form.control}
                name="questionSource"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Question Source</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col gap-2">
                        <FormItem className="flex items-center gap-2">
                          <RadioGroupItem value="content" id="q-source-content" />
                          <FormLabel htmlFor="q-source-content">Type Question</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center gap-2">
                          <RadioGroupItem value="image" id="q-source-image" />
                          <FormLabel htmlFor="q-source-image">Upload Image</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter question title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Content */}
              {form.watch('questionSource') === 'content' && (
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Write your question here..." className="min-h-[120px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Image Upload */}
              {form.watch('questionSource') === 'image' && (
                <div className="space-y-3">
                  <FormLabel>Upload Image</FormLabel>
                  <div className="flex gap-2 items-center">
                    <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()} className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      {previewImage ? 'Change Image' : 'Upload Image'}
                    </Button>
                    {previewImage && (
                      <Button type="button" variant="ghost" size="icon" onClick={removeImage}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <input
                      type="file"
                      ref={imageInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                  {previewImage && (
                    <div className="mt-2 border rounded-md overflow-hidden">
                      <img src={previewImage} alt="Preview" className="max-h-[200px] mx-auto rounded-md" />
                    </div>
                  )}
                </div>
              )}

              {/* Course & Difficulty */}
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course</FormLabel>
                      <Select value={field.value} onValueChange={handleCourseChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courses.map(course => (
                            <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Time & Tags */}
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="timeEstimate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Estimate (min)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} max={180} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (comma separated)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. arrays, sorting, math" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Question Types */}
              {form.watch('course') && availableQuestionTypes.length > 0 && (
                <div className="space-y-2">
                  <FormLabel>Question Types</FormLabel>
                  <div className="h-[120px] border rounded-md p-2 overflow-y-auto">
                    {availableQuestionTypes.map(type => (
                      <div
                        key={type}
                        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-accent transition-all
                          ${selectedQuestionTypes.includes(type) ? 'bg-accent' : ''}`}
                        onClick={() => toggleQuestionType(type)}
                      >
                        <div className="h-4 w-4 border rounded-sm flex items-center justify-center">
                          {selectedQuestionTypes.includes(type) && <Check className="h-3 w-3" />}
                        </div>
                        <span className="text-sm">{type}</span>
                      </div>
                    ))}
                  </div>
                  {selectedQuestionTypes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedQuestionTypes.map(type => (
                        <Badge
                          key={type}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => toggleQuestionType(type)}
                        >
                          {type} <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionAddDialog;
