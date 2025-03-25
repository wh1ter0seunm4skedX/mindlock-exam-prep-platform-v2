import { Search, Tag } from "react-feather";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Course } from "@/types";

interface QuestionsFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCourse: string;
  setSelectedCourse: (courseId: string) => void;
  selectedDifficulty: "all" | "easy" | "medium" | "hard";
  setSelectedDifficulty: (difficulty: "all" | "easy" | "medium" | "hard") => void;
  selectedQuestionTypes: string[];
  setSelectedQuestionTypes: (types: string[]) => void;
  availableQuestionTypes: string[];
  courses: Course[];
  onCourseChange: (value: string) => void;
}

export const QuestionsFilter = ({
  searchQuery,
  setSearchQuery,
  selectedCourse,
  setSelectedCourse,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedQuestionTypes,
  setSelectedQuestionTypes,
  availableQuestionTypes,
  courses,
  onCourseChange,
}: QuestionsFilterProps) => {
  return (
    <div className="bg-card rounded-lg p-4 mb-6 border">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select
            value={selectedCourse}
            onValueChange={onCourseChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedDifficulty}
            onValueChange={setSelectedDifficulty}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Difficulty</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[180px] justify-start">
                <Tag className="mr-2 h-4 w-4" />
                {selectedQuestionTypes.length
                  ? `${selectedQuestionTypes.length} Types`
                  : "Question Types"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Question Types</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                {availableQuestionTypes.map((type) => (
                  <DropdownMenuItem
                    key={type}
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                      setSelectedQuestionTypes(
                        selectedQuestionTypes.includes(type)
                          ? selectedQuestionTypes.filter((t) => t !== type)
                          : [...selectedQuestionTypes, type]
                      );
                    }}
                  >
                    <div className="mr-2 h-4 w-4 flex items-center justify-center">
                      {selectedQuestionTypes.includes(type) && "✓"}
                    </div>
                    <span>{type}</span>
                  </DropdownMenuItem>
                ))}
              </div>
              {selectedQuestionTypes.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-center text-destructive focus:text-destructive cursor-pointer"
                    onClick={() => setSelectedQuestionTypes([])}
                  >
                    Clear All
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {selectedQuestionTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedQuestionTypes.map((type) => (
            <Badge
              key={type}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => {
                setSelectedQuestionTypes(
                  selectedQuestionTypes.filter((t) => t !== type)
                );
              }}
            >
              {type}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}; 