import { BookOpen, ClipboardList, MessagesSquare, User } from "lucide-react";
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
