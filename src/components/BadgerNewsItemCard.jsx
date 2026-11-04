import { Image, Pressable, StyleSheet, Text } from 'react-native';

const ARTICLE_IMAGE_BASE_URL = 'https://cs571api.cs.wisc.edu/v2/rest/f26/static/hw8/';

function BadgerNewsItemCard({ article, onPress }) {
    return (
        <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Read article: ${article.title}`}
            onPress={onPress}
            style={styles.card}
        >
            <Image
                source={{ uri: `${ARTICLE_IMAGE_BASE_URL}${article.img}` }}
                style={styles.image}
                resizeMode="cover"
                accessibilityLabel={article.title}
            />
            <Text style={styles.title}>{article.title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
        overflow: 'hidden',
        borderRadius: 8,
        backgroundColor: '#ffffff',
        elevation: 3
    },
    image: {
        width: '100%',
        height: 220,
        backgroundColor: '#e0e0e0'
    },
    title: {
        padding: 12,
        fontSize: 18,
        fontWeight: 'bold'
    }
});

export default BadgerNewsItemCard;
