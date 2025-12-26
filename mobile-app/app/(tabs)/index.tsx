import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { StatCard } from '@/components/StatCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { api } from '@/lib/api';

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [userBalance, setUserBalance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardResult, balanceResult] = await Promise.all([
        api.dashboard.getData().catch(() => ({ dashboard: null })),
        api.user.getBalance().catch(() => null)
      ]);

      setDashboardData(dashboardResult?.dashboard);
      setUserBalance(balanceResult?.userBalance || balanceResult);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, []);

  const totalBalance = userBalance?.totalBalance || dashboardData?.balance?.total || 0;
  const recentDeposits = userBalance?.totalDeposited || dashboardData?.balance?.recentDeposits || 0;
  const pendingActions = dashboardData?.pendingActions || 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back 👋</Text>
            <Text style={styles.subtitle}>Here's your portfolio summary</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="#94A3B8" />
            {pendingActions > 0 && <View style={styles.badge} />}
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            label="Total Balance"
            value={`$${totalBalance.toFixed(2)}`}
            change="+2.5%"
            isPositive={true}
            icon="trending-up"
            color="emerald"
          />
          <StatCard
            label="Recent Deposits"
            value={`$${recentDeposits.toFixed(2)}`}
            icon="credit-card-outline"
            color="blue"
          />
          <StatCard
            label="Pending Actions"
            value={pendingActions.toString()}
            icon="alert-circle-outline"
            color="amber"
          />
        </View>

        {/* Placeholder for Charts and Tables */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderText}>Activity list will appear here</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Watchlist</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Manage</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderText}>Your watchlist items will appear here</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    backgroundColor: '#1E293B',
    borderRadius: 12,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    backgroundColor: '#EF4444',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#1E293B',
  },
  statsGrid: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  seeAll: {
    color: '#10B981',
    fontSize: 14,
  },
  placeholderCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#334155',
  },
  placeholderText: {
    color: '#64748B',
    fontSize: 14,
  },
});
