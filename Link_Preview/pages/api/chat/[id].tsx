// pages/api/chat/[name]/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, id } = req.query; // Lấy cả name và id từ URL

  try {
    // URL gọi đến API ngoài — thêm cả name vào nếu backend của bạn cần
    const apiUrl = `https://platform.leandix.com/api/chat/history/share/${id}`;

    const apiRes = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: "Not found" });
    }

    const data = await apiRes.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Lỗi server:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
