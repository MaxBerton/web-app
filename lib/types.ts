export const REQUEST_STATUSES = [
  "draft",
  "submitted",
  "need_info",
  "estimating",
  "quote_sent",
  "accepted",
  "scheduled",
  "in_progress",
  "done",
  "invoiced",
  "paid",
  "canceled",
] as const

export type RequestStatus = (typeof REQUEST_STATUSES)[number]
