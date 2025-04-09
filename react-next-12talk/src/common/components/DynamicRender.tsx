import useSWR from "swr";
import React from "react";
import LoadingSpinner from "@/common/components/LoadingSpinner";
import ErrorShower from "@/common/components/Error";

export const defaultOptions = {
  suspense: false,
  ssr: false,
  errorRetryInterval: 1000,
  errorRetryCount: 3,
  // onErrorRetry: () => {},
};

interface Prop {
  url: string;
  fetcher: (url: string) => Promise<string>;
  children: (data: any) => React.ReactNode;
  options?: {};
}

export default function DynamicRender(prop: Prop) {
  let { options } = prop;
  if (!options) {
    options = defaultOptions;
  }
  const { data, isLoading, error } = useSWR(prop.url, prop.fetcher, options);
  debugger;
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorShower error={error} />;
  return <div>{prop.children(data)}</div>;
}
