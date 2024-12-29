import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";

type EditableCellProps = {
  value: string | number;
  type?: 'text' | 'number' | 'textarea';
  onSave: (value: string | number) => void;
  onCancel: () => void;
  autoFocus?: boolean;
};

export const EditableCell = ({
  value,
  type = 'text',
  onSave,
  onCancel,
  autoFocus = true,
}: EditableCellProps) => {
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      console.log("Focusing input");
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSave(currentValue);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  if (type === 'textarea') {
    return (
      <Textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => onSave(currentValue)}
        className="w-full min-h-[60px]"
      />
    );
  }

  return (
    <Input
      ref={inputRef as React.RefObject<HTMLInputElement>}
      type={type}
      value={currentValue}
      onChange={(e) => setCurrentValue(type === 'number' ? parseFloat(e.target.value) : e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={() => onSave(currentValue)}
      className="w-full"
    />
  );
};