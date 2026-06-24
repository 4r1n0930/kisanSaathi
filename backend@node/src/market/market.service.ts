import { getMandiPrice } from './mandi.api';

export const MarketService = {
  async getPrices(crop: string) {
    const price = await getMandiPrice(crop);
    return {
      crop,
      ...price,
      mandiName: 'Azadpur Mandi',
      current: price.recommended,
    };
  },
};
