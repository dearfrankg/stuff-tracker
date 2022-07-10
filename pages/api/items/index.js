import { db } from "/database";

export default function handler(req, res) {
  const { method, body, query } = req;

  switch (method) {
    case "GET":
      res.status(200).json(db.items.list(query));
      break;

    case "POST":
      res.status(200).json(db.items.create(body));
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
