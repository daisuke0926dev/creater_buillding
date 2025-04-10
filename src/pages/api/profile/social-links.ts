import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { z } from 'zod';
import { initializeFirebaseAdmin } from '@/lib/firebase-admin';

const socialLinkSchema = z.object({
  platform: z.enum(['twitter', 'instagram', 'tiktok', 'niconico']),
  url: z.string().url(),
});

const socialLinksSchema = z.array(socialLinkSchema);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!['GET', 'PUT'].includes(req.method || '')) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Firebase Adminの初期化
    initializeFirebaseAdmin();

    // 認証トークンの検証
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;

    const db = getFirestore();
    const profileRef = db.collection('profiles').doc(userId);

    if (req.method === 'GET') {
      const doc = await profileRef.get();
      const data = doc.data();
      return res.status(200).json({ socialLinks: data?.socialLinks || [] });
    }

    // PUT メソッドの処理
    const validatedLinks = socialLinksSchema.parse(req.body);

    await profileRef.set(
      {
        socialLinks: validatedLinks,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return res.status(200).json({ message: 'Social links updated successfully' });
  } catch (error) {
    console.error('Error managing social links:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request data', details: error.errors });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
} 