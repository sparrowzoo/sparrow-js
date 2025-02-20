'use client'
import { useParams } from 'next/navigation'
export const dynamic = 'force-static';
export default function SessionPage() {
  const params = useParams<{ sessionKey: string;}>()

  // Route -> /shop/[tag]/[item]
  // URL -> /shop/shoes/nike-air-max-97
  // `params` -> { tag: 'shoes', item: 'nike-air-max-97' }

  return <div>
    参数为:
    {params?.sessionKey}</div>
}
