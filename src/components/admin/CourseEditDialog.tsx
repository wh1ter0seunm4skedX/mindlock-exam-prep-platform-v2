import { Course } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { useFirebaseQuestions } from '@/hooks/useFirebaseQuestions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CourseEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course;
  onCourseUpdated: () => void;
}

const CourseEditDialog = ({
  open,
  onOpenChange,
  course,
  onCourseUpdated,
}: CourseEditDialogProps) => {
  const { updateCourse } = useFirebaseQuestions();
  const [editedCourse, setEditedCourse] = useState<Partial<Course>>({
    name: course.name,
    description: course.description || '',
    questionTypes: course.questionTypes || [],
  });

  const handleUpdateCourse = async () => {
    if (!editedCourse.name) return;
    
    try {
      await updateCourse(course.id, {
        name: editedCourse.name,
        description: editedCourse.description,
        questionTypes: editedCourse.questionTypes,
      });
      toast.success('Course updated successfully');
      onCourseUpdated();
    } catch (error) {
      toast.error('Failed to update course');
      console.error('Error updating course:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Course</DialogTitle>
          <DialogDescription>
            Update the course information
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="courseName">Name</Label>
            <Input
              id="courseName"
              value={editedCourse.name}
              onChange={(e) => setEditedCourse({ ...editedCourse, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="courseDescription">Description</Label>
            <Input
              id="courseDescription"
              value={editedCourse.description}
              onChange={(e) => setEditedCourse({ ...editedCourse, description: e.target.value })}
            />
          </div>
          <Button onClick={handleUpdateCourse}>Update Course</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseEditDialog;