import { useState, useEffect } from 'react';
import { ExcelFile } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Trash2 } from 'lucide-react';

interface ExcelEditorProps {
  file: ExcelFile | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: ExcelFile) => void;
}

export function ExcelEditor({ file, isOpen, onClose, onSave }: ExcelEditorProps) {
  const [data, setData] = useState<string[][]>([]);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (file) {
      setData(file.data);
      setFileName(file.name);
    } else {
      // Initialize with empty data
      setData(Array(10).fill(null).map(() => Array(5).fill('')));
      setFileName('');
    }
  }, [file]);

  const updateCell = (row: number, col: number, value: string) => {
    const newData = [...data];
    newData[row][col] = value;
    setData(newData);
  };

  const addRow = () => {
    setData([...data, Array(data[0]?.length || 5).fill('')]);
  };

  const addColumn = () => {
    setData(data.map(row => [...row, '']));
  };

  const removeRow = (index: number) => {
    if (data.length > 1) {
      setData(data.filter((_, i) => i !== index));
    }
  };

  const removeColumn = (index: number) => {
    if (data[0]?.length > 1) {
      setData(data.map(row => row.filter((_, i) => i !== index)));
    }
  };

  const handleSave = () => {
    if (!fileName.trim()) {
      alert('Please enter a file name');
      return;
    }

    const excelFile: ExcelFile = {
      id: file?.id || '',
      name: fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`,
      data,
      lastModified: new Date(),
    };

    onSave(excelFile);
  };

  const getColumnLabel = (index: number) => {
    return String.fromCharCode(65 + index); // A, B, C, etc.
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-semibold">Excel Editor</span>
            <Input
              placeholder="File name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-48"
            />
          </div>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-auto max-h-96">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
              <tr>
                <th className="w-12 p-2 border border-gray-300 dark:border-gray-600"></th>
                {data[0]?.map((_, colIndex) => (
                  <th key={colIndex} className="p-2 border border-gray-300 dark:border-gray-600 font-semibold min-w-24 relative group">
                    {getColumnLabel(colIndex)}
                    <Button
                      onClick={() => removeColumn(colIndex)}
                      size="sm"
                      variant="ghost"
                      className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 p-1 h-auto"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </th>
                ))}
                <th className="p-2 border border-gray-300 dark:border-gray-600">
                  <Button onClick={addColumn} size="sm" variant="ghost">
                    <Plus className="h-3 w-3" />
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="group">
                  <td className="p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 font-semibold text-center relative">
                    {rowIndex + 1}
                    <Button
                      onClick={() => removeRow(rowIndex)}
                      size="sm"
                      variant="ghost"
                      className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 h-auto"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </td>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className="p-0 border border-gray-300 dark:border-gray-600">
                      <Input
                        value={cell}
                        onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                        className="border-none rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </td>
                  ))}
                  <td className="p-2 border border-gray-300 dark:border-gray-600"></td>
                </tr>
              ))}
              <tr>
                <td className="p-2 border border-gray-300 dark:border-gray-600">
                  <Button onClick={addRow} size="sm" variant="ghost">
                    <Plus className="h-3 w-3" />
                  </Button>
                </td>
                <td colSpan={data[0]?.length || 1} className="p-2 border border-gray-300 dark:border-gray-600"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-600 flex justify-end space-x-2">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
