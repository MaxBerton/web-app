"use client"

import { useRef } from "react"

const MAX_FILES = 5

type StepAttachmentsProps = {
  inputRef: React.RefObject<HTMLInputElement | null>
  onFilesChange?: (files: File[]) => void
}

export function StepAttachments({ inputRef, onFilesChange }: StepAttachmentsProps) {
  return (
    <div className="grid gap-2">
      <p className="text-sm text-dr-tri-muted">
        Photos ou documents utiles (optionnel, max. {MAX_FILES} fichiers).
      </p>
      <input
        ref={inputRef}
        type="file"
        name="attachments"
        accept="image/*,.pdf"
        multiple
        onChange={(e) => {
          const list = e.target.files
          if (list && onFilesChange) {
            onFilesChange(Array.from(list).slice(0, MAX_FILES))
          }
        }}
        className="block w-full text-sm text-dr-tri-muted file:mr-3 file:rounded file:border-0 file:bg-dr-tri-primary file:px-4 file:py-2 file:text-white"
      />
    </div>
  )
}
