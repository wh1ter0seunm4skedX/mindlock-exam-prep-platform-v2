import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Plus } from "react-feather";
import { Button } from "@/components/ui/button";
import { useFirebaseQuestions } from "@/hooks/useFirebaseQuestions";
import QuestionAddDialog from "@/components/questions/QuestionAddDialog";
import QuestionEditDialog from "@/components/questions/QuestionEditDialog";
import { QuestionsFilter } from "@/components/questions/QuestionsFilter";
import { QuestionCard } from "@/components/questions/QuestionCard";
import { toast } from "sonner";

const Questions = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>(
    searchParams.get("courseId") || "all"
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<"all" | "easy" | "medium" | "hard">("all");
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [availableQuestionTypes, setAvailableQuestionTypes] = useState<string[]>([]);

  const {
    questions: fetchedQuestions,
    courses,
    loading,
    error,
    deleteQuestion,
  } = useFirebaseQuestions({
    courseId: selectedCourse === "all" ? undefined : selectedCourse,
    difficulty: selectedDifficulty === "all" ? undefined : selectedDifficulty,
    searchQuery: searchQuery.trim() || undefined,
  });

  // Filter questions based on selected question types
  const filteredQuestions = fetchedQuestions.filter(question => {
    if (selectedQuestionTypes.length === 0) return true;
    return question.questionTypes?.some(type => selectedQuestionTypes.includes(type));
  });

  // Update available question types when course changes
  useEffect(() => {
    if (selectedCourse && selectedCourse !== "all") {
      const course = courses.find((c) => c.id === selectedCourse);
      setAvailableQuestionTypes(course?.questionTypes || []);
      setSelectedQuestionTypes([]);
    } else {
      const allTypes = courses.flatMap((c) => c.questionTypes || []);
      setAvailableQuestionTypes([...new Set(allTypes)]);
    }
  }, [selectedCourse, courses]);

  const handleEditQuestion = (questionId: string) => {
    setEditingQuestionId(questionId);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      deleteQuestion(questionId);
      toast.success("Question deleted successfully!");
    }
  };

  const handleStudyQuestion = (questionId: string) => {
    navigate(`/study/${questionId}`);
  };

  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);
    navigate(`/questions?courseId=${value === "all" ? "" : value}`);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[200px] text-destructive">
          Error: {error.toString()}
        </div>
      </div>
    );
  }

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

      <QuestionsFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        selectedQuestionTypes={selectedQuestionTypes}
        setSelectedQuestionTypes={setSelectedQuestionTypes}
        availableQuestionTypes={availableQuestionTypes}
        courses={courses}
        onCourseChange={handleCourseChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuestions.map((question) => {
          const course = courses.find(c => c.id === question.course);
          return (
            <QuestionCard
              key={question.id}
              question={{
                ...question,
                course: course ? { name: course.name } : undefined
              }}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
              onStudy={handleStudyQuestion}
            />
          );
        })}
      </div>

      {showAddDialog && (
        <QuestionAddDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onQuestionAdded={() => {
            setShowAddDialog(false);
            toast.success("Question added successfully!");
          }}
        />
      )}

      {editingQuestionId && (
        <QuestionEditDialog
          open={!!editingQuestionId}
          onOpenChange={() => setEditingQuestionId(null)}
          question={fetchedQuestions.find((q) => q.id === editingQuestionId) || null}
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
