"use client";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { File } from "@prisma/client";
type SelectFileInterface = { value: string; label: string } & File;
const AddChatbotComponentDynamic = ({
  files,
  value,
}: {
  files: SelectFileInterface[];
  value: string;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [userSelectedFiles, setUserSelectedFiles] = useState<File[]>([]);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await fetch(`/api/${value}/chatbot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: userSelectedFiles,
        name: ((e.target as HTMLInputElement).name as any).value,
      }),
    })
      .then((res) => res.json())
      .then((result) => console.log(result, "final"))
      .catch((e) => {
        console.log({ e });
        setIsSaving(false);
        alert("Plese try again");
      });
    router.refresh();
    setIsSaving(false);
    setOpen(false);
  };
  const animatedComponents = makeAnimated();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Add Chatbot {value}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Chatbot</DialogTitle>
          <DialogDescription>Create your chatbot </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          <label htmlFor="name">Chatbot name</label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="border border-gray-200 rounded-lg mb-4 px-2 py-1"
          />
          <label htmlFor="name">Select files</label>
          <Select
            closeMenuOnSelect={false}
            components={animatedComponents}
            defaultValue={[]}
            required={true}
            className="dark:text-black"
            onChange={(choice) =>
              setUserSelectedFiles(() => {
                return (choice as SelectFileInterface[]).map((f) => {
                  const { label, value, ...other } = f;
                  return other;
                });
              })
            }
            isMulti
            options={files}
          />
          <div className="">
            {" "}
            <Button type="submit" disabled={isSaving} className="mt-4">
              {isSaving ? "Creating..." : "Create chatbot"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default AddChatbotComponentDynamic;
