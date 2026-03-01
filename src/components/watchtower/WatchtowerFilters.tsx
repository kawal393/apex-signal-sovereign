import { Search } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder: string;
  filters: FilterOption[];
}

export default function WatchtowerFilters({ search, onSearchChange, searchPlaceholder, filters }: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-11 pr-4 py-3 bg-card border border-border/30 rounded-lg text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>
      {filters.map(f => (
        <select
          key={f.label}
          value={f.value}
          onChange={e => f.onChange(e.target.value)}
          className="px-4 py-3 bg-card border border-border/30 rounded-lg text-foreground text-sm focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer min-w-[140px]"
        >
          <option value="">{f.label}</option>
          {f.options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ))}
    </div>
  );
}
