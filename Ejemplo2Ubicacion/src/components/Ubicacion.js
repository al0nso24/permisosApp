import React, { useState } from 'react';
import {
    View, Text, Button, StyleSheet, ActivityIndicator, Linking, Alert,
} from 'react-native';
import * as Location from 'expo-location';

export default function Ubicacion() {
    const [coords, setCoords] = useState(null);
    const [estado, setEstado] = useState('Sin solicitar');
    const [cargando, setCargando] = useState(false);

    const obtenerUbicacion = async () => {
        setCargando(true);
        try {
            //1. Verificar el estado actual
            let perm = await Location.getForegroundPermissionsAsync();
            console.log(
                `[Ubicación] Permiso actual: ${perm.status} | canAskAgain: ${perm.canAskAgain}`
            );

            //2. Si no está concedido, pedirlo (si aún se puede)
            if (perm.status !== 'granted' && perm.canAskAgain) {
                perm = await Location.requestForegroundPermissionsAsync();
                console.log(`[Ubicación] Respuesta: ${perm.status} | canAskAgain: ${perm.canAskAgain}`);
            }

            //3. Denegado de forma permanente: ir a Ajustes
            if (perm.status !== 'granted') {
                setEstado(perm.canAskAgain ? 'Denegado' : 'Bloqueado');
                if (!perm.canAskAgain) {
                    Alert.alert('Ubicación bloqueada', 'Actívala en Ajustes.', [
                        { text: 'Cancelar' },
                        { text: 'Ajustes', onPress: () => Linking.openSettings() },
                    ]);
                }
                return;
            }

            //4. ¿Precisa o aproximada? (Android 12+)
            const precision = perm.android?.accuracy; //'fine' | 'coarse' | 'none'
            console.log(`[Ubicación] Precisión concedida: ${precision}`);
            setEstado(precision === 'coarse' ? 'Concedido (aproximada)' : 'Concedido (precisa)');

            //5. Verificar que el GPS esté encendido
            const gps = await Location.hasServicesEnabledAsync();
            console.log(`[Ubicación] GPS encendido: ${gps}`);
            if (!gps) {
                Alert.alert('GPS apagado', 'Enciende la ubicación del dispositivo.');
                return;
            }

            //6. Obtener la posición
            const pos = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            const { latitude, longitude, accuracy } = pos.coords;
            console.log(
                `[Ubicación] Lat ${latitude.toFixed(6)} | Lng ${longitude.toFixed(6)}` +
                ` | ±${Math.round(accuracy)} m`
            );
            setCoords(pos.coords);
        } catch (e) {
            console.log('[Ubicación] Error:', e.message);
            Alert.alert('Error', e.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <View style={s.c}>
            <Text style={s.titulo}> Mi ubicación</Text>
            <Text style={s.estado}>Permiso: {estado}</Text>

            {cargando && <ActivityIndicator size="large" />}

            {coords && (
                <View style={s.card}>
                    <Text>Latitud: {coords.latitude.toFixed(6)}</Text>
                    <Text>Longitud: {coords.longitude.toFixed(6)}</Text>
                    <Text>Precisión: ±{Math.round(coords.accuracy)} m</Text>
                    <Button
                        title="Ver en Google Maps"
                        onPress={() =>
                    Linking.openURL(
                    `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`
                    )
                    }
                    />
                </View>
            )}

            <Button title="Obtener ubicación" onPress={obtenerUbicacion} disabled={cargando} />
        </View>
    );
}

const s = StyleSheet.create({
    c: { 
        flex: 1, 
        justifyContent: 'center',
        padding: 24, 
        gap: 16 
    },

    titulo: { 
        fontSize: 26, 
        fontWeight: 'bold', 
        textAlign: 'center' 
    },

    estado: { 
        textAlign: 'center', 
        color: '#444' 
    },

    card: { 
        backgroundColor: '#eef6ff', 
        padding: 16, 
        borderRadius: 10, 
        gap: 4 
    },
});