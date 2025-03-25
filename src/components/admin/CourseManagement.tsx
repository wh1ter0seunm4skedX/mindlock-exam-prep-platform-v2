import { useState } from 'react';
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
import { Course } from '@/types';
import { toast } from 'sonner';

interface CourseManagementProps {
  courses: Course[];
  onAddCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'questionCount'>) => Promise<void>;
}

export const CourseManagement = ({ courses, onAddCourse }: CourseManagementProps) => {
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    name: '',
    description: '',
    questionTypes: [],
  });

  const handleSubmit = async () => {
    if (!newCourse.name || !newCourse.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await onAddCourse(newCourse as Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'questionCount'>);
      setNewCourse({
        name: '',
        description: '',
        questionTypes: [],
      });
    } catch (error) {
      console.error('Failed to add course:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Course</CardTitle>
          <CardDescription>Create a new course for the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Course Name</Label>
            <Input
              id="name"
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            />
          </div>
          <Button onClick={handleSubmit}>Add Course</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Courses List</CardTitle>
          <CardDescription>View existing courses</CardDescription>
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
                  <p className="text-sm text-muted-foreground">{course.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Question Types: {course.questionTypes?.join(', ') || 'None'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
