// pages/shared/[name]/[shareId].ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, shareId } = req.query;

  const baseUrl = `http://link_preview-nextjs-1:3000`;
  const apiUrl = `${baseUrl}/api/chat/${shareId}`;
  const response = await fetch(apiUrl as string);

  if (!response.ok) {
    res.writeHead(302, { Location: '/shared/notfound' });
    res.end();
    return;
  }

  const data = await response.json();
  const messages = data.messages || [];

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://cdn.tailwindcss.com"></script>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${name ? `${name} - Shared Chat` : 'Shared Chat'}</title>
    <meta name="description" content="Chat shared by ${name || 'someone'}" />
  </head>
  <body class="h-dvh w-screen bg-slate-900">
    <div style="padding-top:5rem;">
      <pre>${JSON.stringify(messages, null, 2)}</pre>
    </div>
  </body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.write(html);
  res.end();
}
