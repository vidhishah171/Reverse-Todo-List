import { type Category } from "@/types";

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export function CategoryBadge({ category, className = "" }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-medium ${className}`}
      style={{
        backgroundColor: `${category.color}22`,
        color: category.color,
        border: `1px solid ${category.color}44`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: category.color }}
      />
      {category.name}
    </span>
  );
}
