'use client'
import React from "react";
import UseAnimations from "react-useanimations";
import loading from "react-useanimations/lib/loading";

export default function LoadingSpinner() {
  return <UseAnimations animation={loading} size={56} />;
}
