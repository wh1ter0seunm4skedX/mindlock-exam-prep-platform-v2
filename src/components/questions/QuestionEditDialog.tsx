import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Question } from '@/types';

interface QuestionEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: Question | null;
  onQuestionUpdated: () => void;
}

const QuestionEditDialog: React.FC<QuestionEditDialogProps> = ({ open, onOpenChange, question, onQuestionUpdated }) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (question) {
      setTitle(question.title);
      setContent(question.content);
    }
  }, [question]);

  const handleSave = () => {
    // TODO: Implement save logic
    onQuestionUpdated();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
          <DialogDescription>
            Make changes to your question here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Content
            </Label>
            <Input id="content" value={content} onChange={(e) => setContent(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionEditDialog;