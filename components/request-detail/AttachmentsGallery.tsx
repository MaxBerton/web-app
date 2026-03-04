import Image from "next/image"

type AttachmentItem = {
  id: string
  url: string | null
  createdAt: string
  isImage?: boolean
}

type AttachmentsGalleryProps = {
  items: AttachmentItem[]
}

export function AttachmentsGallery({ items }: AttachmentsGalleryProps) {
  if (items.length === 0) {
    return (
      <section className="card" aria-labelledby="attachments-heading">
        <h2 id="attachments-heading" className="mb-3 text-lg font-semibold text-dr-tri-dark">
          Pièces jointes
        </h2>
        <p className="text-sm text-dr-tri-muted">Aucune pièce jointe.</p>
      </section>
    )
  }

  return (
    <section className="card" aria-labelledby="attachments-heading">
      <h2 id="attachments-heading" className="mb-3 text-lg font-semibold text-dr-tri-dark">
        Pièces jointes
      </h2>
      <ul
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        style={{ listStyle: "none", margin: 0, padding: 0 }}
      >
        {items.map((file) => (
          <li key={file.id} className="overflow-hidden rounded-lg border border-dr-tri-border">
            {file.url ? (
              <>
                {file.isImage ? (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block aspect-video w-full bg-dr-tri-background"
                  >
                    <Image
                      src={file.url}
                      alt=""
                      width={320}
                      height={180}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </a>
                ) : (
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex aspect-video items-center justify-center bg-dr-tri-background p-4 text-sm text-dr-tri-muted hover:text-dr-tri-dark"
                  >
                    Télécharger le fichier
                  </a>
                )}
                <p className="px-3 py-2 text-xs text-dr-tri-muted">
                  {new Date(file.createdAt).toLocaleString("fr-FR")}
                </p>
              </>
            ) : (
              <div className="flex aspect-video items-center justify-center p-4 text-sm text-dr-tri-muted">
                Lien indisponible
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
