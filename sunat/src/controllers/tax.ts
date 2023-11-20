import type { Request, Response } from 'express';
import type { GetTaxesRequest } from 'src/dtos/tax/get-taxes';
import TaxModel from 'src/models/tax';

class TaxController {
  static async getTaxes(req: GetTaxesRequest, res: Response): Promise<void> {
    const { userId } = req.query;

    const tax = await TaxModel.findByUserId(userId);

    if (!tax) {
      res.status(404).json({ message: 'Tax not found' });
      return;
    }

    res.status(200).json(tax.taxes);
  }

  static async generateTaxes(req: Request, res: Response): Promise<void> {
    const { userId } = req.body as { userId: string };

    await TaxModel.generateTaxes(userId);

    res.status(200).json({ ok: true });
  }
}

export default TaxController;
