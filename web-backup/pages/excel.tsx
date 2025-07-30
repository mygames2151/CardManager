import { useState } from 'react';
import { ExcelFile } from '@shared/schema';
import { LocalStorage } from '@/lib/storage';
import { useExcelFiles } from '@/hooks/use-storage';
import { useToast } from '@/hooks/use-toast';
import { ExcelEditor } from '@/components/excel/excel-editor';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, FileSpreadsheet, MoreVertical, Plus } from 'lucide-react';

interface ExcelPageProps {
  onShowAddForm: () => void;
  showAddForm: boolean;
  onCloseAddForm: () => void;
}

export default function ExcelPage({ onShowAddForm, showAddForm, onCloseAddForm }: ExcelPageProps) {
  const { files, refreshFiles } = useExcelFiles();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFile, setEditingFile] = useState<ExcelFile | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const { toast } = useToast();

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = () => {
    setEditingFile(null);
    setShowEditor(true);
  };

  const handleEditFile = (file: ExcelFile) => {
    setEditingFile(file);
    setShowEditor(true);
  };

  const handleDeleteFile = (file: ExcelFile) => {
    if (confirm(`Are you sure you want to delete ${file.name}?`)) {
      LocalStorage.deleteExcelFile(file.id);
      refreshFiles();
      toast({
        title: "File Deleted",
        description: "Excel file has been deleted successfully",
      });
    }
  };

  const handleBackupFile = (file: ExcelFile) => {
    // TODO: Implement backup to drive functionality
    toast({
      title: "Backup to Drive",
      description: "Drive backup functionality will be implemented",
    });
  };

  const handleSaveFile = (fileData: ExcelFile) => {
    try {
      if (editingFile) {
        LocalStorage.updateExcelFile(editingFile.id, fileData);
        toast({
          title: "File Updated",
          description: "Excel file has been updated successfully",
        });
      } else {
        LocalStorage.addExcelFile(fileData);
        toast({
          title: "File Created",
          description: "New Excel file has been created successfully",
        });
      }
      
      refreshFiles();
      setShowEditor(false);
      setEditingFile(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save Excel file",
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="p-4 space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search Excel files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Create New Button */}
      <Button onClick={handleCreateNew} className="w-full bg-green-500 hover:bg-green-600 text-white">
        <Plus className="mr-2 h-4 w-4" />
        Create New Excel
      </Button>

      {/* Files List */}
      <div className="space-y-3">
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              {searchTerm ? 'No files found' : 'No Excel files yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {searchTerm ? 'Try a different search term' : 'Create your first Excel file to get started'}
            </p>
          </div>
        ) : (
          filteredFiles.map((file) => (
            <div
              key={file.id}
              className="bg-card rounded-lg p-4 shadow-sm border border-border flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <FileSpreadsheet className="text-green-500 text-2xl mr-3 h-8 w-8" />
                <div>
                  <h3 className="font-semibold">{file.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Modified: {formatDate(file.lastModified)}
                  </p>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleEditFile(file)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBackupFile(file)}>
                    Backup to Drive
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDeleteFile(file)}
                    className="text-red-600"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))
        )}
      </div>

      {/* Excel Editor */}
      <ExcelEditor
        file={editingFile}
        isOpen={showEditor}
        onClose={() => {
          setShowEditor(false);
          setEditingFile(null);
        }}
        onSave={handleSaveFile}
      />
    </div>
  );
}
