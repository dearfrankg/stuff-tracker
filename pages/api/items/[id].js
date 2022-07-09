import { db } from "/database";

export default function handler(req, res) {
  const {
    query: { id },
    method,
    body,
  } = req;

  switch (method) {
    case "GET":
      res.status(200).json(db.items.read(Number(id)));
      break;

    case "PUT":
      res.status(200).json(db.items.update(Number(id), body));
      break;

    case "DELETE":
      res.status(200).json(db.items.delete(Number(id)));
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
