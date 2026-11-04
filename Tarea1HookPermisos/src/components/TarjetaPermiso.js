import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { usePermisoAndroid } from '../hooks/usePermisoAndroid';

export default function TarjetaPermiso({ titulo, permiso, accion }) {
    const { estado, solicitar, abrirAjustes, concedido } = usePermisoAndroid(permiso);

    const usar = () => {
        console.log(`[Tarjeta] Usar ${titulo}`);
        accion();
    };

    return (
        <View style={s.card}>
            <Text style={s.titulo}>{titulo}</Text>
            <Text>
                Estado: <Text style={{ fontWeight: 'bold', color: color(estado) }}>{estado}</Text>
            </Text>
            {concedido && <Button title={`Usar ${titulo}`} onPress={usar} />}
            {estado === 'denied' && <Button title="Solicitar permiso" onPress={solicitar} />}
            {estado === 'never_ask_again' && (
                <Button title="Abrir Ajustes" color="#c0392b" onPress={abrirAjustes} />
            )}
        </View>
    );
}

const color = (e) =>
    e === 'granted' ? 'green'
        : e === 'never_ask_again' ? 'red'
            : e === 'denied' ? 'orange'
                : 'gray';

const s = StyleSheet.create({
    card: {
        backgroundColor: '#f4f4f4',
        padding: 16,
        borderRadius: 10,
        gap: 8
    },

    titulo: {
        fontSize: 18,
        fontWeight: '600'
    },
});