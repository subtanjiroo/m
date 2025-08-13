import { Badge } from "@/components/ui/badge"

export function BetaBadge({wid}:{wid: number}) {
  return (
    <Badge variant="destructive" className={`uppercase text-xs font-semibold w-${wid}`}>
      Beta
    </Badge>
  )
}