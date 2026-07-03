import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

// Export a secret from Sanity webhook settings
const secret = process.env.SANITY_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type: string }>(
      req,
      secret
    )

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new NextResponse('Bad Request', { status: 400 })
    }

    // Revalidate paths based on the document type
    revalidatePath('/')
    
    if (body._type === 'product') {
      revalidatePath('/product/[id]', 'page')
    }

    return NextResponse.json({ status: 200, revalidated: true, now: Date.now(), body })
  } catch (err: any) {
    console.error(err)
    return new NextResponse(err.message, { status: 500 })
  }
}
