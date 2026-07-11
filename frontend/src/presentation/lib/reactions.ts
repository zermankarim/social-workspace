import {
  HandHeart,
  Heart,
  Lightbulb,
  PartyPopper,
  Smile,
  ThumbsUp,
  type LucideIcon,
} from "lucide-react";
import { PostLikeType } from "@/core/domain/enums/post-like-type.enum";

export type ReactionOption = {
  type: PostLikeType;
  labelKey:
    "like" | "congratulations" | "support" | "super" | "informative" | "fun";
  icon: LucideIcon;
  colorClass: string;
};

export const REACTION_OPTIONS: ReactionOption[] = [
  {
    type: PostLikeType.LIKE,
    labelKey: "like",
    icon: ThumbsUp,
    colorClass: "text-[#0a66c2]",
  },
  {
    type: PostLikeType.CONGRATULATIONS,
    labelKey: "congratulations",
    icon: PartyPopper,
    colorClass: "text-[#44712e]",
  },
  {
    type: PostLikeType.SUPPORT,
    labelKey: "support",
    icon: HandHeart,
    colorClass: "text-[#915907]",
  },
  {
    type: PostLikeType.SUPER,
    labelKey: "super",
    icon: Heart,
    colorClass: "text-[#b24020]",
  },
  {
    type: PostLikeType.INFORMATIVE,
    labelKey: "informative",
    icon: Lightbulb,
    colorClass: "text-[#915907]",
  },
  {
    type: PostLikeType.FUN,
    labelKey: "fun",
    icon: Smile,
    colorClass: "text-[#c37d16]",
  },
];

export function getReactionOption(type: PostLikeType): ReactionOption {
  return (
    REACTION_OPTIONS.find((option) => option.type === type) ??
    REACTION_OPTIONS[0]!
  );
}
