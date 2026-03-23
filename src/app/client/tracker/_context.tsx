"use client";
import { useContext, createContext, useState } from "react"

export type CallbackType = ()=>void;
export type CleanupCallbackType = (()=>void) | undefined;
export type OnCleanupCBType = ()=>void;

export type TYPE = {
  canDestroy: boolean;
  destroy: ()=>void;
  register: (cb: CallbackType, onCleanup?: CleanupCallbackType)=>OnCleanupCBType;
};

export const CONTEXT = createContext<TYPE|undefined>(undefined);

export default function TrackerContext(props: Readonly<{ children: React.ReactNode}>) {
  const [callback, setCallback] = useState<[CallbackType,CleanupCallbackType]|undefined>(undefined);

  function destroy() {
    if(callback)
      callback[0]();
  }

  function register(cb: CallbackType, onCleanup?: CleanupCallbackType) {
    setCallback((p)=>{
      if(p) {
        const cleanup = p[1];
        if(cleanup) cleanup();
      }
      return [cb, onCleanup];
    });
    return ()=>{
      if(callback && callback[0] == cb)
        setCallback(undefined);
      onCleanup && onCleanup();
    };
  }

  return <CONTEXT.Provider value={{ canDestroy: !!callback, destroy, register}} {...props}/>;
}

export function useTrackerContext() {
  return useContext(CONTEXT);
}
