import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ItemContacto({ contacto }) {
    const nombre = contacto.name ?? 'Sin nombre';
    const telefono = contacto.phoneNumbers?.[0]?.number ?? 'Sin número';

    return (
        <View style={s.item}>
            <View style={s.avatar}>
                <Text style={s.inicial}>{nombre[0]}</Text>
            </View>
            <View>
                <Text style={s.nombre}>{nombre}</Text>
                <Text style={s.tel}>{telefono}</Text>
            </View>
        </View>
    );
}

const s = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        gap: 12,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },

    avatar: {
        width: 42, height: 42,
        borderRadius: 21,
        backgroundColor: '#4a90e2',
        justifyContent: 'center',
        alignItems: 'center',
    },

    inicial: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18
    },

    nombre: {
        fontSize: 16,
        fontWeight: '600'
    },

    tel: {
        color: '#666'
    },
});