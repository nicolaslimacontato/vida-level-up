"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface FilterOption {
  value: string;
  label: string;
  icon?: string;
}

interface AdvancedFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  categoryValue: string;
  onCategoryChange: (value: string) => void;
  statusValue: string;
  onStatusChange: (value: string) => void;
  categoryOptions: FilterOption[];
  statusOptions: FilterOption[];
  className?: string;
}

export function AdvancedFilters({
  searchValue,
  onSearchChange,
  categoryValue,
  onCategoryChange,
  statusValue,
  onStatusChange,
  categoryOptions,
  statusOptions,
  className,
}: AdvancedFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = categoryValue !== "all" || statusValue !== "all";

  const clearFilters = () => {
    onCategoryChange("all");
    onStatusChange("all");
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Filter Toggle */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar quests..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "relative",
            hasActiveFilters && "border-blue-500 bg-blue-50 dark:bg-blue-950",
          )}
        >
          <Filter className="h-4 w-4" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-500" />
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-card rounded-lg border p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium">Filtros Avançados</h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="mr-1 h-4 w-4" />
                    Limpar
                  </Button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Categoria</label>
                  <Select
                    value={categoryValue}
                    onValueChange={onCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            {option.icon && <span>{option.icon}</span>}
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusValue} onValueChange={onStatusChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            {option.icon && <span>{option.icon}</span>}
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
