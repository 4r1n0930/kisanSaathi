import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import BidCard from '../components/BidCard';
import { getReceivedBids } from '../services/farmer';

export default function FarmerMyBidsScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [bids, setBids] = useState([]);

  useEffect(() => { fetchBids(); }, []);

  async function fetchBids() {
    setLoading(true);
    try {
      const res = await getReceivedBids('demo-farmer-1');
      setBids(res || []);
    } finally { setLoading(false); }
  }

  return (
    <View style={{ padding: 16, backgroundColor: '#f6fff6', flex: 1 }}>
      <Text style={{ fontSize: 20, fontWeight: '800', color: '#165c12', marginBottom: 12 }}>Bids Received</Text>
      {loading ? <ActivityIndicator /> : (
        <FlatList
          data={bids}
          keyExtractor={(b) => b._id}
          renderItem={({ item }) => (
            <BidCard
              bid={item}
              onPress={() => navigation.navigate('BidDetails', { bid: item })}
            />
          )}
          ListEmptyComponent={<Text style={{ color: '#999', textAlign: 'center', marginTop: 40 }}>No bids received yet</Text>}
        />
      )}
    </View>
  );
}
