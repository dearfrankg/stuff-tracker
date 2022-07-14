import { db } from "/database";

export default function handler(req, res) {
  const { method, body } = req;

  switch (method) {
    case "GET":
      res.status(200).json(db.users.list());
      break;

    case "POST":
      res.status(200).json(db.users.create(body));
      break;

    case "OPTIONS":
      res.status(200).json({});
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "OPTIONS"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
