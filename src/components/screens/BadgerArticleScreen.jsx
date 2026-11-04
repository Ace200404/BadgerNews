import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CS571 from '@cs571/mobile-client';

const ARTICLE_URL = 'https://cs571api.cs.wisc.edu/v2/rest/f26/hw8/article';

function BadgerArticleScreen({ route }) {
    const { articleId } = route.params;
    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    async function openFullArticle() {
        try {
            await Linking.openURL(article.url);
        } catch {
            Alert.alert('Unable to open article', 'Please try again later.');
        }
    }

    useFocusEffect(
        useCallback(() => {
            const controller = new AbortController();
            let isActive = true;
            fadeAnim.setValue(0);
            setArticle(null);
            setIsLoading(true);
            setError(null);

            async function loadArticle() {
                const badgerId = CS571.getBadgerId();
                if (!badgerId) {
                    throw new Error('The Badger ID is not configured. Check EXPO_PUBLIC_CS571_BADGER_ID and restart Expo.');
                }

                const response = await fetch(
                    `${ARTICLE_URL}?id=${encodeURIComponent(articleId)}`,
                    {
                        headers: { 'X-CS571-ID': badgerId },
                        signal: controller.signal
                    }
                );

                if (!response.ok) {
                    throw new Error(`Could not load this article (HTTP ${response.status}).`);
                }

                const data = await response.json();
                if (!Array.isArray(data.body)) {
                    throw new Error('The article service returned an unexpected response.');
                }

                if (!isActive) {
                    return;
                }

                setArticle(data);
                setIsLoading(false);
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true
                }).start();
            }

            loadArticle().catch((requestError) => {
                if (isActive && requestError.name !== 'AbortError') {
                    setError(requestError.message || 'An unexpected error occurred while loading the article.');
                    setIsLoading(false);
                }
            });

            return () => {
                isActive = false;
                controller.abort();
                fadeAnim.stopAnimation();
            };
        }, [articleId, fadeAnim, reloadKey])
    );

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text style={styles.statusText}>The content is loading!</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.statusText}>{error}</Text>
                <Pressable
                    accessibilityRole="button"
                    onPress={() => setReloadKey((key) => key + 1)}
                >
                    <Text style={styles.retry}>Try again</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.content}>
            <Animated.View style={{ opacity: fadeAnim }}>
                <Text style={styles.title}>{article.title}</Text>
                <Text style={styles.byline}>By {article.author}</Text>
                <Text style={styles.byline}>Posted {article.posted}</Text>
                {article.body.map((paragraph, index) => (
                    <Text key={`${article.id ?? articleId}-${index}`} style={styles.paragraph}>
                        {paragraph}
                    </Text>
                ))}
                <Pressable
                    accessibilityRole="link"
                    onPress={openFullArticle}
                    style={styles.fullArticleLink}
                >
                    <Text style={styles.linkText}>Read full article here.</Text>
                </Pressable>
            </Animated.View>
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
    content: {
        padding: 16
    },
    title: {
        marginBottom: 8,
        fontSize: 24,
        fontWeight: 'bold'
    },
    byline: {
        marginBottom: 4,
        color: '#555555',
        fontSize: 14
    },
    paragraph: {
        marginTop: 16,
        fontSize: 16,
        lineHeight: 24
    },
    fullArticleLink: {
        alignSelf: 'flex-start',
        marginTop: 20,
        marginBottom: 8
    },
    linkText: {
        color: '#005a9c',
        fontSize: 16,
        textDecorationLine: 'underline'
    }
});

export default BadgerArticleScreen;
