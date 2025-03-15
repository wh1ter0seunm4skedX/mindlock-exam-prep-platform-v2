
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit,
  ArrowUp, 
  ArrowDown, 
  Clock,
  Filter as FilterIcon,
  X,
  Tag,
  GraduationCap,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter, 
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger, 
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useQuestions } from '@/hooks/useQuestions';
import { Question, Course } from '@/types';

const Questions = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<'title' | 'difficulty' | 'createdAt'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);
  
  const {
    questions,
    courses,
    loading,
    error,
    addQuestion,
    updateQuestion,
    deleteQuestion,
  } = useQuestions({
    courseId: selectedCourse || undefined,
    difficulty: selectedDifficulty as any || undefined,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
    searchQuery: searchQuery || undefined,
  });

  // Extract all unique tags from questions
  useEffect(() => {
    const tags = new Set<string>();
    questions.forEach(question => {
      question.tags.forEach(tag => tags.add(tag));
    });
    setAllTags(Array.from(tags));
  }, [questions]);

  const toggleSortDirection = () => {
    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const changeSort = (field: 'title' | 'difficulty' | 'createdAt') => {
    if (field === sortField) {
      toggleSortDirection();
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    if (sortField === 'title') {
      return sortDirection === 'asc'
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
    
    if (sortField === 'difficulty') {
      const difficultyOrder = { easy: 1, medium: 2, hard: 3, expert: 4 };
      return sortDirection === 'asc'
        ? difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        : difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
    }
    
    // Default sort by createdAt
    return sortDirection === 'asc'
      ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCourse('');
    setSelectedDifficulty('');
    setSelectedTags([]);
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      await deleteQuestion(id);
      toast.success('Question deleted successfully');
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const handleStudyQuestion = (question: Question) => {
    navigate(`/study/${question.id}`);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Questions</h1>
          <p className="text-muted-foreground">
            Manage and organize your practice questions
          </p>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="group flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Add Question</span>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type="text"
              placeholder="Search questions..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            className={showFilters ? 'bg-primary/10' : ''}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon size={18} className="mr-2" />
            Filters
            {(selectedCourse || selectedDifficulty || selectedTags.length > 0) && (
              <Badge variant="secondary" className="ml-2">
                {[
                  selectedCourse && '1',
                  selectedDifficulty && '1',
                  selectedTags.length > 0 && `${selectedTags.length}`,
                ]
                  .filter(Boolean)
                  .reduce((a, b) => Number(a) + Number(b), 0)}
              </Badge>
            )}
          </Button>
          <Select
            value={sortField}
            onValueChange={(value) => changeSort(value as any)}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center">
                <span>Sort by</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSortDirection();
                  }}
                >
                  {sortDirection === 'asc' ? (
                    <ArrowUp size={16} />
                  ) : (
                    <ArrowDown size={16} />
                  )}
                </Button>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="difficulty">Difficulty</SelectItem>
              <SelectItem value="createdAt">Date Added</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <Card className="animate-fade-in">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label className="mb-2 block">Course</Label>
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Courses</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block">Difficulty</Label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Difficulties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Difficulties</SelectItem>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-2 block">Tags</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between">
                        {selectedTags.length > 0 ? (
                          <>
                            <span>
                              {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''} selected
                            </span>
                            <Badge variant="secondary">{selectedTags.length}</Badge>
                          </>
                        ) : (
                          <span>Select tags</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command className="rounded-lg border shadow-md">
                        <CommandInput placeholder="Search tags..." />
                        <CommandList>
                          <CommandEmpty>No tags found.</CommandEmpty>
                          <CommandGroup>
                            {allTags.map((tag) => (
                              <CommandItem
                                key={tag}
                                onSelect={() => {
                                  setSelectedTags((prev) =>
                                    prev.includes(tag)
                                      ? prev.filter((t) => t !== tag)
                                      : [...prev, tag]
                                  );
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <Checkbox
                                    checked={selectedTags.includes(tag)}
                                    onCheckedChange={() => {
                                      setSelectedTags((prev) =>
                                        prev.includes(tag)
                                          ? prev.filter((t) => t !== tag)
                                          : [...prev, tag]
                                      );
                                    }}
                                  />
                                  <span>{tag}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                        <div className="border-t p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full"
                            onClick={() => setSelectedTags([])}
                          >
                            Clear
                          </Button>
                        </div>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground"
                >
                  <X size={16} className="mr-2" />
                  Clear All Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-muted"></div>
            <div className="h-4 w-24 rounded bg-muted"></div>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">
          Error loading questions. Please try again.
        </div>
      ) : sortedQuestions.length === 0 ? (
        <div className="text-center py-12">
          <div className="rounded-full bg-muted w-16 h-16 mx-auto flex items-center justify-center mb-4">
            <Search size={24} className="text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No questions found</h2>
          <p className="text-muted-foreground mb-6">
            {selectedCourse || selectedDifficulty || selectedTags.length > 0 || searchQuery
              ? "Try adjusting your filters or search query"
              : "Add your first question to get started"}
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus size={18} className="mr-2" />
            Add Question
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedQuestions.map((question) => {
            const course = courses.find((c) => c.id === question.course);
            return (
              <Card key={question.id} className="neo-morphism hover:shadow-lg transition-all overflow-hidden group">
                <CardHeader className="p-6 pb-3">
                  <div className="flex justify-between items-start">
                    <Badge
                      variant={
                        question.difficulty === 'easy'
                          ? 'secondary'
                          : question.difficulty === 'medium'
                          ? 'default'
                          : question.difficulty === 'hard'
                          ? 'destructive'
                          : 'outline'
                      }
                      className="mb-2"
                    >
                      {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(question.id);
                        }}
                      >
                        <Trash2 size={16} className="text-muted-foreground hover:text-destructive" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit size={16} className="text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold line-clamp-2">
                    {question.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-3">
                  <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                    <GraduationCap size={16} />
                    <span>{course?.name || 'Unknown Course'}</span>
                  </div>
                  <p className="text-muted-foreground line-clamp-3 mb-4">
                    {question.content}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {question.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {question.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{question.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock size={14} className="mr-1" />
                    <span>{question.timeEstimate || '?'} min</span>
                  </div>
                  <Button onClick={() => handleStudyQuestion(question)}>
                    Study Now
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Question Dialog */}
      <AddQuestionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        courses={courses}
        allTags={allTags}
        onAddQuestion={addQuestion}
      />
    </div>
  );
};

// Command component for the tag selection
const Command = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`rounded-md border shadow-md ${className}`}
      {...props}
    />
  );
};

const CommandInput = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className="flex items-center border-b px-3">
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <input
        className={`flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    </div>
  );
};

const CommandList = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`max-h-[300px] overflow-y-auto overflow-x-hidden ${className}`}
      {...props}
    />
  );
};

const CommandEmpty = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`py-6 text-center text-sm ${className}`}
      {...props}
    />
  );
};

const CommandGroup = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`overflow-hidden p-1 text-foreground ${className}`}
      {...props}
    />
  );
};

const CommandItem = ({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground w-full ${className}`}
      {...props}
    />
  );
};

// Add Question Dialog Component
interface AddQuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: Course[];
  allTags: string[];
  onAddQuestion: (question: Omit<Question, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Question>;
}

const AddQuestionDialog = ({
  open,
  onOpenChange,
  courses,
  allTags,
  onAddQuestion,
}: AddQuestionDialogProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [solution, setSolution] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'expert'>('medium');
  const [courseId, setCourseId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [timeEstimate, setTimeEstimate] = useState('15');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setSolution('');
    setDifficulty('medium');
    setCourseId('');
    setTags([]);
    setNewTag('');
    setTimeEstimate('15');
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleToggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content || !courseId) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newQuestion = {
        title,
        content,
        solution,
        difficulty,
        course: courseId,
        tags,
        timeEstimate: parseInt(timeEstimate, 10) || 15,
      };
      
      await onAddQuestion(newQuestion);
      toast.success('Question added successfully');
      handleClose();
    } catch (error) {
      console.error('Error adding question:', error);
      toast.error('Failed to add question');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
          <DialogDescription>
            Create a new question for your practice sessions.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="mb-2 block">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Binary Search Implementation"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="content" className="mb-2 block">
              Question Content <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe the question in detail..."
              rows={5}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="course" className="mb-2 block">
                Course <span className="text-destructive">*</span>
              </Label>
              <Select value={courseId} onValueChange={setCourseId} required>
                <SelectTrigger id="course">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="difficulty" className="mb-2 block">
                Difficulty
              </Label>
              <Select 
                value={difficulty}
                onValueChange={(value) => setDifficulty(value as any)}
              >
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="tags" className="mb-2 block">
              Tags
            </Label>
            <div className="flex items-center mb-2">
              <div className="relative flex-grow">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  id="newTag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="pl-10"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                className="ml-2"
              >
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="px-2 py-1">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveTag(tag)}
                    className="h-auto p-0 ml-1"
                  >
                    <X size={14} />
                  </Button>
                </Badge>
              ))}
            </div>
            
            {allTags.length > 0 && (
              <div>
                <Label className="text-sm text-muted-foreground mb-1 block">
                  Common tags:
                </Label>
                <div className="flex flex-wrap gap-2">
                  {allTags
                    .filter((tag) => !tags.includes(tag))
                    .slice(0, 8)
                    .map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-secondary"
                        onClick={() => handleToggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="solution" className="mb-2 block">
              Solution (Optional)
            </Label>
            <Textarea
              id="solution"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              placeholder="Add a solution or explanation..."
              rows={4}
            />
          </div>
          
          <div>
            <Label htmlFor="timeEstimate" className="mb-2 block">
              Time Estimate (minutes)
            </Label>
            <Input
              id="timeEstimate"
              type="number"
              value={timeEstimate}
              onChange={(e) => setTimeEstimate(e.target.value)}
              min="1"
              max="120"
            />
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                'Add Question'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Questions;
