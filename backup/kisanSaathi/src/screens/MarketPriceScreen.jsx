import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import PriceCard from '../components/PriceCard';
import { getMarketPrices } from '../services/trader';

export default function MarketPriceScreen() {
  const [crop, setCrop] = useState('Wheat');
  const [loading, setLoading] = useState(false);
  const [prices, setPrices] = useState(null);

  useEffect(() => { fetchPrices(); }, [crop]);

  async function fetchPrices() {
    setLoading(true);
    try { const res = await getMarketPrices(crop); setPrices(res); } finally { setLoading(false); }
  }

  return (
    <View style={{ padding: 16, backgroundColor: '#f6fff6', flex: 1 }}>
      <Text style={{ fontWeight: '700', color: '#165c12' }}>Live Mandi Prices</Text>
      <View style={{ marginVertical: 10 }}>
        {['Wheat', 'Onion', 'Garlic'].map((c) => (
          <Text key={c} style={{ padding: 10, backgroundColor: crop === c ? '#cfe6cf' : '#eee', marginVertical: 2, borderRadius: 4 }} onPress={() => setCrop(c)}>
            {c}
          </Text>
        ))}
      </View>
      {loading ? <ActivityIndicator /> : <PriceCard price={prices} />}
    </View>
  );
}
