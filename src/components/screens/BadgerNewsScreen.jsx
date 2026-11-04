import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import BadgerNewsItemCard from '../BadgerNewsItemCard';
import { useBadgerNews } from '../BadgerNewsContext';

function BadgerNewsScreen({ navigation }) {
    const { articles, preferences, isLoading, error, retry } = useBadgerNews();
    const filteredArticles = articles.filter((article) =>
        (article.tags ?? []).every((tag) => preferences[tag] !== false)
    );

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text style={styles.statusText}>Loading news...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.statusText}>{error}</Text>
                <Pressable
                    accessibilityRole="button"
                    onPress={retry}
                >
                    <Text style={styles.retry}>Try again</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <FlatList
            contentContainerStyle={styles.list}
            data={filteredArticles}
            keyExtractor={(article) => String(article.id)}
            renderItem={({ item }) => (
                <BadgerNewsItemCard
                    article={item}
                    onPress={() => navigation.navigate('Article', { articleId: item.fullArticleId })}
                />
            )}
            ListEmptyComponent={<Text style={styles.statusText}>No news articles match your preferences.</Text>}
        />
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
    },
    statusText: {
        marginTop: 12,
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
        padding: 12
    }
});

export default BadgerNewsScreen;
