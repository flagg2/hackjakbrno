"use client";

import { useParams } from "next/navigation";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { GrDocumentZip } from "react-icons/gr";
import Link from "next/link";

export default function DocumentInfo() {
  const { fileId } = useParams<{ fileId?: string }>();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={"default"}
          className="relative h-8 w-fit rounded-full"
        >
          <div className="flex flex-row items-center gap-2">
            <GrDocumentZip className="h-6 w-6" />
            {fileId !== undefined ? (
              <p>Document Info</p>
            ) : (
              <p>No file selected</p>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-bold">
              {fileId !== undefined ? `Document ${fileId}` : "No file selected"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Link href="/upload">Upload new file </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
