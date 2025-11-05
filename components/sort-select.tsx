"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SortOption } from "@/types/entities";
import { motion } from "framer-motion";

interface SortSelectProps {
  value: SortOption;
  onValueChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "En Yeni" },
  { value: "most_liked", label: "En Çok Beğenilen" },
  { value: "most_commented", label: "En Çok Yorumlanan" },
];

export function SortSelect({ value, onValueChange }: SortSelectProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[180px] border-border/40 bg-card/50 backdrop-blur-sm">
          <SelectValue placeholder="Sırala" />
        </SelectTrigger>
        <SelectContent className="border-border/40">
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </motion.div>
  );
}
