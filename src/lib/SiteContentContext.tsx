import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SiteContentSettings } from "../types";
import { CmsDataEngine, DEFAULT_CMS_CONTENT, sanitizeSiteContent } from "./cmsDataEngine";

interface SiteContentContextType {
  content: SiteContentSettings;
  isLoading: boolean;
  updateContent: (newSettings: SiteContentSettings, updatedBy?: string) => Promise<void>;
  resetContent: (updatedBy?: string) => Promise<void>;
  refreshContent: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export const SiteContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContentSettings>(DEFAULT_CMS_CONTENT);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    // 1. Initial Load from engine (cache/firestore)
    CmsDataEngine.getSiteContent().then(initialData => {
      if (isMounted) {
        setContent(sanitizeSiteContent(initialData));
        setIsLoading(false);
      }
    });

    // 2. Real-time Subscription to Firestore /site_content/main_config
    const unsubscribe = CmsDataEngine.subscribeSiteContent(updated => {
      if (isMounted) {
        setContent(sanitizeSiteContent(updated));
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const updateContent = async (newSettings: SiteContentSettings, updatedBy?: string) => {
    const sanitized = sanitizeSiteContent(newSettings);
    setContent(sanitized); // Optimistic UI update
    await CmsDataEngine.saveSiteContent(sanitized, updatedBy);
  };

  const resetContent = async (updatedBy?: string) => {
    const defaultData = await CmsDataEngine.resetToDefaults(updatedBy);
    setContent(sanitizeSiteContent(defaultData));
  };

  const refreshContent = async () => {
    setIsLoading(true);
    const latest = await CmsDataEngine.getSiteContent();
    setContent(sanitizeSiteContent(latest));
    setIsLoading(false);
  };

  return (
    <SiteContentContext.Provider
      value={{
        content,
        isLoading,
        updateContent,
        resetContent,
        refreshContent
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
};

export function useSiteContent(): SiteContentContextType {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error("useSiteContent must be used within a SiteContentProvider");
  }
  return ctx;
}
