import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

//Explicación (rationale) que se muestra ANTES del diálogo del sistema
export default function ModalPermiso({ visible, onContinuar, onCancelar }) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancelar}>
            <View style={s.fondo}>
                <View style={s.modal}>
                    <Text style={s.titulo}> Acceso a contactos</Text>
                    <Text style={s.texto}>
                        Usamos tus contactos solo para mostrarlos en esta lista.
                        No se envían a ningún servidor.
                    </Text>
                    <Button title="Continuar" onPress={onContinuar} />
                    <Button title="Ahora no" color="#888" onPress={onCancelar} />
                </View>
            </View>
        </Modal>
    );
}

const s = StyleSheet.create({
    fondo: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 24
    },

    modal: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        gap: 10
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