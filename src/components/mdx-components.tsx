"use client";

import * as runtime from "react/jsx-runtime";
import Image from "next/image";
import { Callout } from "@/components/mdx/callout";
import { YouTube } from "@/components/mdx/youtube";

const components = {
  Image,
  Callout,
  YouTube,
};

function useMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
}

interface MDXContentProps {
  code: string;
}

export function MDXContent({ code }: MDXContentProps) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}
