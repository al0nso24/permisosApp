import React from 'react';
import { Text, StyleSheet, PermissionsAndroid, Alert, ScrollView } from 'react-native';
import TarjetaPermiso from './TarjetaPermiso';

const P = PermissionsAndroid.PERMISSIONS;

export default function Permisos() {
    return (
        <ScrollView contentContainerStyle={s.c}>
            <Text style={s.h1}>Hook de permisos</Text>

            <TarjetaPermiso
                titulo="Cámara"
                permiso={P.CAMERA}
                accion={() => Alert.alert('Cámara', 'Aquí abrirías la cámara')}
            />
            <TarjetaPermiso
            titulo="Micrófono"
            permiso={P.RECORD_AUDIO}
            accion={() => Alert.alert('Micrófono', 'Aquí grabarías audio')}
            />
            <TarjetaPermiso
                titulo="Ubicación"
                permiso={P.ACCESS_FINE_LOCATION}
                accion={() => Alert.alert('Ubicación', 'Aquí leerías el GPS')}
            />
        </ScrollView>
    );
}

const s = StyleSheet.create({
    c: { 
        padding: 24, 
        paddingTop: 60, 
        gap: 12 
    },

    h1: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 8 
    },
});