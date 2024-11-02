"use client";

import { Dropzone, DropzoneState } from "@/components/ui/dropzone";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoMdArrowDown } from "react-icons/io";
import { useState } from "react";
import { useServerAction } from "@/lib/hooks/useServerAction";
import { uploadFileAction } from "@/lib/actions/uploadFile";
import { OvalLoader } from "./loader";

export default function ZipDropZone() {
  const [file, setFile] = useState<File | null>(null);
  const [upload, isUploading] = useServerAction(uploadFileAction);
  return (
    <>
      <div className="border border-dotted border-black/80 text-sm font-medium rounded-lg transition-all">
        <Dropzone
          accept={{
            "application/zip": [".zip"],
          }}
          maxSize={10 * 1024 * 1024}
          onDropRejected={(rejections, ev) => {
            rejections[0].errors.forEach((error) => {
              console.log(error.message);
            });
          }}
          onDrop={(acceptedFiles) => {
            console.log(acceptedFiles);
            setFile(acceptedFiles[0]);
            const formData = new FormData();
            formData.append("file", acceptedFiles[0]);
            upload({ formData });
          }}
        >
          {(dropzone: DropzoneState) => (
            <div>
              {dropzone.isDragAccept ? (
                <div className="flex flex-row items-center gap-2">
                  <IoMdArrowDown size={20} />
                  Drop your zip file here
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex flex-row items-center gap-2 text-sm font-medium py-20 cursor-pointer">
                    <MdOutlineFileUpload size={20} />
                    {file ? file.name : "Upload your zip file"}
                  </div>
                </div>
              )}
            </div>
          )}
        </Dropzone>
      </div>
      <div className="flex flex-row items-center justify-center pt-4">
        {isUploading && <OvalLoader className="text-foreground" />}
      </div>
    </>
  );
}
