import { db } from "/database";

export default function handler(req, res) {
  const { method, body } = req;

  switch (method) {
    case "GET":
      res.status(200).json(db.images.list());
      break;

    case "POST":
      res.status(200).json(db.images.create(body));
      break;

    case "OPTIONS":
      res.status(200).json({});
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
