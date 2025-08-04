"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";

interface GeneratedAvatarProps {
  seed: string;
  className?: string;
  variant: "botttsNeutral" | "initials";
}

export const GeneratedAvatar = ({
  seed,
  className,
  variant,
}: GeneratedAvatarProps) => {
  const [dataUri, setDataUri] = useState<string>();

  useEffect(() => {
    const generateAvatar = async () => {
      const avatar =
        variant === "botttsNeutral"
          ? createAvatar(botttsNeutral, { seed })
          : createAvatar(initials, {
              seed,
              fontWeight: 500,
              fontSize: 42,
            });

      const uri = await avatar.toDataUri();
      setDataUri(uri);
    };

    generateAvatar();
  }, [seed, variant]);

  return (
    <Avatar className={cn(className)}>
      {dataUri && <AvatarImage src={dataUri} alt="Avatar" />}
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};
