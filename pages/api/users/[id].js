import { db } from "/database";

export default function handler(req, res) {
  const {
    query: { id },
    method,
    body,
  } = req;

  switch (method) {
    case "GET":
      res.status(200).json(db.users.read(id));
      break;

    case "PUT":
      res.status(200).json(db.users.update(id, body));
      break;

    case "DELETE":
      res.status(200).json(db.users.delete(id));
      break;

    case "OPTIONS":
      res.status(200).json({});
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE", "OPTIONS"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
