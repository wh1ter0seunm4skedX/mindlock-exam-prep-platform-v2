import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuestions } from '@/hooks/useQuestions';
import { Switch } from "@/components/ui/switch";

interface StudyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StudyModal: React.FC<StudyModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [randomQuestions, setRandomQuestions] = useState<boolean>(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const { courses } = useQuestions();

  const handleSubmit = () => {
    if (!selectedCourse || !selectedDifficulty || !selectedDuration) {
      alert("Please select course, difficulty and duration.");
      return;
    }

    const queryParams = new URLSearchParams({
      course: selectedCourse,
      difficulty: selectedDifficulty,
      duration: selectedDuration,
      random: randomQuestions.toString(),
    });

    if (!randomQuestions && selectedTopics.length > 0) {
      queryParams.append("topics", selectedTopics.join(','));
    }

    navigate(`/exam?${queryParams.toString()}`);
    onClose();
  };

  const availableTopics = courses.find((c) => c.id === selectedCourse)?.questionTypes || [];

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Configure Exam Session</AlertDialogTitle>
          <AlertDialogDescription>
            Select course, difficulty, duration, and optionally topics. Enable random mode for shuffled questions.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4 py-4">
          {/* Course */}
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right">Course</Label>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="col-span-2">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty */}
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right">Difficulty</Label>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="col-span-2">
                <SelectValue placeholder="Select Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right">Duration</Label>
            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
              <SelectTrigger className="col-span-2">
                <SelectValue placeholder="Select Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">Short (20 min)</SelectItem>
                <SelectItem value="45">Medium (45 min)</SelectItem>
                <SelectItem value="90">Long (90 min)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Topics */}
          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="text-right">Topics</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  disabled={randomQuestions}
                  className="col-span-2 min-w-[180px] justify-start"
                >
                  {selectedTopics.length > 0
                    ? `${selectedTopics.length} Topics`
                    : "Select Topics"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Select Topics</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-[300px] overflow-y-auto">
                  {availableTopics.map((type) => (
                    <DropdownMenuItem
                      key={type}
                      className="flex items-center cursor-pointer"
                      onClick={() => {
                        setSelectedTopics((prev) =>
                          prev.includes(type)
                            ? prev.filter((t) => t !== type)
                            : [...prev, type]
                        );
                      }}
                    >
                      <div className="mr-2 h-4 w-4 flex items-center justify-center">
                        {selectedTopics.includes(type) && "✓"}
                      </div>
                      <span>{type}</span>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Random Switch */}
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="random" className="text-right">Randomize</Label>
            <div className="col-span-2">
              <Switch
                id="random"
                checked={randomQuestions}
                onCheckedChange={setRandomQuestions}
              />
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StudyModal;
