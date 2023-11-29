"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default async function HomePage() {
  return (
    <div>
      <h1 className="text-2xl font-medium">Hello World</h1>
      <Button onClick={() => toast.loading("You have been warned!")}>Click me!</Button>
    </div>
  );
}
