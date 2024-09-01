"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

export function AddPdfComponentDynamic({ value }: { value: string }) {
  const [fileName, setFileName] = useState<string>("No file selected");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  let inputFileRef = useRef<HTMLInputElement | null>(null);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }
    const file = inputFileRef.current.files[0];
    if (!file) return alert("No file added");
    if (file.size > 5000000) {
      alert("File Minimum 5MB");
      setIsSaving(false);
      return;
    }
    await fetch(`/api/${value}/upload/pdf-upload?filename=${file.name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: file,
    })
      .then((res) => res.json())
      .catch((e) => {
        console.log({ e });
        setIsSaving(false);
        alert("File no uploadeed");
      });
    setFileName("No file selected");
    inputFileRef.current = null;
    router.refresh();
    setIsSaving(false);
    setOpen(false);
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName("No file selected");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add Pdf {value}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Pdf</DialogTitle>
          <DialogDescription>Add a pdf to make your chatbot </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            ref={inputFileRef}
            onChange={(e) => {
              handleFileChange(e);
            }}
            id="file"
            style={{ display: "none" }}
          />
          <label
            htmlFor="file"
            className="flex w-full border py-1 items-center cursor-pointer text-black rounded-lg hover:border-customSecondary hover:bg-transparent duration-300"
          >
            <span className="w-36 mr-4 text-customSecondary flex justify-center items-centertext-lg">
              <Upload className="w-5" /> Upload file
            </span>
            {fileName === "No file selected" ? (
              <div className="flex">No file selected</div>
            ) : (
              fileName
            )}
          </label>
          <Button className="mt-4" type="submit" disabled={isSaving}>
            {isSaving ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
