import { useState, useRef, useEffect } from 'react';
import { GripVertical, Sparkles, Trash2, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface BulletEditorCardProps {
  id: string;
  content: string;
  index: number;
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  onGenerateAI: (id: string, content: string, section: string) => void;
  section: string;
  isDragging?: boolean;
  dragHandleProps?: any;
}

export default function BulletEditorCard({
  id,
  content,
  index,
  onUpdate,
  onDelete,
  onGenerateAI,
  section,
  isDragging = false,
  dragHandleProps,
}: BulletEditorCardProps) {
  const [editorContent, setEditorContent] = useState(content);
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    setEditorContent(content);
  }, [content]);

  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    // Listen to text-change events to ensure content is updated
    const updateContent = () => {
      requestAnimationFrame(() => {
        const updatedContent = quill.root.innerHTML;
        // Only update if content actually changed to avoid loops
        if (updatedContent !== editorContent && updatedContent !== content) {
          setEditorContent(updatedContent);
          onUpdate(id, updatedContent);
        }
      });
    };

    quill.on('text-change', updateContent);
    quill.on('editor-change', (eventName) => {
      if (eventName === 'format-change' || eventName === 'text-change') {
        updateContent();
      }
    });

    return () => {
      quill.off('text-change', updateContent);
      quill.off('editor-change');
    };
  }, [id, onUpdate]); // Removed editorContent and content from deps to avoid loops

  const handleChange = (value: string) => {
    setEditorContent(value);
    onUpdate(id, value);
  };

  const modules = {
    toolbar: false, // We'll use custom toolbar
  };

  const formats = ['bold', 'italic', 'underline', 'align', 'list'];

  const handleFormat = (format: string) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    
    // Ensure editor has focus
    quill.focus();

    if (format === 'bold') {
      quill.format('bold', !quill.getFormat().bold);
    } else if (format === 'italic') {
      quill.format('italic', !quill.getFormat().italic);
    } else if (format === 'underline') {
      quill.format('underline', !quill.getFormat().underline);
    } else if (format.startsWith('align')) {
      const align = format.split('-')[1];
      const length = quill.getLength();
      
      // Ensure there's content to format
      if (length <= 1) {
        quill.setText('\n');
      }
      
      const range = quill.getSelection(true); // Get current selection or create one at cursor
      
      // For alignment, we need to format the block (paragraph)
      if (range) {
        // Get the line/block at the cursor position
        const [line, offset] = quill.getLine(range.index);
        if (line) {
          const lineStart = range.index - offset;
          const lineLength = line.length();
          // Format the entire line/block
          quill.formatText(lineStart, lineLength, 'align', align);
        } else {
          // Format entire content (excluding trailing newline)
          quill.formatText(0, Math.max(1, length - 1), 'align', align);
        }
      } else {
        // No selection: format entire content
        quill.formatText(0, Math.max(1, length - 1), 'align', align);
      }
      
      // For left align, always explicitly set it to ensure it's applied
      if (align === 'left') {
        const currentFormat = quill.getFormat(range);
        // Always set left alignment explicitly, even if it's the default
        if (range) {
          const [line, offset] = quill.getLine(range.index);
          if (line) {
            const lineStart = range.index - offset;
            const lineLength = line.length();
            // First remove any existing alignment
            quill.formatText(lineStart, lineLength, 'align', false);
            // Then explicitly set left
            quill.formatText(lineStart, lineLength, 'align', 'left');
          }
        }
      }
    } else if (format === 'list') {
      const length = quill.getLength();
      
      // Ensure there's content to format (at least a newline)
      if (length <= 1) {
        // If empty, add a paragraph first
        quill.setText('\n');
      }
      
      const range = quill.getSelection(true); // Get current selection or create one at cursor
      const currentFormat = quill.getFormat(range);
      
      if (currentFormat.list) {
        // Remove list formatting
        if (range) {
          // Get the line/block
          const [line, offset] = quill.getLine(range.index);
          if (line) {
            const lineStart = range.index - offset;
            const lineLength = line.length();
            quill.formatText(lineStart, lineLength, 'list', false);
          } else {
            quill.formatText(0, Math.max(1, length - 1), 'list', false);
          }
        } else {
          quill.formatText(0, Math.max(1, length - 1), 'list', false);
        }
      } else {
        // Apply list formatting
        if (range) {
          // Get the line/block to format
          const [line, offset] = quill.getLine(range.index);
          if (line) {
            const lineStart = range.index - offset;
            const lineLength = line.length();
            // Format the entire line/block as a list
            quill.formatText(lineStart, lineLength, 'list', 'bullet');
          } else {
            // Format entire content
            quill.formatText(0, Math.max(1, length - 1), 'list', 'bullet');
          }
        } else {
          // No selection: format entire content
          quill.formatText(0, Math.max(1, length - 1), 'list', 'bullet');
        }
      }
    }
    
    // Read the updated HTML and update parent component
    // Use double requestAnimationFrame to ensure Quill has updated DOM
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const updatedContent = quill.root.innerHTML;
        console.log(`Format "${format}" applied, HTML:`, updatedContent); // Debug log
        console.log('Quill length:', quill.getLength()); // Debug log
        console.log('Current format:', quill.getFormat()); // Debug log
        setEditorContent(updatedContent);
        onUpdate(id, updatedContent);
      });
    });
  };

  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm border-2 border-gray-100 mb-4 transition-all ${
        isDragging ? 'opacity-50' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Drag Handle */}
        <div
          {...dragHandleProps}
          className="cursor-move mt-2 text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="w-5 h-5" />
        </div>

        {/* Editor Content */}
        <div className="flex-1">
          {/* Formatting Toolbar */}
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-200">
            <button
              onClick={() => handleFormat('bold')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFormat('italic')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFormat('underline')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <button
              onClick={() => handleFormat('align-left')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFormat('align-center')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleFormat('align-right')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <button
              onClick={() => handleFormat('list')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Rich Text Editor */}
          <ReactQuill
            ref={quillRef}
            value={editorContent}
            onChange={handleChange}
            modules={modules}
            formats={formats}
            placeholder="Enter your CV bullet point..."
            className="bg-white"
            style={{ fontFamily: 'Lato, sans-serif' }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onGenerateAI(id, editorContent, section)}
            className="bg-[#2782EA] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1e6bc7] transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Generate with AI
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

