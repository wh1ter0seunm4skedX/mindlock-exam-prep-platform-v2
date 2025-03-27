import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuestionList from './QuestionList';
import CourseForm from './CourseForm';
import CourseList from './CourseList';
import { Question, Course } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AdminTabsProps {
  questions: Question[];
  courses: Course[];
  onEditQuestion: (question: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onAddQuestion: () => void;
  onAddCourse: () => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
}

const AdminTabs = ({
  questions,
  courses,
  onEditQuestion,
  onDeleteQuestion,
  onAddQuestion,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
}: AdminTabsProps) => {
  return (
    <Tabs defaultValue="questions" className="space-y-4">
      <TabsList>
        <TabsTrigger value="questions">Questions</TabsTrigger>
        <TabsTrigger value="courses">Courses</TabsTrigger>
      </TabsList>

      <TabsContent value="questions" className="space-y-4">
        <div className="flex justify-center mb-6">
          <Button onClick={onAddQuestion} size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Add New Question
          </Button>
        </div>
        <QuestionList
          questions={questions}
          courses={courses}
          onEditQuestion={onEditQuestion}
          onDeleteQuestion={onDeleteQuestion}
        />
      </TabsContent>

      <TabsContent value="courses" className="space-y-4">
        <div className="flex justify-center mb-6">
          <Button onClick={onAddCourse} size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Add New Course
          </Button>
        </div>
        <CourseList 
          courses={courses} 
          onEditCourse={onEditCourse}
          onDeleteCourse={onDeleteCourse}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabs;