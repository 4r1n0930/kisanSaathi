import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, SectionList } from 'react-native';
import BidCard from '../components/BidCard';
import ContractCard from '../components/ContractCard';
import { getMyBids, getContractsByTrader } from '../services/trader';

export default function MyBidsScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [bids, setBids] = useState([]);
  const [contracts, setContracts] = useState([]);

  useEffect(() => { fetch(); }, []);

  async function fetch() {
    setLoading(true);
    try {
      const [bidsRes, contractsRes] = await Promise.all([
        getMyBids('demo'),
        getContractsByTrader('demo'),
      ]);
      setBids(bidsRes || []);
      setContracts(contractsRes || []);
    } finally { setLoading(false); }
  }

  const sections = [
    { title: 'Active Bids', data: bids.filter(b => b.status === 'ACTIVE') },
    { title: 'Selected (Awaiting Confirmation)', data: bids.filter(b => b.status === 'SELECTED') },
    { title: 'Contracts', data: contracts },
    { title: 'History', data: bids.filter(b => b.status === 'ACCEPTED' || b.status === 'REJECTED') },
  ].filter(s => s.data.length > 0);

  if (loading) return <View style={{ padding: 16, backgroundColor: '#f6fff6', flex: 1 }}><ActivityIndicator /></View>;

  return (
    <View style={{ padding: 16, backgroundColor: '#f6fff6', flex: 1 }}>
      <Text style={{ fontSize: 20, fontWeight: '800', color: '#165c12', marginBottom: 12 }}>My Bids</Text>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item._id}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#4a664a', marginTop: 16, marginBottom: 4 }}>{title}</Text>
        )}
        renderItem={({ item, section }) => {
          if (section.title === 'Contracts') {
            return (
              <ContractCard
                contract={item}
                onPress={() => navigation.navigate('ContractDetails', { contract: item })}
              />
            );
          }
          return <BidCard bid={item} />;
        }}
        ListEmptyComponent={<Text style={{ color: '#999', textAlign: 'center', marginTop: 40 }}>No bids yet</Text>}
      />
    </View>
  );
}
