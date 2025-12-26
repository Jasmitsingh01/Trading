import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface StatCardProps {
    label: string;
    value: string;
    change?: string;
    isPositive?: boolean;
    icon: any; // Icon name for MaterialCommunityIcons
    color: "emerald" | "blue" | "amber" | "purple";
    subtext?: string;
    action?: React.ReactNode;
}

export function StatCard({ label, value, change, isPositive, icon, color, subtext, action }: StatCardProps) {
    const colorMap = {
        emerald: '#10B981',
        blue: '#3B82F6',
        amber: '#F59E0B',
        purple: '#8B5CF6',
    };

    const selectedColor = colorMap[color];

    return (
        <View style={[styles.card, { borderLeftColor: selectedColor, borderLeftWidth: 4 }]}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.label}>{label}</Text>
                    <Text style={styles.value}>{value}</Text>
                </View>
                <View style={[styles.iconContainer, { backgroundColor: `${selectedColor}1A` }]}>
                    <MaterialCommunityIcons name={icon} size={24} color={selectedColor} />
                </View>
            </View>

            {(change || subtext) && (
                <View style={styles.footer}>
                    {change && (
                        <View style={styles.changeContainer}>
                            <MaterialCommunityIcons
                                name={isPositive ? "arrow-top-right" : "arrow-bottom-right"}
                                size={16}
                                color={isPositive ? '#10B981' : '#EF4444'}
                            />
                            <Text style={[styles.changeText, { color: isPositive ? '#10B981' : '#EF4444' }]}>
                                {change}
                            </Text>
                        </View>
                    )}
                    {subtext && <Text style={styles.subtext}>{subtext}</Text>}
                </View>
            )}

            {action && <View style={styles.action}>{action}</View>}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    label: {
        color: '#94A3B8',
        fontSize: 14,
        marginBottom: 4,
    },
    value: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    iconContainer: {
        padding: 10,
        borderRadius: 12,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    changeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    changeText: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 2,
    },
    subtext: {
        color: '#64748B',
        fontSize: 12,
    },
    action: {
        marginTop: 12,
    }
});
