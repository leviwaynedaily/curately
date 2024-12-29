import { cn } from "@/lib/utils";

type DisplayCellProps = {
  value: string | number | null;
  onClick: () => void;
  className?: string;
  type?: 'text' | 'number' | 'price';
};

export const DisplayCell = ({
  value,
  onClick,
  className,
  type = 'text'
}: DisplayCellProps) => {
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick();
  };

  const displayValue = type === 'price' && typeof value === 'number'
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    : value;

  return (
    <div 
      onDoubleClick={handleDoubleClick}
      className={cn(
        "cursor-pointer truncate",
        className
      )}
    >
      {displayValue}
    </div>
  );
};