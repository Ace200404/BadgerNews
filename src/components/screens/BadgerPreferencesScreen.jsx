import { ActivityIndicator, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useBadgerNews } from '../BadgerNewsContext';

function BadgerPreferencesScreen() {
    const { articles, preferences, setPreference, isLoading, error, retry } = useBadgerNews();
    const tags = [...new Set(articles.flatMap((article) => article.tags ?? []))].sort();

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text style={styles.message}>Loading preferences...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.message}>{error}</Text>
                <Text accessibilityRole="button" onPress={retry} style={styles.retry}>
                    Try again
                </Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.list}>
            {tags.map((tag) => (
                <View key={tag} style={styles.row}>
                    <Text style={styles.tag}>{tag}</Text>
                    <Switch
                        accessibilityLabel={`Show ${tag} news`}
                        onValueChange={(enabled) => setPreference(tag, enabled)}
                        value={preferences[tag] !== false}
                    />
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
    },
    message: {
        textAlign: 'center',
        fontSize: 16
    },
    retry: {
        marginTop: 16,
        color: '#b00020',
        fontSize: 16,
        textDecorationLine: 'underline'
    },
    list: {
        paddingHorizontal: 16
    },
    row: {
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#cccccc'
    },
    tag: {
        flex: 1,
        marginRight: 16,
        fontSize: 16
    }
});

export default BadgerPreferencesScreen;
