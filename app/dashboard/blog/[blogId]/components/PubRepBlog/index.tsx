"use client";
import PubRepBlogDrawer from "./Drawer";
import { PubRepBlogProvider } from "./provider";

export default function PubRepBlog() {
  return (
    <PubRepBlogProvider>
      <PubRepBlogDrawer />
    </PubRepBlogProvider>
  );
}
