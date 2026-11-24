import { Avatar as LegacyAvatar } from "@/app/components/ui/Avatar";
import type { ComponentProps } from "react";
/** Temporary compatibility adapter until the avatar family is migrated. */
export type AvatarProps=ComponentProps<typeof LegacyAvatar>;
export const Avatar=LegacyAvatar;
