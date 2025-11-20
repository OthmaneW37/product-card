import { useState } from 'react';
import { View, Modal } from 'react-native';

import { FeaturedProducts } from '@/components/featured-products';
import { ProductDetail } from '@/components/product-detail';
import { Product } from '@/types/product';

export default function HomeScreen() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setDetailModalVisible(true);
  };

  const handleCloseDetail = () => {
    setDetailModalVisible(false);
    setTimeout(() => {
      setSelectedProduct(null);
    }, 300);
  };

  return (
    <View style={{ flex: 1 }}>
      <FeaturedProducts onProductPress={handleProductPress} />

      {/* Product Detail Modal */}
      <Modal
        visible={detailModalVisible}
        animationType="slide"
        onRequestClose={handleCloseDetail}
        presentationStyle="pageSheet"
      >
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onClose={handleCloseDetail}
          />
        )}
      </Modal>
    </View>
  );
}
