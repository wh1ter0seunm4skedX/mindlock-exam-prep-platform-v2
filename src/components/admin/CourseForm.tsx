import { useState } from 'react';
import { Course } from '@/types';
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

interface CourseFormProps {
  onAddCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'questionCount'>) => Promise<void>;
}

const CourseForm = ({ onAddCourse }: CourseFormProps) => {
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    name: '',
    description: '',
    questionTypes: [],
  });

  const handleSubmit = async () => {
    if (!newCourse.name) return;
    
    try {
      await onAddCourse({
        name: newCourse.name,
        description: newCourse.description || '',
        questionTypes: newCourse.questionTypes || [],
      });
      
      // Reset form after successful submission
      setNewCourse({
        name: '',
        description: '',
        questionTypes: [],
      });
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  return (
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
        <Button onClick={handleSubmit}>Add Course</Button>
      </CardContent>
    </Card>
  );
};

export default CourseForm;