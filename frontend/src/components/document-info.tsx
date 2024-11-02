"use client";

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

type DocumentInfoProps = {
  fileId?: string;
};

export default function DocumentInfo({ fileId }: DocumentInfoProps) {
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
              <p>Manage file</p>
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

        <DropdownMenuItem asChild>
          <Link href="/upload" className="cursor-pointer">
            Upload another file
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
