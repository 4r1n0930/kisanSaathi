import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import BidCard from '../components/BidCard';
import { getMyBids } from '../services/trader';

export default function MyBidsScreen() {
  const [loading, setLoading] = useState(false);
  const [bids, setBids] = useState([]);

  useEffect(() => { fetch(); }, []);
  async function fetch() { setLoading(true); try { const res = await getMyBids('demo'); setBids(res || []); } finally { setLoading(false); } }

  return (
    <View style={{ padding: 16, backgroundColor: '#f6fff6', flex: 1 }}>
      {loading ? <ActivityIndicator /> : (
        <FlatList data={bids} keyExtractor={(b) => b._id} renderItem={({ item }) => <BidCard bid={item} />} />
      )}
    </View>
  );
}
