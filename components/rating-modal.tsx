import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { Product } from '@/types/product';
import { useThemeColor } from '@/hooks/use-theme-color';

interface RatingModalProps {
  visible: boolean;
  product?: Product;
  onClose: () => void;
  onSubmit: (rating: number, title: string, comment: string) => void;
}

interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  author: string;
  date: string;
  helpful: number;
}

const SAMPLE_REVIEWS: Review[] = [
  {
    id: '1',
    rating: 5,
    title: 'Excellent produit!',
    comment:
      'Très satisfait de mon achat. Qualité exceptionnelle et livraison rapide.',
    author: 'Jean D.',
    date: 'il y a 5 jours',
    helpful: 24,
  },
  {
    id: '2',
    rating: 4,
    title: 'Bon rapport qualité/prix',
    comment:
      'Le produit est conforme à la description. Petit bémol sur l\'emballage.',
    author: 'Marie T.',
    date: 'il y a 2 semaines',
    helpful: 18,
  },
  {
    id: '3',
    rating: 3,
    title: 'Acceptable',
    comment: 'Correct mais rien d\'extraordinaire. S\'attendais à mieux.',
    author: 'Pierre L.',
    date: 'il y a 1 mois',
    helpful: 8,
  },
];

export const RatingModal: React.FC<RatingModalProps> = ({
  visible,
  product,
  onClose,
  onSubmit,
}) => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const [tab, setTab] = useState<'reviews' | 'form'>('reviews');
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const animRef = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(animRef, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animRef, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, animRef]);

  const handleSubmit = useCallback(() => {
    if (rating > 0 && title.trim() && comment.trim()) {
      onSubmit(rating, title, comment);
      setSubmitted(true);
      setTimeout(() => {
        setRating(0);
        setTitle('');
        setComment('');
        setSubmitted(false);
        onClose();
      }, 2000);
    }
  }, [rating, title, comment, onSubmit, onClose]);

  const overlayOpacity = animRef.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const translateY = animRef.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      statusBarTranslucent
    >
      {/* Overlay */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayOpacity,
            backgroundColor: '#000',
          },
        ]}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Modal */}
      <Animated.View
        style={[
          styles.modalContainer,
          {
            backgroundColor,
            transform: [{ translateY }],
          },
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>
              Avis client
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.closeButton, { color: textColor }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                tab === 'reviews' && {
                  borderBottomWidth: 2,
                  borderBottomColor: tintColor,
                },
              ]}
              onPress={() => setTab('reviews')}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: tab === 'reviews' ? tintColor : textColor,
                  },
                ]}
              >
                Avis ({SAMPLE_REVIEWS.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                tab === 'form' && {
                  borderBottomWidth: 2,
                  borderBottomColor: tintColor,
                },
              ]}
              onPress={() => setTab('form')}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: tab === 'form' ? tintColor : textColor,
                  },
                ]}
              >
                Écrire un avis
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {tab === 'reviews' ? (
            <ScrollView style={styles.content}>
              {SAMPLE_REVIEWS.map(review => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  textColor={textColor}
                />
              ))}
            </ScrollView>
          ) : submitted ? (
            <View style={styles.successContainer}>
              <Text style={styles.successIcon}>✓</Text>
              <Text style={[styles.successText, { color: tintColor }]}>
                Merci pour votre avis!
              </Text>
            </View>
          ) : (
            <ScrollView style={styles.content}>
              {/* Rating Stars */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  Note
                </Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                    >
                      <Text
                        style={[
                          styles.star,
                          {
                            fontSize: 40,
                            color: star <= rating ? tintColor : '#ddd',
                          },
                        ]}
                      >
                        ★
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Title */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  Titre
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: tintColor,
                      color: textColor,
                    },
                  ]}
                  placeholder="Ex: Excellent produit!"
                  placeholderTextColor="#999"
                  value={title}
                  onChangeText={setTitle}
                  maxLength={100}
                />
              </View>

              {/* Comment */}
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  Commentaire
                </Text>
                <TextInput
                  style={[
                    styles.textarea,
                    {
                      borderColor: tintColor,
                      color: textColor,
                    },
                  ]}
                  placeholder="Partagez votre expérience..."
                  placeholderTextColor="#999"
                  value={comment}
                  onChangeText={setComment}
                  maxLength={500}
                  multiline
                  numberOfLines={5}
                />
              </View>
            </ScrollView>
          )}

          {/* Footer */}
          {tab === 'form' && !submitted && (
            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: tintColor,
                    opacity: rating > 0 && title && comment ? 1 : 0.5,
                  },
                ]}
                onPress={handleSubmit}
                disabled={rating === 0 || !title || !comment}
              >
                <Text style={styles.buttonText}>Envoyer l'avis</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
};

interface ReviewCardProps {
  review: Review;
  textColor: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, textColor }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <View>
        <Text style={[styles.reviewTitle, { color: textColor }]}>
          {review.title}
        </Text>
        <View style={styles.reviewMeta}>
          <Text style={styles.reviewRating}>
            {'★'.repeat(review.rating)}
            {'☆'.repeat(5 - review.rating)}
          </Text>
          <Text style={styles.reviewAuthor}>{review.author}</Text>
          <Text style={styles.reviewDate}>{review.date}</Text>
        </View>
      </View>
    </View>
    <Text style={[styles.reviewComment, { color: textColor }]}>
      {review.comment}
    </Text>
    <View style={styles.reviewFooter}>
      <Text style={styles.reviewHelpful}>👍 {review.helpful} trouvé utile</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    zIndex: 2,
  },
  safeArea: {
    flex: 1,
    display: 'flex',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontWeight: '500',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  successText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  star: {
    color: '#ddd',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  reviewCard: {
    paddingVertical: 12,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  reviewHeader: {
    marginBottom: 8,
  },
  reviewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewRating: {
    fontSize: 12,
    color: '#ff9800',
  },
  reviewAuthor: {
    fontSize: 12,
    color: '#666',
  },
  reviewDate: {
    fontSize: 11,
    color: '#999',
  },
  reviewComment: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  reviewHelpful: {
    fontSize: 11,
    color: '#999',
  },
});
