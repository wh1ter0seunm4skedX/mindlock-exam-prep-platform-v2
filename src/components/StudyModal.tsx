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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface StudyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StudyModal: React.FC<StudyModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [question1, setQuestion1] = useState('');
  const [question2, setQuestion2] = useState('');

  const handleSubmit = () => {
    // Process the answers and navigate to the study session
    // For now, just navigate to the study page
    navigate('/study');
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Prepare for Study Session</AlertDialogTitle>
          <AlertDialogDescription>
            Answer a few questions to tailor your study session.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="question1" className="text-right">
              Question 1
            </Label>
            <Input id="question1" value={question1} onChange={(e) => setQuestion1(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="question2" className="text-right">
              Question 2
            </Label>
            <Input id="question2" value={question2} onChange={(e) => setQuestion2(e.target.value)} className="col-span-3" />
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