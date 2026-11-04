import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, Button, StyleSheet, PermissionsAndroid,
  Platform, Alert, Linking, AppState, ScrollView,
} from 'react-native';

const P = PermissionsAndroid.PERMISSIONS;

//Permisos que maneja el panel
const PERMISOS = [
  { key: P.CAMERA, nombre: 'Cámara' },
  { key: P.RECORD_AUDIO, nombre: 'Micrófono' },
  //POST_NOTIFICATIONS solo existe desde Android 13 (API 33)
  ...(Platform.Version >= 33
    ? [{ key: P.POST_NOTIFICATIONS, nombre: 'Notificaciones' }]
    : []),
];

//Convierte { 'android.permission.CAMERA': x } en { Cámara: x } para la consola
const porNombre = (obj) =>
  JSON.stringify(Object.fromEntries(PERMISOS.map((p) => [p.nombre, obj[p.key]])));

export default function App() {
  const [estados, setEstados] = useState({});

  //check() devuelve true/false: no distingue entre denied y never_ask_again
  const verificarTodos = useCallback(async () => {
    if (Platform.OS !== 'android') return;
    const concedidos = {};
    for (const p of PERMISOS) {
      concedidos[p.key] = await PermissionsAndroid.check(p.key);
    }
    console.log('[Permisos] Verificación:', porNombre(concedidos));
    setEstados((prev) => {
      const nuevo = {};
      for (const p of PERMISOS) {
        if (concedidos[p.key]) nuevo[p.key] = 'granted';
        else if (prev[p.key] === 'granted') nuevo[p.key] = 'denied'; //revocado en Ajustes
        else nuevo[p.key] = prev[p.key] ?? 'sin pedir';
      }
      return nuevo;
    });
  }, []);

  useEffect(() => {
    console.log(`[Permisos] Android API ${Platform.Version}`);
    verificarTodos();
    // Al volver de Ajustes se vuelve a verificar
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') verificarTodos();
    });
    return () => sub.remove();
  }, [verificarTodos]);

  const pedirUno = async (permiso) => {
    const resultado = await PermissionsAndroid.request(permiso.key, {
      title: `Permiso de ${permiso.nombre}`,
      message: `Necesitamos acceso a ${permiso.nombre.toLowerCase()} para continuar.`,
      buttonPositive: 'Aceptar',
      buttonNegative: 'Cancelar',
    });
    console.log(`[Permisos] ${permiso.nombre} → ${resultado}`);
    setEstados((e) => ({ ...e, [permiso.key]: resultado }));

    if (resultado === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      Alert.alert(
        `Activa ${permiso.nombre} manualmente en Ajustes.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir Ajustes', onPress: () => Linking.openSettings() },
        ]
      );
    }
  };

  const pedirTodos = async () => {
    const resultados = await PermissionsAndroid.requestMultiple(
      PERMISOS.map((p) => p.key)
    );
    console.log('[Permisos] Resultado múltiple:', porNombre(resultados));
    setEstados((e) => ({ ...e, ...resultados }));
  };

  if (Platform.OS !== 'android') {
    return <View style={s.c}><Text>Este ejemplo es solo para Android</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={s.c}>
      <Text style={s.titulo}>Panel de permisos</Text>
      <Text style={s.sub}>Android API {Platform.Version}</Text>

      {PERMISOS.map((p) => (
        <View key={p.key} style={s.card}>
          <Text style={s.nombre}>{p.nombre}</Text>
          <Text style={[s.estado, { color: color(estados[p.key]) }]}>
            {estados[p.key] ?? 'sin pedir'}
          </Text>
          <Button title="Solicitar" onPress={() => pedirUno(p)} />
        </View>
      ))}

      <View style={{ marginTop: 16 }}>
        <Button title="Solicitar todos" onPress={pedirTodos} />
      </View>
      <View style={{ marginTop: 8 }}>
        <Button title="Abrir Ajustes" color="#555" onPress={() => Linking.openSettings()} />
      </View>
    </ScrollView>
 );
}

const color = (e) =>
  e === 'granted' ? 'green'
    : e === 'never_ask_again' ? 'red'
      : e === 'denied' ? 'orange'
        : 'gray';

const s = StyleSheet.create({
  c: { 
    padding: 24, 
    paddingTop: 60 
  },

  titulo: { 
    fontSize: 24, 
    fontWeight: 'bold' 
  },

  sub: { 
    color: '#666', 
    marginBottom: 16 
  },

  card: { 
    padding: 16, 
    backgroundColor: '#f2f2f2', 
    borderRadius: 10, 
    marginBottom: 12 
  },
  
  nombre: { 
    fontSize: 18, 
    fontWeight: '600' 
  },

  estado: { 
    marginVertical: 6, 
    fontWeight: 'bold' 
  },
});