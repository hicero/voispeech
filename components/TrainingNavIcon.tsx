import BookOpen from "lucide-react/icons/book-open";
import ClipboardList from "lucide-react/icons/clipboard-list";
import MessagesSquare from "lucide-react/icons/messages-square";
import User from "lucide-react/icons/user";
import UiIcon from "./UiIcon";

const ICONS = {
  library: BookOpen,
  community: MessagesSquare,
  progress: ClipboardList,
  membership: User,
} as const;

export default function TrainingNavIcon({ tab }: { tab: keyof typeof ICONS | string }) {
  const icon = ICONS[tab as keyof typeof ICONS] ?? BookOpen;
  return <UiIcon icon={icon} />;
}
