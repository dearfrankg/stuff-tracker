import { db } from "/database";

export default function handler(req, res) {
  const {
    query: { id },
    method,
    body,
  } = req;

  switch (method) {
    case "GET":
      res.status(200).json(db.containers.read(id));
      break;

    case "PUT":
      res.status(200).json(db.containers.update(id, body));
      break;

    case "DELETE":
      res.status(200).json(db.containers.delete(id));
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
