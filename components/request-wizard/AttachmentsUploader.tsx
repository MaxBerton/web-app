"use client"

const MAX_FILES = 5
const ACCEPT = "image/*,.pdf"

type AttachmentsUploaderProps = {
  name?: string
  maxFiles?: number
}

export function AttachmentsUploader({
  name = "attachments",
  maxFiles = MAX_FILES,
}: AttachmentsUploaderProps) {
  return (
    <div className="grid gap-2">
      <label className="text-sm text-dr-tri-muted">
        Photos / documents (optionnel, max. {maxFiles} fichiers)
      </label>
      <input
        type="file"
        name={name}
        accept={ACCEPT}
        multiple
        className="block w-full text-sm text-dr-tri-muted file:mr-3 file:rounded file:border-0 file:bg-dr-tri-primary file:px-4 file:py-2 file:text-white"
      />
    </div>
  )
}
