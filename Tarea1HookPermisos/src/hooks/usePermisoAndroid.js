import { useCallback, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform, AppState, Linking } from 'react-native';

//'android.permission.CAMERA' → 'CAMERA' (para la consola)
const corto = (permiso) => permiso.replace('android.permission.', '');

export function usePermisoAndroid(permiso, rationale) {
    const [estado, setEstado] = useState('cargando');

    const verificar = useCallback(async () => {
        if (Platform.OS !== 'android') return setEstado('granted');
        const ok = await PermissionsAndroid.check(permiso);
        console.log(`[Hook] ${corto(permiso)} → check: ${ok}`);

        //Si no está concedido, se conserva never_ask_again si ya se conocía
        setEstado((prev) => (ok ? 'granted' : prev === 'never_ask_again' ? prev : 'denied'));
    }, [permiso]);

    const solicitar = useCallback(async () => {
        const r = await PermissionsAndroid.request(permiso, rationale);

        console.log(`[Hook] ${corto(permiso)} → request: ${r}`);
        setEstado(r);
        return r;
    }, [permiso, rationale]);

    useEffect(() => {
        verificar();

        //Al volver de Ajustes se vuelve a verificar
        const sub = AppState.addEventListener('change', (s) => s === 'active' && verificar());
        return () => sub.remove();
    }, [verificar]);

    return {
        estado,
        solicitar,
        abrirAjustes: Linking.openSettings,
        concedido: estado === 'granted',
    };
}