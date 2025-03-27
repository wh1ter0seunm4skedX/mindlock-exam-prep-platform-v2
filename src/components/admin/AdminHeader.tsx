import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface AdminHeaderProps {
  onReinitialize: () => void;
  isReinitializing: boolean;
}

const AdminHeader = ({ onReinitialize, isReinitializing }: AdminHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onReinitialize}
          disabled={isReinitializing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isReinitializing ? 'animate-spin' : ''}`} />
          {isReinitializing ? 'Reinitializing...' : 'Reinitialize Database'}
        </Button>
      </div>
    </div>
  );
};

export default AdminHeader;