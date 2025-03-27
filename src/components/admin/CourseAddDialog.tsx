import { Course } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CourseForm } from '@/components/admin';
import { useFirebaseQuestions } from '@/hooks/useFirebaseQuestions';
import { toast } from 'sonner';

interface CourseAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCourseAdded: () => void;
}

const CourseAddDialog = ({
  open,
  onOpenChange,
  onCourseAdded,
}: CourseAddDialogProps) => {
  const { addCourse } = useFirebaseQuestions();

  const handleAddCourse = async (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'questionCount'>) => {
    try {
      await addCourse(course);
      toast.success('Course added successfully');
      onCourseAdded();
    } catch (error) {
      toast.error('Failed to add course');
      console.error('Error adding course:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Course</DialogTitle>
          <DialogDescription>
            Create a new course for the platform
          </DialogDescription>
        </DialogHeader>
        <CourseForm onAddCourse={handleAddCourse} />
      </DialogContent>
    </Dialog>
  );
};

export default CourseAddDialog;