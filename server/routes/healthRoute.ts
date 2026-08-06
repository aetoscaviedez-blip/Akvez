import { Request, Response } from "express";

export function handleHealth(req: Request, res: Response): void {
  res.json({ status: "ok", message: "Servidor AKVEZ activo." });
}
