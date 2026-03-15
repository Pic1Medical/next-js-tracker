"use client";

import { useSearchParams } from "next/navigation";

export default function Challenge() {
  const params = useSearchParams().entries();
  console.log(params);
  return <>{params}</>;
}
