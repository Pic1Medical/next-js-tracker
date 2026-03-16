"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ClientPortalProps {
  children: React.ReactNode;
  selector?: string; // Optional selector for a specific target element
}

const ClientPortal: React.FC<ClientPortalProps> = ({
  children,
  selector = "body",
}) => {
  const [mounted, setMounted] = useState(false);
  const [targetElement, setTargetElement] = useState<Element | null>(null);

  useEffect(() => {
    // This runs only on the client side after mounting
    setMounted(true);
    setTargetElement(document.querySelector(selector));

    return () => {
      setMounted(false);
    };
  }, [selector]);

  // Render the portal only if mounted on the client and the target element is found
  return mounted && targetElement
    ? createPortal(children, targetElement)
    : null;
};

export default ClientPortal;
