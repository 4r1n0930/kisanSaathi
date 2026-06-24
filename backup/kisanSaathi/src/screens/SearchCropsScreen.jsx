import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import FilterBar from '../components/FilterBar';
import CropCard from '../components/CropCard';
import { getAvailableCrops } from '../services/trader';

export default function SearchCropsScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => { fetchList(); }, []);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await getAvailableCrops();
      setItems(res || []);
    } finally { setLoading(false); }
  }

  return (
    <View style={{ padding: 16, backgroundColor: '#f6fff6', flex: 1 }}>
      <FilterBar value={query} onChange={setQuery} />
      {loading ? <ActivityIndicator /> : (
        <FlatList data={items} keyExtractor={(i) => i._id} renderItem={({ item }) => (
          <CropCard item={item} onView={() => navigation.navigate('CreateBid', { crop: item })} onBid={() => navigation.navigate('CreateBid', { crop: item })} />
        )} />
      )}
    </View>
  );
}
