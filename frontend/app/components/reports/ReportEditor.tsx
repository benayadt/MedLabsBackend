'use client';

import React, { useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Undo,
  Redo,
  Save
} from 'lucide-react';
import { Button } from '../ui/Button';

interface ReportEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave?: () => void;
  placeholder?: string;
  autoSave?: boolean;
  autoSaveDelay?: number;
  className?: string;
  readOnly?: boolean;
}

export const ReportEditor: React.FC<ReportEditorProps> = ({
  content,
  onChange,
  onSave,
  placeholder = 'Start typing your report...',
  autoSave = false,
  autoSaveDelay = 2000,
  className = '',
  readOnly = false
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph']
      })
    ],
    content,
    editable: !readOnly,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] px-4 py-3 text-gray-900'
      }
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    }
  });

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !onSave || readOnly) return;

    const timeoutId = setTimeout(() => {
      onSave();
    }, autoSaveDelay);

    return () => clearTimeout(timeoutId);
  }, [content, autoSave, autoSaveDelay, onSave, readOnly]);

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const ToolbarButton = useCallback(({ 
    onClick, 
    isActive = false, 
    disabled = false,
    children,
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded hover:bg-gray-100 transition-colors ${
        isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  ), []);

  if (!editor) {
    return <div className="text-gray-500">Loading editor...</div>;
  }

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      {!readOnly && (
        <div className="border-b border-gray-300 bg-gray-50 p-2 flex flex-wrap gap-1 items-center">
          {/* Text Formatting */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
              title="Underline (Ctrl+U)"
            >
              <UnderlineIcon className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Headings */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Lists */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Alignment */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' })}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              isActive={editor.isActive({ textAlign: 'center' })}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* History */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Save Button */}
          {onSave && (
            <div className="ml-auto">
              <Button
                size="sm"
                onClick={onSave}
                className="flex items-center gap-1"
              >
                <Save className="w-4 h-4" />
                Save
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Editor Content */}
      <div className={`bg-white ${readOnly ? 'p-4' : ''}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

// Read-only version for viewing reports
export const ReportViewer: React.FC<{ content: string; className?: string }> = ({ 
  content, 
  className = '' 
}) => {
  return (
    <ReportEditor
      content={content}
      onChange={() => {}}
      readOnly={true}
      className={className}
    />
  );
};
