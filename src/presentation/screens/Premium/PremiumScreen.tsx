import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../../store/authStore';
import { PremiumController } from '../../../controllers/PremiumController';

const premiumController = new PremiumController();

export default function PremiumScreen() {
  const navigation = useNavigation();
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const { userInfo: user, setUserInfo } = useAuthStore();

  useEffect(() => {
    // 1. Cargar las ofertas de RevenueCat
    const loadOfferings = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (
          offerings.current !== null &&
          offerings.current.availablePackages.length !== 0
        ) {
          setPackages(offerings.current.availablePackages);
        }
      } catch (e) {
        console.log('Error al cargar ofertas', e);
        // MOCK DATA: Si no hay conexión a Google Play/RevenueCat aún, usamos esto para visualizar
        mockPackages();
      }
    };
    loadOfferings();
  }, []);

  const mockPackages = () => {
    // Datos falsos solo para que veas la UI mientras configuras la tienda
    const mocks: any = [
      {
        identifier: 'monthly',
        product: {
          priceString: '$4.99',
          title: 'Plan Mensual',
          description: 'Descuento del 5%',
        },
      },
      {
        identifier: 'yearly',
        product: {
          priceString: '$39.99',
          title: 'Plan Anual',
          description: 'Descuento del 15% + Envío gratis',
        },
      },
      {
        identifier: 'lifetime',
        product: {
          priceString: '$99.99',
          title: 'De por vida',
          description: 'Descuento del 20% para siempre',
        },
      },
    ];
    setPackages(mocks);
  };

  const handlePurchase = async () => {
    if (!selectedPackage || !user) return;

    setIsPurchasing(true);

    try {
      // await Purchases.purchasePackage(selectedPackage);

      await premiumController.actualizarPremium(user!.id, {
        premium: true,
      });

      setUserInfo({ ...user!, premium: true });

      console.log(user);

      setTimeout(() => {
        Alert.alert('¡Éxito!', 'Ahora eres Premium. Disfruta tus descuentos.');
        navigation.goBack();
      }, 1500);
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert('Error', e.message);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sé Premium</Text>
        <Text style={styles.subtitle}>
          Obtén descuentos exclusivos en todas tus compras
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.cardsContainer}>
        {packages.map((pkg, index) => {
          const isSelected = selectedPackage?.identifier === pkg.identifier;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => setSelectedPackage(pkg)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <Text
                  style={[styles.planName, isSelected && styles.textSelected]}
                >
                  {pkg.product.title}
                </Text>
                {isSelected && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color="#8B5FBF"
                  />
                )}
              </View>
              <Text style={styles.planDesc}>{pkg.product.description}</Text>
              <Text
                style={[styles.planPrice, isSelected && styles.textSelected]}
              >
                {pkg.product.priceString}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !selectedPackage && styles.buttonDisabled]}
          onPress={handlePurchase}
          disabled={!selectedPackage || isPurchasing}
        >
          {isPurchasing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Suscribirme ahora</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.termsText}>
          Cancela cuando quieras. Al suscribirte aceptas los términos y
          condiciones.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9', paddingTop: 50 },
  header: { paddingHorizontal: 20, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  cardsContainer: { paddingHorizontal: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardSelected: { borderColor: '#8B5FBF', backgroundColor: '#F4EBFB' },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planName: { fontSize: 18, fontWeight: '600', color: '#333' },
  planDesc: { fontSize: 14, color: '#666', marginVertical: 8 },
  planPrice: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  textSelected: { color: '#8B5FBF' },
  footer: { padding: 20, paddingBottom: 40 },
  button: {
    backgroundColor: '#8B5FBF',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#CCC' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  termsText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 15,
  },
});
