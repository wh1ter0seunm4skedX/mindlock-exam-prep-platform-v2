import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Plus,
  Clock,
  Filter,
  ArrowDown,
  BookOpen,
  Search,
  Tag,
  Edit,
  Trash2,
  Book,
} from "react-feather";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useQuestions } from "@/hooks/useQuestions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import QuestionAddDialog from "@/components/questions/QuestionAddDialog";
import QuestionEditDialog from "@/components/questions/QuestionEditDialog";
import { toast } from "sonner";

const Questions = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>(
    searchParams.get("courseId") || ""
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>(
    []
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [availableQuestionTypes, setAvailableQuestionTypes] = useState<
    string[]
  >([]);

  const handleEditQuestion = (questionId: string) => {
    setEditingQuestionId(questionId);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      deleteQuestion(questionId);
      toast.success("Question deleted successfully!");
    }
  };

  const {
    questions: fetchedQuestions,
    courses,
    loading,
    error,
    deleteQuestion,
  } = useQuestions({
    courseId: selectedCourse || undefined,
    difficulty: (selectedDifficulty as any) || undefined,
    searchQuery: searchQuery || undefined,
  });

  const questions = fetchedQuestions;

  // Filter questions based on selected question types
  const filteredQuestions =
    selectedQuestionTypes.length > 0
      ? questions.filter((q) =>
          q.questionTypes?.some((type) => selectedQuestionTypes.includes(type))
        )
      : questions;

  // Update available question types when course changes
  useEffect(() => {
    if (selectedCourse) {
      const course = courses.find((c) => c.id === selectedCourse);
      setAvailableQuestionTypes(course?.questionTypes || []);
      // Reset selected question types when course changes
      setSelectedQuestionTypes([]);
    } else {
      // If no course selected, combine all question types from all courses
      const allTypes = courses.flatMap((c) => c.questionTypes || []);
      setAvailableQuestionTypes([...new Set(allTypes)]);
    }
  }, [selectedCourse, courses]);

  const handleStudyQuestion = (questionId: string) => {
    navigate(`/study/${questionId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Questions</h1>
          <p className="text-muted-foreground">
            Browse and study questions from your courses
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Question
          </Button>
        </div>
      </div>

      {/* Filters */}
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
              onValueChange={(value) => {
                setSelectedCourse(value === "all" ? undefined : value);
                navigate(`/questions?courseId=${value === "all" ? "" : value}`); // Update URL
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedDifficulty}
              onValueChange={(value) =>
                setSelectedDifficulty(value === "all" ? undefined : value)
              }
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
                <Button
                  variant="outline"
                  className="min-w-[180px] justify-start"
                >
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
                        setSelectedQuestionTypes((prev) =>
                          prev.includes(type)
                            ? prev.filter((t) => t !== type)
                            : [...prev, type]
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
                  setSelectedQuestionTypes((prev) =>
                    prev.filter((t) => t !== type)
                  );
                }}
              >
                {type} ✕
              </Badge>
            ))}
            {selectedQuestionTypes.length > 1 && (
              <Badge
                variant="outline"
                className="cursor-pointer"
                onClick={() => setSelectedQuestionTypes([])}
              >
                Clear All
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Question Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse shadow-lg rounded-xl">
              <CardHeader>
                <div className="h-5 bg-muted rounded-md w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded-md w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-muted rounded-md"></div>
              </CardContent>
              <CardFooter>
                <div className="h-8 bg-muted rounded-md w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-red-500 text-lg font-medium mb-4">
            Error loading questions
          </p>
          <Button
            className="px-6 py-2 text-lg"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg shadow-lg">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Questions Found</h2>
          <p className="text-muted-foreground mb-4">
            {selectedCourse ||
            selectedDifficulty ||
            selectedQuestionTypes.length > 0 ||
            searchQuery
              ? "Try adjusting your filters to see more questions."
              : "You don't have any questions yet. Add your first question to get started."}
          </p>
          <Button
            className="px-6 py-2 text-lg"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Question
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((question) => {
            const course = courses.find((c) => c.id === question.course);

            return (
              <Card
                key={question.id}
                className="flex flex-col rounded-xl shadow-md hover:shadow-xl transition-all"
              >
                <CardHeader className="p-5">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg truncate font-semibold">
                      {question.title}
                    </CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge
                      variant={
                        question.difficulty === "easy"
                          ? "secondary"
                          : question.difficulty === "medium"
                          ? "secondary"
                          : question.difficulty === "hard"
                          ? "destructive"
                          : "outline"
                      }
                      className={`
    text-sm px-2 py-1 rounded-md
    ${question.difficulty === "easy" ? "bg-green-300" : ""}
    ${question.difficulty === "medium" ? "bg-yellow-400" : ""}
    ${question.difficulty === "hard" ? "bg-red-400" : ""}
  `}
                    >
                      {question.difficulty.charAt(0).toUpperCase() +
                        question.difficulty.slice(1)}
                    </Badge>

                    <Badge
                      variant="outline"
                      className="text-sm px-2 py-1 rounded-md"
                      style={{
                        backgroundColor: course?.color
                          ? `${course.color}20`
                          : undefined,
                        color: course?.color || undefined,
                      }}
                    >
                      {course?.name || "Unknown"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="flex-grow p-5">
                  {question.imageUrl ? (
                    <img
                      src={question.imageUrl}
                      alt={question.title}
                      className="max-h-[200px] w-full object-cover rounded-md mb-2"
                    />
                  ) : (
                    <p className="text-muted-foreground line-clamp-3 text-sm">
                      {question.content}
                    </p>
                  )}
                  {question.questionTypes?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {question.questionTypes.map((type) => (
                        <Badge
                          key={type}
                          variant="outline"
                          className="text-xs px-2 py-1"
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="p-4">
                  <div className="flex items-center justify-end gap-3 w-full">
                    <Button
                      onClick={() => handleStudyQuestion(question.id)}
                      variant="ghost"
                      className="p-2 transition-all rounded-lg hover:bg-green-600 hover:text-white"
                    >
                      <Book className="h-5 w-5" />
                    </Button>
                    <Button
                      onClick={() => handleEditQuestion(question.id)}
                      variant="ghost"
                      className="p-2 transition-all rounded-lg hover:bg-orange-500 hover:text-white"
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteQuestion(question.id)}
                      variant="ghost"
                      className="p-2 transition-all rounded-lg hover:bg-red-600 hover:text-white"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Question Dialog */}
      <QuestionAddDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onQuestionAdded={() => {
          setShowAddDialog(false);
          toast.success("Question added successfully!");
        }}
      />
      {/* Edit Question Dialog */}
      {editingQuestionId && (
        <QuestionEditDialog
          open={editingQuestionId !== null}
          onOpenChange={(open) => {
            if (!open) {
              setEditingQuestionId(null);
            }
          }}
          question={questions.find((q) => q.id === editingQuestionId) || null}
          onQuestionUpdated={() => {
            setEditingQuestionId(null);
            toast.success("Question updated successfully!");
          }}
        />
      )}
    </div>
  );
};

export default Questions;
