import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { shareId } = req.query;
  try {
    const apiRes = await fetch(`https://platform.leandix.com/api/chat/history/share/${shareId}`);
    if (!apiRes.ok) throw new Error("Not found");

    const data = await apiRes.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ message: "Not found" });
  }
}