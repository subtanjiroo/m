// pages/shared/[name]/[shareId].tsx
export default function SharedChatPage() {
  return null; // Không còn render từ React nữa
}

export async function getServerSideProps({ req, res, params }) {
  const { name, shareId } = params;

  const baseUrl = `http://link_preview-nextjs-1:3000`;
  const apiUrl = `${baseUrl}/api/chat/${shareId}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    res.writeHead(302, { Location: '/shared/notfound' });
    res.end();
    return { props: {} };
  }

  const data = await response.json();
  const messages = data.messages || [];

  // Build HTML string
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${name ? `${name} - Shared Chat` : 'Shared Chat'}</title>
        <meta name="description" content="Chat shared by ${name || 'someone'}" />
        <meta property="og:title" content="${name || 'Shared Chat'}" />
        <meta property="og:description" content="Chat shared by ${name || 'someone'}" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${process.env.NEXT_PUBLIC_SITE_URL}/shared/${name}/${shareId}" />
      </head>
      <body class="h-dvh w-screen bg-slate-900">
        <header style="position:fixed;top:0;left:0;right:0;z-index:50;background:rgba(15,23,42,0.8);backdrop-blur:4px;border-bottom:1px solid rgba(71,85,105,0.5);padding:1rem;">
          <a href="https://platform.leandix.com/reasoning" style="background: linear-gradient(to right, #3b82f6, #8b5cf6);color:white;padding:0.5rem 1rem;border-radius:0.5rem;text-decoration:none;">Về trang chủ</a>
        </header>
        <div style="padding-top:5rem;">
          <pre>${JSON.stringify(messages, null, 2)}</pre>
        </div>
      </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html');
  res.write(html);
  res.end();

  return { props: {} }; // Không dùng props nữa
}
