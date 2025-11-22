import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Text, TouchableOpacity } from 'react-native';
import { Toast, useToastListener } from '@/hooks/use-toast';
import { useThemeColor } from '@/hooks/use-theme-color';

const TOAST_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  success: { bg: '#4CAF50', text: '#fff', icon: '✓' },
  error: { bg: '#f44336', text: '#fff', icon: '✕' },
  warning: { bg: '#ff9800', text: '#fff', icon: '⚠' },
  info: { bg: '#2196F3', text: '#fff', icon: 'ℹ' },
};

interface AnimatedToast extends Toast {
  anim: Animated.Value;
}

export const ToastContainer: React.FC = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const [toasts, setToasts] = useState<AnimatedToast[]>([]);

  useToastListener((newToasts: Toast[]) => {
    const existingIds = toasts.map(t => t.id);
    const newIds = newToasts.map(t => t.id);

    // Ajouter les nouveaux toasts
    newToasts.forEach(toast => {
      if (!existingIds.includes(toast.id)) {
        setToasts(prev => [
          ...prev,
          { ...toast, anim: new Animated.Value(0) },
        ]);
      }
    });

    // Supprimer les toasts qui n'existent plus
    setToasts(prev => prev.filter(t => newIds.includes(t.id)));
  });

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </View>
  );
};

interface ToastItemProps {
  toast: AnimatedToast;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast }) => {
  const config = TOAST_COLORS[toast.type] || TOAST_COLORS.info;

  React.useEffect(() => {
    Animated.timing(toast.anim, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [toast.anim]);

  const translateY = toast.anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  const opacity = toast.anim;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: config.bg,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Text style={[styles.icon, { color: config.text }]}>
        {config.icon}
      </Text>
      <Text style={[styles.message, { color: config.text }]} numberOfLines={2}>
        {toast.message}
      </Text>
      <TouchableOpacity style={styles.close}>
        <Text style={[styles.closeIcon, { color: config.text }]}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    zIndex: 999,
    pointerEvents: 'box-none',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  close: {
    padding: 4,
    marginLeft: 8,
  },
  closeIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
