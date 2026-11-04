import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState('back');
    const [foto, setFoto] = useState(null);
    const camRef = useRef(null);

    //Muestra en consola cada cambio del permiso
    useEffect(() => {
        if (permission) {
            console.log(
                `[Cámara] Permiso: ${permission.status} | canAskAgain: ${permission.canAskAgain}`
            );
        }
    }, [permission]);

    //Estado 1: cargando el estado del permiso
    if (!permission) return <View style={s.centro}><Text>Cargando…</Text></View>;

    //Estado 2: sin permiso, se muestra una explicación (rationale)
    if (!permission.granted) {
        return (
            <View style={s.centro}>
                <Text style={s.icono}> </Text>
                <Text style={s.titulo}>Necesitamos tu cámara</Text>
                <Text style={s.texto}>
                    La usamos solo para tomar fotos dentro de la app. No guardamos nada sin tu permiso.
                </Text>
                {permission.canAskAgain ? (
                    <Button title="Permitir cámara" onPress={requestPermission} />
                ) : (
                    <Button title="Abrir Ajustes" onPress={() => Linking.openSettings()} />
                )}
            </View>
        );
    }

    //Estado 3: foto tomada
    if (foto) {
        return (
            <View style={s.centro}>
                <Image source={{ uri: foto }} style={s.preview} />
                <Button title="Tomar otra" onPress={() => setFoto(null)} />
            </View>
        );
    }

    const tomarFoto = async () => {
        const r = await camRef.current?.takePictureAsync({ quality: 0.7 });
        if (r) {
            console.log(`[Cámara] Foto: ${r.uri} (${r.width}x${r.height})`);
            setFoto(r.uri);
        }
    };

    const cambiarCamara = () => {
        const nueva = facing === 'back' ? 'front' : 'back';
        console.log(`[Cámara] Cambiando a cámara: ${nueva}`);
        setFacing(nueva);
    };

    // Estado 4: cámara activa
    return (
        <View style={{ flex: 1 }}>
            <CameraView ref={camRef} style={{ flex: 1 }} facing={facing} />
            <View style={s.barra}>
                <TouchableOpacity onPress={cambiarCamara}>
                    <Text style={s.btn}> </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={tomarFoto} style={s.disparador} />
                <View style={{ width: 40 }} />
            </View>
        </View>
 );
}

const s = StyleSheet.create({
    centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 12 },
    icono: { fontSize: 64 },
    titulo: { fontSize: 22, fontWeight: 'bold' },
    texto: { textAlign: 'center', color: '#555' },
    preview: { width: 300, height: 400, borderRadius: 12 },
    barra: {
        position: 'absolute', bottom: 40, left: 0, right: 0,
        flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    },
    btn: { fontSize: 32 },
    disparador: {
        width: 72, height: 72, borderRadius: 36,
        backgroundColor: '#fff', borderWidth: 4, borderColor: '#ccc',
    },
});