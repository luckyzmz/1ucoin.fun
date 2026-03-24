import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-purple-400" />
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-20 border-purple-500/50 bg-slate-900 text-white hover:bg-slate-800">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-purple-500/50">
          <SelectItem value="zh" className="cursor-pointer hover:bg-purple-500/20">
            中文
          </SelectItem>
          <SelectItem value="en" className="cursor-pointer hover:bg-purple-500/20">
            English
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
