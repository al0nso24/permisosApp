import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Linking, ActivityIndicator, AppState } from 'react-native';
import * as Contacts from 'expo-contacts/legacy';
import ModalPermiso from './src/components/ModalPermiso';
import ItemContacto from './src/components/ItemContacto';

export default function App() {
  const [perm, setPerm] = useState(null); //{ status, canAskAgain }
  const [mostrarModal, setMostrarModal] = useState(false);
  const [contactos, setContactos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);

  const cargarContactos = useCallback(async () => {
    setCargando(true);
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
      sort: Contacts.SortTypes.FirstName,
    });
    console.log(`[Contactos] Cargados: ${data.length}`);
    console.log('[Contactos] Primeros:', data.slice(0, 3).map((c) => c.name).join(', '));
    setContactos(data);
    setCargando(false);
  }, []);

  const verificar = useCallback(async () => {
    const p = await Contacts.getPermissionsAsync();
    console.log(`[Contactos] Permiso: ${p.status} | canAskAgain: ${p.canAskAgain}`);
    setPerm(p);
    if (p.status === 'granted') cargarContactos();
    else if (p.status === 'undetermined') setMostrarModal(true);
  }, [cargarContactos]);

  useEffect(() => {
    verificar();
    //Al volver de Ajustes se vuelve a verificar
    const sub = AppState.addEventListener('change', (s) => s === 'active' && verificar());
    return () => sub.remove();
  }, [verificar]);

  const solicitar = async () => {
    setMostrarModal(false);
    const p = await Contacts.requestPermissionsAsync();
    console.log(`[Contactos] Respuesta: ${p.status} | canAskAgain: ${p.canAskAgain}`);
    setPerm(p);
    if (p.status === 'granted') cargarContactos();
  };

  const cancelar = () => {
    console.log('[Contactos] El usuario eligió "Ahora no"');
    setMostrarModal(false);
    setPerm({ status: 'denied', canAskAgain: true });
  };

  const filtrados = useMemo(
    () => contactos.filter((c) =>
      (c.name ?? '').toLowerCase().includes(busqueda.toLowerCase())
    ),
    [contactos, busqueda]
  );

  useEffect(() => {
    if (contactos.length) {
      console.log(`[Contactos] Búsqueda "${busqueda}": ${filtrados.length} resultados`);
    }
  }, [filtrados]);

  if (!perm) return <View style={s.centro}><ActivityIndicator /></View>;

  if (perm.status !== 'granted') {
    return (
      <View style={s.centro}>
        <ModalPermiso visible={mostrarModal} onContinuar={solicitar} onCancelar={cancelar} />
        <Text style={s.titulo}>Sin acceso a contactos</Text>
        {perm.canAskAgain ? (
          <Button title="Reintentar" onPress={() => setMostrarModal(true)} />
        ) : (
          <>
            <Text style={s.texto}>El permiso está bloqueado. Actívalo en Ajustes.</Text>
            <Button title="Abrir Ajustes" onPress={() => Linking.openSettings()} />
          </>
        )}
      </View>
    );
  }

  return (
    <View style={s.c}>
      <Text style={s.h1}>Mis contactos ({filtrados.length})</Text>
      <TextInput
        style={s.input}
        placeholder="Buscar…"
        value={busqueda}
        onChangeText={setBusqueda}
      />
      {cargando ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={filtrados}
          keyExtractor={(c) => c.id}
          ListEmptyComponent={<Text style={s.vacio}>Sin resultados</Text>}
      renderItem={({ item }) => <ItemContacto contacto={item} />}
 />
 )}
    </View>
  );
}

const s = StyleSheet.create({
  c: {
    flex: 1,
    padding: 16,
    paddingTop: 77,
    paddingBottom: 42
  },

  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12
  },

  h1: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },

  vacio: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888'
  },

  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  texto: {
    textAlign: 'center',
    color: '#555'
  },
});