import { SharedComparisonView } from '@/components/compare/SharedComparisonView'

export default function SharedComparePage({ params }: { params: { id: string } }) {
  return <SharedComparisonView id={params.id} />
}
