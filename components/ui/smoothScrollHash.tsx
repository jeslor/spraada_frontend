"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSetShowNotifications } from "@/store";

const SmoothScrollHash = () => {
  const searchParams = useSearchParams();
  const setShowNotifications = useSetShowNotifications();

  useEffect(() => {
    const scrollToHash = () => {
      const id =
        searchParams.get("scrollId") || window.location.hash.replace("#", "");

      if (!id) return;

      // wait for DOM to be ready
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.backgroundColor = "#add3d4"; // highlight for visibility
        setShowNotifications(false);
        setTimeout(() => {
          el.style.transition =
            "background-color 1s Cubic-bezier(0.25, 0.1, 0.25, 1)";
          el.style.backgroundColor = "transparent";
        }, 1000);

        const yOffset = -80; // change if you have a fixed header
        const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      });
    };

    scrollToHash();
  }, [searchParams]);

  return null;
};

export default SmoothScrollHash;
