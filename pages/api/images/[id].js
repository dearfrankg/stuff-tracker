import { db } from "/database";

export default function handler(req, res) {
  const {
    query: { id },
    method,
    body,
  } = req;

  switch (method) {
    case "GET":
      res.status(200).json(db.images.read(id));
      break;

    case "PUT":
      res.status(200).json(db.images.update(id, body));
      break;

    case "DELETE":
      res.status(200).json(db.images.delete(id));
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
