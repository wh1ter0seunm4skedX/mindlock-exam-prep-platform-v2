import { useState } from 'react';
import { useFirebaseQuestions } from '@/hooks/useFirebaseQuestions';
import { toast } from 'sonner';
import { Question, Course } from '@/types';
import QuestionAddDialog from '@/components/questions/QuestionAddDialog';
import QuestionEditDialog from '@/components/questions/QuestionEditDialog';
import { eraseFirebaseCollections } from '@/lib/initFirebase';
import { AdminHeader, AdminTabs, CourseAddDialog } from '@/components/admin';
import CourseEditDialog from '@/components/admin/CourseEditDialog';

const Admin = () => {
  const {
    questions,
    courses,
    loading: questionsLoading,
    deleteQuestion,
    deleteCourse,
  } = useFirebaseQuestions();


  const [showAddQuestionDialog, setShowAddQuestionDialog] = useState(false);
  const [showEditQuestionDialog, setShowEditQuestionDialog] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isReinitializing, setIsReinitializing] = useState(false);
  const [showAddCourseDialog, setShowAddCourseDialog] = useState(false);
  const [showEditCourseDialog, setShowEditCourseDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleReinitialize = async () => {
    if (!window.confirm('This will erase all data and reinitialize with mock data. Are you sure?')) {
      return;
    }

    try {
      setIsReinitializing(true);
      await eraseFirebaseCollections();
      toast.success('Database reinitialized successfully');
    } catch (error) {
      toast.error('Failed to reinitialize database');
      console.error(error);
    } finally {
      setIsReinitializing(false);
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

  const handleDeleteCourse = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    
    try {
      await deleteCourse(id);
      toast.success('Course deleted successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete course');
      console.error(error);
    }
  };



  if (questionsLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <AdminHeader
        onReinitialize={handleReinitialize}
        isReinitializing={isReinitializing}
      />

      <AdminTabs
        questions={questions}
        courses={courses}
        onEditQuestion={(question) => {
          setSelectedQuestion(question);
          setShowEditQuestionDialog(true);
        }}
        onDeleteQuestion={handleDeleteQuestion}
        onAddQuestion={() => setShowAddQuestionDialog(true)}
        onAddCourse={async () => setShowAddCourseDialog(true)}
        onEditCourse={(course) => {
          setSelectedCourse(course);
          setShowEditCourseDialog(true);
        }}
        onDeleteCourse={handleDeleteCourse}
      />

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

      <CourseAddDialog
        open={showAddCourseDialog}
        onOpenChange={setShowAddCourseDialog}
        onCourseAdded={() => {
          setShowAddCourseDialog(false);
          toast.success('Course added successfully');
        }}
      />

      {selectedCourse && (
        <CourseEditDialog
          open={showEditCourseDialog}
          onOpenChange={setShowEditCourseDialog}
          course={selectedCourse}
          onCourseUpdated={() => {
            setShowEditCourseDialog(false);
            setSelectedCourse(null);
          }}
        />
      )}
    </div>
  );
};

export default Admin;