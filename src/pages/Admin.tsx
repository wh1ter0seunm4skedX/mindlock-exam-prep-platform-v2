import { useState } from 'react';
import { useFirebaseQuestions } from '@/hooks/useFirebaseQuestions';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, RefreshCw } from 'lucide-react';
import { eraseAndReinitializeFirebase } from '@/lib/initFirebase';
import { CourseManagement } from '@/components/admin/CourseManagement';
import { QuestionManagement } from '@/components/admin/QuestionManagement';
import QuestionAddDialog from '@/components/questions/QuestionAddDialog';

const Admin = () => {
  const {
    questions,
    courses,
    loading: questionsLoading,
    addQuestion,
    deleteQuestion,
    addCourse,
  } = useFirebaseQuestions();

  const [showAddQuestionDialog, setShowAddQuestionDialog] = useState(false);
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

  const handleAddQuestion = async (question: any) => {
    try {
      await addQuestion(question);
      toast.success('Question added successfully');
      setShowAddQuestionDialog(false);
    } catch (error) {
      toast.error('Failed to add question');
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

  const handleAddCourse = async (course: any) => {
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

        <TabsContent value="questions">
          <QuestionManagement
            questions={questions}
            courses={courses}
            onDeleteQuestion={handleDeleteQuestion}
          />
        </TabsContent>

        <TabsContent value="courses">
          <CourseManagement
            courses={courses}
            onAddCourse={handleAddCourse}
          />
        </TabsContent>
      </Tabs>

      {showAddQuestionDialog && (
        <QuestionAddDialog
          open={showAddQuestionDialog}
          onOpenChange={setShowAddQuestionDialog}
          onQuestionAdded={() => {
            setShowAddQuestionDialog(false);
            toast.success('Question added successfully');
          }}
        />
      )}
    </div>
  );
};

export default Admin;