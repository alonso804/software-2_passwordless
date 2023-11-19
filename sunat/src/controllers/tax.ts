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

  static async generateTaxes(_req: Request, res: Response): Promise<void> {
    await TaxModel.generateTaxes('6513bc22a7dd64540b4f6b15');

    res.status(200).json({ ok: true });
  }
}

export default TaxController;
