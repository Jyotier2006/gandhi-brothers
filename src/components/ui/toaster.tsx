"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-ink group-[.toaster]:border-ink-100 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-ink/70",
          actionButton:
            "group-[.toast]:bg-terracotta group-[.toast]:text-white",
          cancelButton:
            "group-[.toast]:bg-cream group-[.toast]:text-ink",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
export { toast } from "sonner";
