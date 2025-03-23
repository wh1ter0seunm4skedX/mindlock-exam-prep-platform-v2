import { useState } from 'react';
import { useFirebaseQuestions } from '@/hooks/useFirebaseQuestions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Question, Course } from '@/types';
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react';
import QuestionAddDialog from '@/components/questions/QuestionAddDialog';
import QuestionEditDialog from '@/components/questions/QuestionEditDialog';
import { eraseAndReinitializeFirebase } from '@/lib/initFirebase';

const Admin = () => {
  const {
    questions,
    courses,
    loading: questionsLoading,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addCourse,
  } = useFirebaseQuestions();

  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    title: '',
    content: '',
    difficulty: 'medium',
    course: '',
    tags: [],
    questionTypes: [],
  });

  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    name: '',
    description: '',
    questionTypes: [],
  });

  const [showAddQuestionDialog, setShowAddQuestionDialog] = useState(false);
  const [showEditQuestionDialog, setShowEditQuestionDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isReinitializing, setIsReinitializing] = useState(false);

  const handleReinitialize = async () => {
    if (!window.confirm('This will erase all data and reinitialize with mock data. Are you sure?')) {
      return;
    }

    try {
      setIsReinitializing(true);
      await eraseAndReinitializeFirebase();
      toast.success('Database reinitialized successfully');
    } catch (error) {
      toast.error('Failed to reinitialize database');
      console.error(error);
    } finally {
      setIsReinitializing(false);
    }
  };

  const handleAddQuestion = async (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addQuestion(question);
      toast.success('Question added successfully');
      setShowAddQuestionDialog(false);
    } catch (error) {
      toast.error('Failed to add question');
      console.error(error);
    }
  };

  const handleUpdateQuestion = async (id: string, updates: Partial<Question>) => {
    try {
      await updateQuestion(id, updates);
      toast.success('Question updated successfully');
      setShowEditQuestionDialog(false);
      setSelectedQuestion(null);
    } catch (error) {
      toast.error('Failed to update question');
      console.error(error);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    
    try {
      await deleteQuestion(id);
      toast.success('Question deleted successfully');
    } catch (error) {
      toast.error('Failed to delete question');
      console.error(error);
    }
  };

  const handleAddCourse = async (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'questionCount'>) => {
    try {
      await addCourse(course);
      toast.success('Course added successfully');
    } catch (error) {
      toast.error('Failed to add course');
      console.error(error);
    }
  };

  if (questionsLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReinitialize}
            disabled={isReinitializing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isReinitializing ? 'animate-spin' : ''}`} />
            {isReinitializing ? 'Reinitializing...' : 'Reinitialize Database'}
          </Button>
          <Button onClick={() => setShowAddQuestionDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>
      </div>

      <Tabs defaultValue="questions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4">
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
              <Button onClick={() => setShowAddQuestionDialog(true)}>Add Question</Button>
            </CardContent>
          </Card>

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
                        onClick={() => handleDeleteQuestion(question.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New Course</CardTitle>
              <CardDescription>Create a new course for the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="courseName">Name</Label>
                <Input
                  id="courseName"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseDescription">Description</Label>
                <Input
                  id="courseDescription"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                />
              </div>
              <Button onClick={() => setShowAddQuestionDialog(true)}>Add Course</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Courses List</CardTitle>
              <CardDescription>Manage existing courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{course.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {course.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <QuestionAddDialog
        open={showAddQuestionDialog}
        onOpenChange={setShowAddQuestionDialog}
        onQuestionAdded={() => {
          setShowAddQuestionDialog(false);
          toast.success('Question added successfully');
        }}
      />

      {selectedQuestion && (
        <QuestionEditDialog
          open={showEditQuestionDialog}
          onOpenChange={setShowEditQuestionDialog}
          question={selectedQuestion}
          onQuestionUpdated={() => {
            setShowEditQuestionDialog(false);
            setSelectedQuestion(null);
            toast.success('Question updated successfully');
          }}
        />
      )}
    </div>
  );
};

export default Admin; 